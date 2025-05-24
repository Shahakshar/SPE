// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  next();
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const rooms = {}; // {rooms -> { users: [{userId: , userName: }, {userId: , userName: }] }}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', (roomId, userId, newUserName) => {
    
    // Check if room exists
    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
    }
    
    // Limit to 2 users per room
    if (rooms[roomId].users.length >= 2) {
      socket.emit('room-full');
      return;
    }

    // Add user to room
    socket.join(roomId);
    rooms[roomId].users.push({userId, newUserName});

    console.log(rooms, rooms[roomId].users);

    socket.to(roomId).emit('user-connected', userId);
    io.to(roomId).emit('update-list', userId, rooms[roomId].users);
    
    // Notify if the room is now full
    if (rooms[roomId].users.length === 2) {
      io.to(roomId).emit('room-ready');
    }

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      if (rooms[roomId]) {
        rooms[roomId].users = rooms[roomId].users.filter(user => user.userId !== userId);
        console.log(rooms)
        console.log(rooms[roomId].users);
        socket.to(roomId).emit('user-disconnected', userId);
        
        // Clean up empty rooms
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        }
      }
    });
  });

  // WebRTC signaling
  socket.on('offer', (offer, roomId, fromUserId) => {
    socket.to(roomId).emit('offer', offer, fromUserId);
  });

  socket.on('answer', (answer, roomId, fromUserId) => {
    socket.to(roomId).emit('answer', answer, fromUserId);
  });

  socket.on('ice-candidate', (candidate, roomId, fromUserId) => {
    socket.to(roomId).emit('ice-candidate', candidate, fromUserId);
  });
});

const PORT = process.env.PORT || 7000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(`Registering with Consul at http://${SERVICE_HOST}:${SERVICE_PORT}/health`);

  // registerWithConsul();
});