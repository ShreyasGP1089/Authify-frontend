import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import Register from './pages/Register';
import Verify from './pages/Verify';
import DashBoard from './components/DashBoard';
import ResetPassword from './components/ResetPassword';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/email-verify" element={<EmailVerify/>}></Route>
        <Route path="/reset-password" element={<ResetPassword/>}></Route>
        <Route path="/verify/:email" element={<Verify/>}></Route>
        <Route path='/dashboard' element={<DashBoard/>}></Route>
        <Route path='/reset-password' element={<ResetPassword />}></Route>
        </Routes>
    </div>
  )
}

export default App