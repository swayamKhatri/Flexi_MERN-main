// backend/routes/studyRoomRoutes.js
const express = require('express');
const router = express.Router();
const StudyRoom = require('../models/StudyRoom');
const authenticate = require('../middleware/authenticate');  // Use 'authenticate' here

// Create a new study room
router.post('/create', authenticate, async (req, res) => {
    const { name, topic } = req.body;
    try {
        const room = new StudyRoom({ name, topic, members: [req.user._id] });
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: 'Error creating room' });
    }
});

// Join a study room
router.post('/:roomId/join', authenticate, async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await StudyRoom.findById(roomId);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        if (!room.members.includes(req.user._id)) {
            room.members.push(req.user._id);
            await room.save();
        }
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ error: 'Error joining room' });
    }
});

// Leave a study room
router.post('/:roomId/leave', authenticate, async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await StudyRoom.findById(roomId);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        room.members = room.members.filter(member => member.toString() !== req.user._id.toString());
        await room.save();
        res.status(200).json({ message: 'Left room successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error leaving room' });
    }
});

// Get all study rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await StudyRoom.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching rooms' });
    }
});

// Send message in a study room
router.post('/sendMessage', authenticate, async (req, res) => {  // Use 'authenticate' here too
    const { roomId, userId, text } = req.body;

    try {
        const message = { sender: userId, text, timestamp: new Date() };
        await StudyRoom.findByIdAndUpdate(roomId, { $push: { messages: message } });

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
});

module.exports = router;
