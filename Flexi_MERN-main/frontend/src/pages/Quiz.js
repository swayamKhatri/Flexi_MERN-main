import React, { useState } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [quizData, setQuizData] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizComplete, setQuizComplete] = useState(false);
    const [answered, setAnswered] = useState(false);

    const handleTopicChange = (e) => setTopic(e.target.value);
    const handleNumQuestionsChange = (e) => setNumQuestions(Number(e.target.value));

    const fetchQuizData = async () => {
        if (!topic || numQuestions < 1) {
            setError('Please enter a valid topic and number of questions.');
            return;
        }

        setLoading(true);
        setError(null);
        setQuizData([]);
        setCurrentQuestion(0);
        setScore(0);
        setQuizComplete(false);
        setAnswered(false);

        try {
            const response = await fetch('http://localhost:5000/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, numQuestions })
            });
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();
            setQuizData(data.quiz);
        } catch (error) {
            setError('Failed to load quiz data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (option) => {
        setSelectedAnswer(option);
        setAnswered(true);
        if (option === quizData[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setAnswered(false);
        } else {
            setQuizComplete(true);
        }
    };

    const restartQuiz = () => {
        setQuizData([]);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setTopic('');
        setNumQuestions(5);
        setQuizComplete(false);
        setAnswered(false);
    };

    return (
        <div className="quiz-container">
            <h2>Quiz Generator</h2>

            {!quizData.length && (
                <div className="quiz-settings">
                    <label>Topic:</label>
                    <input type="text" value={topic} onChange={handleTopicChange} placeholder="e.g., Data Science" />
                    <label>Number of Questions:</label>
                    <input type="number" value={numQuestions} onChange={handleNumQuestionsChange} min="1" max="20" />
                    <button onClick={fetchQuizData} disabled={loading}>
                        {loading ? 'Loading...' : 'Start Quiz'}
                    </button>
                    {error && <p className="error">{error}</p>}
                </div>
            )}

            {!quizComplete && quizData.length > 0 && (
                <div className="quiz-question">
                    <h3>{quizData[currentQuestion].question}</h3>
                    <div className="quiz-options">
                        {quizData[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                className={`option 
                                    ${selectedAnswer === option && option === quizData[currentQuestion].answer ? 'correct' : ''}
                                    ${selectedAnswer === option && option !== quizData[currentQuestion].answer ? 'wrong' : ''}
                                    ${answered && selectedAnswer !== option ? 'disabled' : ''}
                                `}
                                onClick={() => handleAnswer(option)}
                                disabled={answered}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <button onClick={nextQuestion} disabled={!selectedAnswer} className="next-btn">
                        {currentQuestion < quizData.length - 1 ? 'Next' : 'Finish'}
                    </button>
                </div>
            )}

            {quizComplete && (
                <div className="quiz-results">
                    <h3>Quiz Completed!</h3>
                    <p>Your Score: {score} / {quizData.length}</p>
                    <button onClick={restartQuiz} className="restart-btn">Restart Quiz</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
