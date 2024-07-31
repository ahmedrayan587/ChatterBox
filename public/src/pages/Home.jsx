import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import Cookies from 'js-cookie';
import './Home.css';
import Header from '../components/Message/Header';
import Main from '../components/Message/Main';
import Bottom from '../components/Message/Bottom';
import audio from '../../public/Xiaomi Ringtone - Sound Effect.mp3';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define peer connection configuration
const peerConnectionConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302' // You can use other STUN/TURN servers here
    }
  ]
};

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
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnection = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const iceCandidates = useRef([]);

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

    socket.on('msg-receive', (data) => {
      if (data.to === userID && data.from === friendID) {
        setMessages(prevMessages => [...prevMessages, { 
          fromSelf: false, 
          message: data.message, 
          data: new Date().toLocaleDateString(), 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setUpdateSidebar(updateSidebar + 1);
      }
    });

    return () => {
      socket.off('msg-receive');
    };
  }, [userID, friendID]);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection(peerConnectionConfig);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, to: friendID });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('Remote stream received', event.streams[0]);
      remoteStreamRef.current.srcObject = event.streams[0];
    };

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [friendID]);

  async function callUser() {
    setCallStarted(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current.srcObject = stream;

    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));

    const newCall = {
      offer: offer,
      from: userID,
      to: friendID,
      username: username
    };
    socket.emit('call-user', newCall);
  }

  useEffect(() => {
    socket.on('call-receive', async (data) => {
      if (data.to === userID) {
        console.log(data.username);
        toast(
          <div className="custom-toast">
            <audio id="ringtone" className='d-none' autoPlay src={audio} preload="auto"></audio>
            <p>{`${data.username} Calling ... `}</p>
            <div className='d-flex justify-content-evenly align-items-center'>
              <button className='btn btn-success' onClick={() => acceptCall(data)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                </svg>
              </button>
              <button className='btn btn-danger' onClick={() => rejectCall(data.from)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                </svg>
              </button>
            </div>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
          }
        );
      }
    });

    socket.on('answer-made', async (data) => {
      if (data.to === userID) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        iceCandidates.current.forEach(candidate => {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
            .catch(e => console.error('Error adding queued ice candidate', e));
        });
        iceCandidates.current = [];
      }
    });

    socket.on('ice-candidate', (data) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch(e => {
            console.error('Error adding received ice candidate', e);
            iceCandidates.current.push(data.candidate);
          });
      } else {
        iceCandidates.current.push(data.candidate);
      }
    });

    return () => {
      socket.off('call-receive');
      socket.off('answer-made');
      socket.off('ice-candidate');
    };
  }, [userID]);

  const acceptCall = async (data) => {
    setCallStarted(true);
    peerConnection.current = new RTCPeerConnection(peerConnectionConfig);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, to: data.from });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('Remote stream received', event.streams[0]);
      remoteStreamRef.current.srcObject = event.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit('make-answer', { answer: answer, to: data.from, from: userID });
    toast.dismiss();
  };

  const rejectCall = (from) => {
    socket.emit('reject-call', { from: from });
    toast.dismiss(); // Dismiss the toast notification
  };

  return (
    <div className='home-container'>
      <div className="d-flex">
        {localStreamRef&&<video ref={localStreamRef} autoPlay playsInline className='col-6'></video>}
        {remoteStreamRef&&<video ref={remoteStreamRef} autoPlay playsInline className='col-6'></video>}
      </div>
      <Sidebar 
        userID={userID} 
        setFriendID={setFriendID} 
        setFriendUsername={setFriendUsername} 
        setFriendImage={setFriendImage} 
        updateSidebar={updateSidebar}
      />
      {friendUsername && <Header image={friendImage} friendUsername={friendUsername} setSearchQuery={setSearchQuery} callUser={callUser} />}
      <Main userID={userID} friendID={friendID} messages={filteredChatList.length ? filteredChatList : messages} setMessages={setMessages} />
      {friendUsername && <Bottom userID={userID} friendID={friendID} socket={socket} setMessages={setMessages} updateSidebar={updateSidebar} setUpdateSidebar={setUpdateSidebar} />}
    </div>
  );
}
