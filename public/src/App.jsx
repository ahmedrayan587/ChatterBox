import React, { useEffect, useState } from 'react'
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  const [userImage, setUserImage] = useState(); 
  return (
    <>
    <ToastContainer 
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
      <Router>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/login' element={<Login setUserImage={setUserImage} />} />
          <Route path='/home' element={<Home userImage={userImage} />} />
        </Routes>
      </Router>
    </>
  )
}
