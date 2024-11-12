import React from 'react';
import './Features.css';
import Carousel from 'react-multi-carousel'; // carousel package for responsive design
import 'react-multi-carousel/lib/styles.css';
// import GPTIcon from './public/images/GPTIcon.png'; // add your image paths here
// import ClaudeIcon from './images/ClaudeIcon.png';
// import GeminiIcon from '/images/GeminiIcon.png';

const FeatureSection = () => {
  const carouselItems = [
    { id: 1, src: `${process.env.PUBLIC_URL}/images/GPTIcon.png`, label: 'GPT-40' },
    { id: 2, src: `${process.env.PUBLIC_URL}/images/ClaudeIcon.png`, label: 'Claude 3 Opus' },
    { id: 3, src: `${process.env.PUBLIC_URL}/images/GeminiIcon.png`, label: 'Gemini 1.5 Pro' },
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="feature-section">
      <div className="feature-carousel">
        <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
          {carouselItems.map((item) => (
            <div key={item.id} className="carousel-item">
              <img src={item.src} alt={item.label} />
              <p>{item.label}</p>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="feature-details">
        <h2>Boost Your Learning with StudyBuddy AI</h2>
        <p>Achieve academic excellence with StudyBuddy, your all-in-one AI learning companion.</p>
        <ul>
          <li>
            <h3>All AI Models</h3>
            <p>Access models like GPT-40, Claude 3, and Gemini 1.5 for comprehensive support.</p>
          </li>
          <li>
            <h3>Step-by-Step Solutions</h3>
            <p>Detailed explanations to help you understand complex problems.</p>
          </li>
          <li>
            <h3>Collaborative Learning</h3>
            <p>Connect with a community of learners and share verified answers.</p>
          </li>
          <li>
            <h3>24/7 AI Tutor</h3>
            <p>Round-the-clock AI assistance for your study needs.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureSection;
