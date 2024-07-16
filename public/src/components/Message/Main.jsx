import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Main.css'
import { getAllMessagesRoute } from '../../utils/APIRoutes';
import Message from './Message';

export default function Main({userID, friendID}) {
  const [massages,setMassages] = useState([]);
  async function getAllMessages() {
    try {
      const response = await axios.post(getAllMessagesRoute, {
        from: userID,
        to: friendID
      });
      if (response.data.status == 200) {
        console.log('Piece data posted successfully:',response);
        setMassages(response.data.projectMessages)
      } else {
        console.error('Error posting piece data:',response);
      }
    } catch (error) {
      console.error('Error during post request:', error);
    }
  };
  useEffect(()=>{
    getAllMessages();
  },[userID,friendID])
  return (
    <div className='main-container'>
      {massages.map((item, index) => (
          <Message key={index} message={item.message} fromSelf={item.fromSelf} />
        ))}
    </div>
  )
}
