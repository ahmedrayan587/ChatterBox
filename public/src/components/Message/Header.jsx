import React, { useState } from 'react'
import './Header.css'

export default function Header({image,name,messages}) {
    const [searchQuery, setSearchQuery] = useState('');

  
    const filteredChatList = messages.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="profile">
          <div className="profile-image">
            <img src={image} alt="Profile Picture" />
          </div>
          <div className="profile-info">
            <span className="profile-name">{name}</span>
          </div>
          <div className="profile-actions">
           <div className="search-header">
                <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
      )
}
