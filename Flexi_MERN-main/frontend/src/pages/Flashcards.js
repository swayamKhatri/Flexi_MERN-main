import React, { useState } from 'react';
import './Flashcards.css';
import 'font-awesome/css/font-awesome.min.css';

const Flashcards = () => {
    const [flashcardData, setFlashcardData] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [numQuestions, setNumQuestions] = useState(5); // Default number of questions
    const [topic, setTopic] = useState(''); // State to store topic
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle topic input change
    const handleTopicChange = (event) => {
        setTopic(event.target.value);
    };

    // Handle number of questions input change
    const handleQuestionChange = (event) => {
        setNumQuestions(event.target.value);
    };

    // Function to fetch trivia data from API
    const fetchTriviaData = async () => {
        if (!topic) {
            setError('Please enter a topic to generate trivia.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/generate-flashcard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, numQuestions }),
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const data = await response.json();
            setFlashcardData(data.flashcards); // Update to use "flashcards" key
            setCurrentCard(0); // Resetting to the first card on new data load
        } catch (err) {
            console.error('Error fetching trivia data:', err);
            setError('Failed to load trivia data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle next card navigation
    const nextCard = () => {
        setFlipped(false);
        setCurrentCard((prevCard) => (prevCard + 1) % flashcardData.length);
    };

    // Handle previous card navigation
    const prevCard = () => {
        setFlipped(false);
        setCurrentCard((prevCard) => (prevCard - 1 + flashcardData.length) % flashcardData.length);
    };

    // Flip the flashcard
    const flipCard = () => {
        setFlipped(!flipped);
    };

    return (
        <div className="flashcards">
            {/* Topic Input */}
            <div className="controls">
                <label htmlFor="topic">Enter Topic:</label>
                <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={handleTopicChange}
                    placeholder="e.g., Science, Geography"
                    disabled={loading}
                />
            </div>

            {/* Number of Questions Input */}
            <div className="controls">
                <label htmlFor="numQuestions">Number of questions:</label>
                <input
                    type="number"
                    id="numQuestions"
                    value={numQuestions}
                    min="1"
                    max="20"
                    onChange={handleQuestionChange}
                    disabled={loading}
                />
            </div>

            {/* Generate Button */}
            <div className="controls">
                <button
                    onClick={fetchTriviaData}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Trivia'}
                </button>
                <p>{error}</p>
            </div>

            {/* Display Flashcards if Trivia Data is Available */}
            {flashcardData.length > 0 ? (
                <div>
                    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={flipCard}>
                        <div className="flashcard-front">
                            <p className="flashcard-text">{flashcardData[currentCard].question}</p>
                        </div>
                        <div className="flashcard-back">
                            <p className="flashcard-text">{flashcardData[currentCard].answer}</p>
                        </div>
                    </div>
                    <p className="flip-tip">Click to flip</p>
                    <div className="flashcard-controls">
                        <button
                            className="control-button control-button-left"
                            onClick={prevCard}
                            title="Previous"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <span className="progress">
                            Card {currentCard + 1} of {flashcardData.length}
                        </span>
                        <button
                            className="control-button control-button-right"
                            onClick={nextCard}
                            title="Next"
                        >
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            ) : (
                <p>No trivia data available</p>
            )}
        </div>
    );
};

export default Flashcards;
