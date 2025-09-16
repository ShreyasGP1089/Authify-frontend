import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Menubar = () => {
  const navigate=useNavigate();
  return (
    <nav className="navbar bg-white px-4 py-2 d-flex  justify-content-between shadow-sm">
      <div className="d-flex align-items-center gap-2">
      <img src={assets.logo} alt="logo" width={50} height={50} />
      <span className="fw-bold fs-1 text-dark">Authify</span>
      </div>
       <div className="btn btn-outline-dark rounded-pill px3" onClick={()=>navigate('/login')}>
        Login <i className="bi bi-box-arrow-in-right ms-2"></i>
       </div>
    </nav>
  )
}

export default Menubar