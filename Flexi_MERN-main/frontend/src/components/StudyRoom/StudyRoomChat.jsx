// src/components/StudyRoom/StudyRoomChat.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import './StudyRoomChat.css';  // Import new CSS file for styling

const socket = socketIOClient('http://localhost:5000');

const StudyRoomChat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', { roomId, userId: 'dummyUserId' });

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveRoom', { roomId });
    };
  }, [roomId]);

  const handleSendMessage = () => {
    socket.emit('sendMessage', { roomId, userId: 'dummyUserId', message: newMessage });
    setNewMessage('');
  };

  return (
    <div className="study-room-chat">
      <h2>Study Room {roomId}</h2>
      <div className="messages-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <strong>{message.sender}: </strong>{message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default StudyRoomChat;
