import React, { useState } from 'react';
import Flashcards from './Flashcards';
import Quiz from './Quiz';
import FAQ from './FAQ';
import StudyMaterial from './StudyMaterial'; // Import StudyMaterial component
import './Tools.css';
import 'font-awesome/css/font-awesome.min.css';

const Tools = () => {
    const [activeTab, setActiveTab] = useState("flashcards");

    return (
        <div>
            <h1>Study Tools</h1>
            <div className="tab-buttons">
                <button onClick={() => setActiveTab("flashcards")}>Flashcards</button>
                <button onClick={() => setActiveTab("quiz")}>Quiz</button>
                <button onClick={() => setActiveTab("faq")}>FAQ</button>
                <button onClick={() => setActiveTab("study-material")}>Study Material</button> {/* New tab */}
            </div>
            <div className="tab-content">
                {activeTab === "flashcards" && <Flashcards />}
                {activeTab === "quiz" && <Quiz />}
                {activeTab === "faq" && <FAQ />}
                {activeTab === "study-material" && <StudyMaterial />} {/* New content */}
            </div>
        </div>
    );
};

export default Tools;
