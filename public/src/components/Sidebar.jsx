import React, { useEffect, useState } from 'react'
import SidebarItem from './SidebarItem'
import { getAllUsersRoute } from '../utils/APIRoutes';
import axios from 'axios';

export default function Sidebar({ userID, setFriendID, setFriendUsername, setFriendImage, updateSidebar }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [chatList, setChatList] = useState([]);
    useEffect(() =>{
        userID&&getAllUsers();
    },[userID,updateSidebar])
    async function getAllUsers() {
        try {
            const response = await axios.get(`${getAllUsersRoute}/${userID}`);
            if (response.data.status == 200) {
              setChatList(response.data.users)
              console.log(response.data.users);
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
        <button className="update-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
        </svg>
        </button>
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
