import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/studyrooms');
        setRooms(response.data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };
    fetchRooms();
  }, []);

  // Function to handle button click and navigate to the chat room
  const handleJoinRoom = async (roomId) => {
    try {
      // Call the API to join the room
      const response = await axios.post(
        `http://localhost:5000/api/studyrooms/${roomId}/join`
      );
      
      // On successful join, navigate to the study room chat page
      if (response.status === 200) {
        navigate(`/study-room/${roomId}`);
      }
    } catch (err) {
      console.error('Error joining the room:', err);
    }
  };

  return (
    <div className="room-list">
      <h2>Study Rooms</h2>
      <div className="room-cards">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <h3>{room.name}</h3>
            <p><strong>Topic:</strong> {room.topic}</p>
            <p><strong>Room ID:</strong> {room._id}</p>
            {/* Button to join the room */}
            <button onClick={() => handleJoinRoom(room._id)} className="join-button">
              Join Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
  