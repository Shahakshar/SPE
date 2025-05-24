import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export function useVideoChat(roomId, userId, userName) {

  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState(null);
  const [message, setMessage] = useState('Waiting for another participant...');
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [remoteUser, setRemoteUser] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const SOCKET_SERVER_URL = window.env?.VITE_BACKEND_URL || 'http://localhost:7000';
  // const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'ws://backend-service:7000/socket.io';
  // const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://192.168.49.2:30700/socket.io';
  // const SOCKET_SERVER_URL = window.location.origin;

  // console.log(SOCKET_SERVER_URL);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      path: '/socket.io',
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Setup WebRTC peer connection
  const setupPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    // Add local tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', event.candidate, roomId, userId);
      }
    };

    // Handle incoming tracks (remote stream)
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Connection state changes
    peerConnection.onconnectionstatechange = (event) => {
      if (peerConnection.connectionState === 'connected') {
        setIsConnected(true);
        setMessage('Connected! You are now in a consultation.');
      } else if (peerConnection.connectionState === 'disconnected') {
        setIsConnected(false);
        setMessage('The other participant disconnected.');
      }
    };
  };

  // Handle when another user connects
  const handleUserConnected = async (newUserId, userName) => {
    // console.log('User connected:', newUserId, userName);
    setRemoteUserId(newUserId);
    setMessage('Another participant joined. Setting up connection...');

    // Create and send offer
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', offer, roomId, userId);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  // Handle when a user disconnects
  const handleUserDisconnected = (disconnectedUserId) => {
    if (disconnectedUserId === remoteUserId) {
      setRemoteUserId(null);
      setIsConnected(false);
      setMessage('The other participant left the consultation.');

      // Reset remote video
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    }
  };

  const handleUpdateList = (socketUserId, users) => {

    // console.log('CurrentUser:', userId);
    // console.log('SocketUser:', socketUserId);
    // console.log('User list:', users);

    const otherUser = users.find(user => user.userId !== userId);
    if (otherUser) {
      // console.log('Other user:', otherUser);
      setRemoteUser(otherUser.newUserName);
      setMessage(`Connected to ${otherUser.newUserName}`);
    }
    else {
      setRemoteUser(null);
      setMessage('Waiting for another participant...');
    }
    // console.log('Updated user list:', users);
  }

  // Handle incoming WebRTC offer
  const handleOffer = async (offer, fromUserId) => {
    try {
      setRemoteUserId(fromUserId);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', answer, roomId, userId);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  // Handle incoming WebRTC answer
  const handleAnswer = async (answer, fromUserId) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  // Handle incoming ICE candidates
  const handleIceCandidate = async (candidate, fromUserId) => {
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  // Handle when room is full
  const handleRoomFull = () => {
    setIsRoomFull(true);
    setMessage('This consultation room is full. Please try another room.');
  };

  // Handle when room has two participants
  const handleRoomReady = () => {
    setMessage('Both participants are here. Starting consultation...');
  };

  // Setup socket events and WebRTC
  useEffect(() => {
    if (!socket) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Media devices API not available in this browser');
      setMessage('Your browser does not support video calls. Please use Chrome, Firefox, or Safari.');
      return;
    }

    // Request camera and microphone access
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Join room after getting media
        socket.emit('join-room', roomId, userId, userName);

        // Configure WebRTC peer connection
        setupPeerConnection();

        // Handle socket events
        socket.on('user-connected', handleUserConnected);
        socket.on('user-disconnected', handleUserDisconnected);
        socket.on('update-list', handleUpdateList);
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('room-full', handleRoomFull);
        socket.on('room-ready', handleRoomReady);
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        setMessage('Error accessing camera and microphone. Please check permissions.');
      });

    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('room-full');
      socket.off('room-ready');
      socket.off('update-list');

      // Clean up media streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, roomId, userId]);

  // Media controls
  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const enabled = !audioTracks[0].enabled;
        audioTracks[0].enabled = enabled;
        setMicEnabled(enabled);
        return enabled;
      }
    }
    return false;
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const enabled = !videoTracks[0].enabled;
        videoTracks[0].enabled = enabled;
        setCameraEnabled(enabled);
        return enabled;
      }
    }
    return false;
  };

  const endCall = () => {
    if (socket) {
      socket.emit('leave-room', roomId, userId);
    }
    navigate('/appointment', { replace: true });
  };

  return {
    message,
    isConnected,
    isRoomFull,
    localVideoRef,
    remoteVideoRef,
    toggleMicrophone,
    toggleCamera,
    endCall,
    micEnabled,
    cameraEnabled,
    remoteUser,
    setMessage
  };
}
