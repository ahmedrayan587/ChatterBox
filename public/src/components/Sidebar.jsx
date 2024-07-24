import React, { useEffect, useState } from 'react'
import SidebarItem from './SidebarItem'
import { getAllUsersRoute } from '../utils/APIRoutes';
import axios from 'axios';

export default function Sidebar({ userID, setFriendID, setFriendUsername, setFriendImage }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [chatList, setChatList] = useState([]);
    useEffect(() =>{
        userID&&getAllUsers();
    },[userID])
    async function getAllUsers() {
        try {
            const response = await axios.get(`${getAllUsersRoute}/${userID}`);
            if (response.data.status == 200) {
              setChatList(response.data.users)
            } else {
              console.error('Error posting piece data:',response);
            }
          } catch (error) {
            console.error('Error during post request:', error);
          }
    }
  
    const filteredChatList = chatList.filter(item =>
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  return (
    <div className='sidebar-container'>
      <div className="search-bar">
        <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div className="chat-list">
      {filteredChatList.map((item, index) => (
          <SidebarItem 
            key={index}
            userID = {userID}
            image={item.image}
            name={item.username}
            id={item._id}
            setFriendID={setFriendID}
            setFriendUsername={setFriendUsername} 
            setFriendImage={setFriendImage} 
          />
        ))}
      </div>
    </div>
  )
}
