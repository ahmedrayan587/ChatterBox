import React from 'react'

export default function SidebarItem({id,setFriendID, setFriendUsername, setFriendImage, image, name, message="Hi", date="Friday"}) {
  return (
    <div className="chat-item" onClick={()=>{
      setFriendID(id);
      setFriendImage(image);
      setFriendUsername(name);
      }}>
          <div className="profile-picture">
            <img src={image} alt="Profile Picture" />
          </div>
          <div className="chat-content">
            <div className="chat-name">{name}</div>
            <div className="chat-message">{message}</div>
            <div className="chat-time">{date}</div>
          </div>
        </div>
  )
}
