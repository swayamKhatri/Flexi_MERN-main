// models/Flashcard.js
const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    questions: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);


