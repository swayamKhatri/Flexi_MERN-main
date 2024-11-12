// src/components/StudyRoom/JoinRoom.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JoinRoom.css';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    // Get the token from localStorage or sessionStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      // Send the roomId in the URL, with token in headers
      await axios.post(
        `http://localhost:5000/api/studyrooms/${roomId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set success message
      setSuccessMessage('Successfully joined the room!');
      
      // Delay redirection to allow the user to see the success message
      setTimeout(() => {
        navigate('/study-rooms');  // Redirect to the study rooms list
        window.location.reload();   // Refresh the page
      }, 1500); // 1.5-second delay
    } catch (err) {
      console.error('Error joining room:', err);
    }
  };

  return (
    <div className="join-room-form">
      <h2>Join Study Room</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleJoinRoom}>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default JoinRoom;
