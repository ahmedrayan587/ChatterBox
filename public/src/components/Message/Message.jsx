import React from 'react'

export default function Message({fromSelf,message}) {
  return (
    <div className={`message ${fromSelf?'my-message':'frnd-message'}`}>
      <p>{message}
        <br/>
        <span>
          12:10 pm
        </span>
      </p>
      </div>
  )
}
