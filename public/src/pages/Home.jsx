import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Cookies from 'js-cookie';
import "./Home.css"
import Header from '../components/Message/Header';
import Main from '../components/Message/Main';
import Bottom from '../components/Message/Bottom';
export default function Home() {
  const [userID,setUserID] = useState("");
  const [username,setUsername] = useState("");
  const [userImage,setUserImage] = useState("");
  const [friendID,setFriendID] = useState("");
  const [friendUsername,setFriendUsername] = useState("");
  const [friendImage,setFriendImage] = useState("");
  useEffect(()=>{
    Cookies.get('userImage')&&setUserImage(Cookies.get('userImage'));
    Cookies.get('username')&&setUsername(Cookies.get('username'));
    Cookies.get('userID')&&setUserID(Cookies.get('userID'));
  },[])
  return (
    <div className='home-container'>
      {friendUsername&&<Header image={friendImage} name={friendUsername} messages={[]} />}
      <Sidebar userID={userID} setFriendID={setFriendID} setFriendUsername={setFriendUsername} setFriendImage={setFriendImage} />
      <Main userID={userID} friendID={friendID} />
      {friendUsername&&<Bottom userID={userID} friendID={friendID} />}

    </div>
  );
}
