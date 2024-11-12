import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false); // Success message state
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('token', response.data.token);
            setSuccess(true); // Show success message
            setTimeout(() => {
                window.location.reload(); // Refresh the page
                navigate('/'); // Redirect to the home page after refresh
            }, 1000); // 1-second delay to show the success message
        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <div className='background'>
        <div className='login-form'>
            <h2>Login</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            {success && <p className="success-message">Login successful!</p>} {/* Success message */}
        </div>
        </div>
    );
};

export default Login;
