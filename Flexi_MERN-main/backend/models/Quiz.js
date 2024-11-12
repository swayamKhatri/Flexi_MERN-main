// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    questions: [
        {
            question: { type: String, required: true },
            options: [
                { type: String, required: true }
            ],
            answer: { type: String, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);