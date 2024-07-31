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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
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
