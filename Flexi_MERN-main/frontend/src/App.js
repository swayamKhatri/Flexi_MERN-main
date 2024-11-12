// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Home/Hero';
import FeatureSection from './components/Home/Features';
import Footer from './components/Footer/Footer';
import Tools from './pages/Tools';
import Login from './pages/Login';
import Register from './pages/Register';
import Subjects from './pages/Subjects';
import StudyRoom from './pages/StudyRoom';
import 'font-awesome/css/font-awesome.min.css';

const App = () => {
    // State to hold the authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on initial load and whenever the token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // If there's a token, set authenticated to true
    }, []); // This effect runs once on initial load

    // Handle dynamic changes in authentication (like login/logout)
    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <Router>
            <div className="App">
                <Header onLogin={handleLogin} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<><Hero /><FeatureSection /></>} />
                    <Route path="/tools" element={isAuthenticated ? <Tools /> : <Navigate to="/login" />} />
                    <Route path="/subjects" element={isAuthenticated ? <Subjects /> : <Navigate to="/login" />} />
                    <Route path="/study-rooms" element={isAuthenticated ? <StudyRoom /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
