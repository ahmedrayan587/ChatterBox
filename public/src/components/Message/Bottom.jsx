import React, { useState } from 'react';
import axios from 'axios';
import './Bottom.css';
import { addMessageRoute } from '../../utils/APIRoutes';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export default function Bottom({ userID, friendID, socket, setMessages }) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  async function addMessage() {
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
    setMessage('');
  }

  const addEmoji = (emoji) => {
    setMessage(message + emoji.native);
  };

  return (
    <div className="chat-input">
      {showEmojiPicker && (
        <div className="emoji-picker">
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
      <span className="emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</span>
      <input
        type="text"
        placeholder="Type a message"
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addMessage();
          }
        }}
      />
    </div>
  );
}
