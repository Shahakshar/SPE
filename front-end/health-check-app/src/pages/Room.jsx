import React from 'react';
import { useParams } from 'react-router-dom';
import { useVideoChat } from '../hooks/useVideoChat';
import { VideoControls } from '../component/VideoControls';
import { VideoDisplay } from '../component/VideoDisplay';
import { StatusMessage } from '../component/StatusMessage';
import { RoomInfo } from '../component/RoomInfo';

const Room = () => {

  const { roomId, userId, userName } = useParams();
  const {
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
  } = useVideoChat(roomId, userId, userName);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Video Consultation</h1>
        
        <StatusMessage message={message} isConnected={isConnected} />
        
        <VideoDisplay 
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          micEnabled={micEnabled}
          cameraEnabled={cameraEnabled}
          userName={userName}
          remoteUser={remoteUser}
        />
        
        <RoomInfo roomId={roomId} />
        
        <VideoControls
          toggleMicrophone={toggleMicrophone}
          toggleCamera={toggleCamera}
          endCall={endCall}
          setMessage={setMessage}
          micEnabled={micEnabled}
          cameraEnabled={cameraEnabled}
        />
      </div>
    </div>
  );
};

export default Room;