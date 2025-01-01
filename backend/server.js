const express = require('express');
const { createReadStream } = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials:true,
    }
  });
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = { app, server, io };
