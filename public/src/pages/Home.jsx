import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import Cookies from 'js-cookie';
import './Home.css';
import Header from '../components/Message/Header';
import Main from '../components/Message/Main';
import Bottom from '../components/Message/Bottom';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

export default function Home() {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [friendID, setFriendID] = useState("");
  const [friendUsername, setFriendUsername] = useState("");
  const [friendImage, setFriendImage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [updateSidebar, setUpdateSidebar] = useState(0);

  
    const filteredChatList = messages.filter(item =>
      item.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    setUserImage(Cookies.get('userImage') || "");
    setUsername(Cookies.get('username') || "");
    setUserID(Cookies.get('userID') || "");

    if (userID) {
      socket.emit('add-user', userID);
    }

    socket.on('msg-receive', (message) => {
      // Assuming you have the current user's ID in `currentUserId`
      if (message.to === userID) {
        setMessages((prevMessages) => [...prevMessages, { 
          fromSelf: false, 
          message: message.message, 
          data: new Date(Date.now()).toLocaleDateString(), 
          time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setUpdateSidebar(updateSidebar + 1);
      }
    });
    

    return () => {
      socket.off('msg-receive');
    };
  }, [userID]);

  return (
    <div className='home-container'>
      <Sidebar 
        userID={userID} 
        setFriendID={setFriendID} 
        setFriendUsername={setFriendUsername} 
        setFriendImage={setFriendImage} 
        updateSidebar={updateSidebar}
      />
      {friendUsername && <Header image={friendImage} name={friendUsername} setSearchQuery={setSearchQuery} />}
      <Main userID={userID} friendID={friendID} messages={filteredChatList==[]?messages:filteredChatList} setMessages={setMessages} />
      {friendUsername && <Bottom userID={userID} friendID={friendID} socket={socket} setMessages={setMessages} updateSidebar={updateSidebar} setUpdateSidebar={setUpdateSidebar} />}
    </div>
  );
}
