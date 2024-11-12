// backend/models/StudyRoom.js
const mongoose = require('mongoose');

const studyRoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    topic: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('StudyRoom', studyRoomSchema);
