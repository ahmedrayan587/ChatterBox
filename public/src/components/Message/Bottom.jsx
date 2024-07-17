import React from 'react';
import axios from 'axios';
import './Bottom.css';
import { addMessageRoute } from '../../utils/APIRoutes';

export default function Bottom({ userID, friendID, socket, setMessages }) {
  async function addMessage(message) {
    const newMessage = {
      from: userID,
      to: friendID,
      message: message
    };
    setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message }]);

    try {
      const response = await axios.post(addMessageRoute, newMessage);
      if (response.status === 200) {
        console.log('Message sent successfully:', response);
      } else {
        console.error('Error sending message:', response);
      }
    } catch (error) {
      console.error('Error during post request:', error);
    }

    socket.emit('send-message', newMessage);
  }

  return (
    <div className="chat-input">
      <span className="emoji">😊</span>
      <input
        type="text"
        placeholder="Type a message"
        className="message-input"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addMessage(e.target.value);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
