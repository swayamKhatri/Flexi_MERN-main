const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const StudyRoom = require('./models/StudyRoom');
const studyRoomSocket = require('./sockets/studyRoomSocket');
const studyRoomRoutes = require('./routes/studyRoomRoutes');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Initialize GoogleGenerativeAI model
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in the .env file");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Sanitize JSON Response Function
function sanitizeJsonString(str) {
    try {
        str = str.replace(/```json\s*|\s*```/g, "").trim();
        str = str.replace(/\\([^\w\s])/g, "\\\\$1");
        str = str.replace(/(\w+):/g, '"$1":');
        str = str.replace(/'([^']+)'/g, '"$1"');
        str = str.replace(/}\s*{/g, "},{");
        str = str.replace(/,\s*$/, "");
        return str;
    } catch (error) {
        console.error("Error sanitizing JSON string:", error);
        throw error;
    }
}

// Function to generate flashcard questions
async function generateFlashcardQuestions(topic, numQuestions) {
    const prompt = `Generate ${numQuestions} flashcard-style questions with answers on the topic of "${topic}". 
    Each flashcard should include:
    - A "question" field with the question text
    - An "answer" field with the correct answer as a string
    Output in JSON format.`;

    try {
        const result = await model.generateContent(prompt);
        const sanitizedResponse = sanitizeJsonString(await result.response.text());
        return JSON.parse(sanitizedResponse);
    } catch (error) {
        console.error("Error generating flashcards with Google Generative AI:", error);
        throw error;
    }
}

// Function to generate quiz questions
async function generateQuizQuestions(topic, numQuestions) {
    const prompt = `Generate ${numQuestions} quiz questions on the topic of "${topic}". 
    Each question should include:
    - A "question" field with the question text
    - An "options" field with an array of four answer choices
    - An "answer" field with the correct answer as a string
    Output strictly in JSON format.`;

    try {
        const result = await model.generateContent(prompt);
        const sanitizedResponse = sanitizeJsonString(await result.response.text());
        return JSON.parse(sanitizedResponse);
    } catch (error) {
        console.error("Error generating quiz with Google Generative AI:", error);
        throw error;
    }
}

// Function to generate book recommendations
async function generateBookRecommendations(subject) {
    const prompt = `Provide a list of the best books on the subject of "${subject}". 
    Each item should include:
    - A "title" field with the book title
    - An "author" field with the author's name
    - An "description" field with a brief description of the book
    Output strictly in JSON format.`;

    try {
        const result = await model.generateContent(prompt);
        const sanitizedResponse = sanitizeJsonString(await result.response.text());
        return JSON.parse(sanitizedResponse);
    } catch (error) {
        console.error("Error generating book recommendations with Google Generative AI:", error);
        throw error;
    }
}


// Routes
app.post('/api/generate-flashcard', async (req, res) => {
    const { topic, numQuestions } = req.body;

    if (!topic || !numQuestions) {
        return res.status(400).json({ error: "Topic and number of questions are required." });
    }

    try {
        const flashcardQuestions = await generateFlashcardQuestions(topic, numQuestions);
        res.status(200).json({ flashcards: flashcardQuestions });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate flashcards." });
    }
});

app.post('/api/generate-quiz', async (req, res) => {
    const { topic, numQuestions } = req.body;

    if (!topic || !numQuestions) {
        return res.status(400).json({ error: "Topic and number of questions are required." });
    }

    try {
        const quizQuestions = await generateQuizQuestions(topic, numQuestions);
        res.status(200).json({ quiz: quizQuestions });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate quiz." });
    }
});


// Study Room Routes
app.post('/api/generate-books', async (req, res) => {
    const { subject } = req.body;

    if (!subject) {
        return res.status(400).json({ error: "Subject is required." });
    }

    try {
        const bookRecommendations = await generateBookRecommendations(subject);
        res.status(200).json({ books: bookRecommendations });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate book recommendations." });
    }
});


// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: "Error registering user" });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Socket.io Chat in Study Rooms
studyRoomSocket(io);

// Study Room Routes
app.use('/api/studyrooms', studyRoomRoutes);

// Server Initialization
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
