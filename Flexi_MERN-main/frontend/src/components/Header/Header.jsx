// src/components/Header/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="logo">StudySpark</div>
            <nav className="nav">
                <Link to="/">Home</Link>
                
                    <>
                        <Link to="/study-rooms">Study Rooms</Link>
                        <Link to="/tools">Study Tools</Link>
                        <Link to="/subjects">Subjects</Link>
                    </>
                
            </nav>
            <div className="auth-buttons ">
                {isAuthenticated ? (
                    <button onClick={handleLogout} className='logout-link'>Logout</button>
                ) : (
                    <>
                        <Link to="/login" className='login-link'>Login</Link>
                        <Link to="/register" className='signup-link'>Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
