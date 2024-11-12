import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Success message state
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/register', { username, password });
            setSuccessMessage("Registration successful! Redirecting to login..."); // Set success message
            setTimeout(() => {
                navigate('/login'); // Redirect after 2 seconds
            }, 0);
        } catch (error) {
            alert("Registration failed");
        }
    };

    return (
        <div className='background'>
        <div className="register-form">
            <h2>Register</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Sign Up</button>
            {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        </div>
        </div>
    );
};

export default Register;
