import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import RegisterTemp from '../components/RegisterTemp'

const Register = () => {
  return (
    <div>
    <nav className="navbar bg-white px-4 py-2 d-flex  justify-content-between shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <img src={assets.logo} alt="logo" width={50} height={50} />
          <span className="fw-bold fs-1 text-dark">Authify</span>
          </Link>
          </div>
           </nav>
     <RegisterTemp/>
     </div>
  )
}

export default Register