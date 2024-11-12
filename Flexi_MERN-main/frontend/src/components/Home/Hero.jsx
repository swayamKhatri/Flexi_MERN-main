// src/components/Home.js
import React from 'react';
import './Hero.css';

const HeroSection = () => {
    return (
        // <img src="/public/images/bg_hero.jpg" alt="" />
        <section className="hero-section">
            <h1>Your AI Study Assistant</h1>
            <p>Get study solutions for all subjects, flashcards, and more with StudySpark AI.</p>
            <div className="question-box">
                <textarea placeholder="Ask anything..."></textarea>
                <button className="get-answer">Get Answer</button>
            </div>
            <p className="trusted-info">Trusted by students worldwide</p>
        </section>
    );
};

export default HeroSection;
