// src/pages/FAQ.js
// src/pages/Tools.js

import React, { useState } from 'react';
import './Tools.css';
const faqData = [
    { question: "How do I use the flashcards?", answer: "Click 'Show Answer' to see the answer, and 'Next' to move to the next flashcard." },
    { question: "How is my quiz score calculated?", answer: "Your score is based on the number of correct answers." },
    { question: "Can I save my progress?", answer: "Currently, there is no save feature, but it may be added in the future." }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <h2>FAQ</h2>
            {faqData.map((faq, index) => (
                <div key={index}>
                    <p onClick={() => toggleAnswer(index)} style={{ cursor: "pointer", fontWeight: "bold" }}>
                        {faq.question}
                    </p>
                    {openIndex === index && <p>{faq.answer}</p>}
                </div>
            ))}
        </div>
    );
};

export default FAQ;
