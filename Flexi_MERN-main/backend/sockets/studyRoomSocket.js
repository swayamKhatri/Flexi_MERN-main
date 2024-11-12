// backend/sockets/studyRoomSocket.js
const StudyRoom = require('../models/StudyRoom');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a study room
        socket.on('joinRoom', ({ roomId, userId }) => {
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
        });

        // Handle new message
        socket.on('newMessage', async ({ roomId, userId, text }) => {
            const message = { sender: userId, text, timestamp: new Date() };
            await StudyRoom.findByIdAndUpdate(roomId, { $push: { messages: message } });
            io.to(roomId).emit('message', message); // Broadcast message to room
        });

        // Leave room
        socket.on('leaveRoom', ({ roomId, userId }) => {
            socket.leave(roomId);
            console.log(`User ${userId} left room ${roomId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
