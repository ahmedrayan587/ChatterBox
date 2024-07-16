import React from 'react'
import axios from 'axios';
import './Bottom.css'
import { addMessageRoute } from '../../utils/APIRoutes';

export default function Bottom({userID, friendID}) {
  async function addMessage(message) {
    console.table({from:userID, to:friendID, message:message})
    try {
      const response = await axios.post(addMessageRoute, {
        from: userID,
        to: friendID,
        message: message
      });
      if (response.status == 200) {
        console.log('Piece data posted successfully:',response);
      } else {
        console.error('Error posting piece data:',response);
      }
    } catch (error) {
      console.error('Error during post request:', error);
    }
  };
  return (
    <div className="chat-input">
      <span className="emoji">😊</span>
      <input type="text" placeholder="Type a message" className="message-input"   onKeyDown={(e) => {
        if (e.key === "Enter") {
          addMessage(e.target.value);
          e.target.value = "";
        }
      }} />
    </div>
  )
}
