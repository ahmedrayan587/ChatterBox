import React from 'react'
import './Header.css'

export default function Header({image,name,setSearchQuery}) {
    
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
                <input type="text" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
      )
}
