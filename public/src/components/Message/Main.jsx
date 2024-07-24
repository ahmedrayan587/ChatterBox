import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import './Main.css';
import { getAllMessagesRoute } from '../../utils/APIRoutes';
import Message from './Message';

export default function Main({ userID, friendID, messages, setMessages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function getAllMessages() {
      try {
        const response = await axios.post(getAllMessagesRoute, {
          from: userID,
          to: friendID
        });
        if (response.data.status === 200) {
          setMessages(response.data.projectMessages);
        } else {
          console.error('Error fetching messages:', response);
        }
      } catch (error) {
        console.error('Error during post request:', error);
      }
    }

    if (userID && friendID) {
      getAllMessages();
    }
  }, [userID, friendID, setMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  let prevDate = null;
  return (
    <div className='main-container'>
      {messages.map((item, index) => {
        const showDate = prevDate !== item.date;
        prevDate = item.date;
        return(
          <React.Fragment key={index}>
            {showDate && <div className="date-container"><p className="date-separator">{item.date}</p></div>}
            <Message message={item.message} date={item.date} time={item.time} fromSelf={item.fromSelf} />
          </React.Fragment>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
