import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="text-center d-flex flex-column justify-content-center align-items-center py-5 px-3">
      <img src={assets.Header} alt="Header" style={{width:"500px", marginBottom:"10px"}}/>
      <h5 className="fw-semibold">
        Hey Developer 👋, Welcome to Authify - Your Ultimate Authentication Solution!
      </h5>
      <h1>Welcome to my product</h1>
      <p className="text-muted fs-5 mb-4" >
        Lets secure your applications with ease and efficiency.
      </p>
      <div className="btn btn-dark rounded-pill px-4 py-2">
        Get Started <i className="bi bi-arrow-right ms-2"></i>
      </div>
    </div>
  )
}

export default Header