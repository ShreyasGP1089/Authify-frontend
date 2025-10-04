import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Calendar, Key, CheckCircle, XCircle, LogOut, Lock } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';

const UserDashboard = () => {
  // State for this component's data, loading, and errors
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Global context and navigation
  const { backendurl, setIsLoggedIn, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  // Effect for fetching user data once on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // We assume the JWT cookie is sent automatically
        const response = await axios.get(`${backendurl}/api/v1.0/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Could not load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [backendurl]); // Dependency array ensures this runs once

  // Effect for the live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    try {
      // Optional: Call a backend endpoint to invalidate the session/token
      // await axios.post(`${backendurl}/api/v1.0/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear global state and redirect to login
      setIsLoggedIn(false);
      setUserData(null);
      navigate('/login');
    }
  };

  // Update Password Handler - Navigate to verify with password-update flag
  const handleUpdatePassword = async () => {
    try {
      // Send OTP to user's email for password reset
      await axios.post(`${backendurl}/api/v1.0/send-verify-OTP`, null, {
        params: { email: user?.email },
        withCredentials: true
      });
      
      // Navigate to verify component with password-update state
      navigate(`/verify/${user?.email}`, { 
        state: { from: 'password-update' } 
      });
    } catch (err) {
      console.error("Failed to send OTP:", err);
      // You might want to show an error message to the user here
      alert("Failed to send OTP. Please try again.");
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Centralized styles with a cohesive color palette
  const customStyles = {
    gradients: {
      background: 'linear-gradient(135deg, #7474BF, #348AC7)',
      primary: 'linear-gradient(135deg, #2575fc, #6a11cb)',
      success: 'linear-gradient(135deg, #55efc4, #00b894)',
      warning: 'linear-gradient(135deg, #fdcb6e, #e17055)',
      accent: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
      danger: 'linear-gradient(135deg, #ff7675, #d63031)'
    },
    glassCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
    },
    iconWrapper: (background) => ({
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: background || 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })
  };

  // Loading and Error states
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: customStyles.gradients.background }}>
      <h2 className="text-white">Loading Profile...</h2>
    </div>;
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: customStyles.gradients.background }}>
      <h2 className="text-white">{error}</h2>
    </div>;
  }

  return (
    <div style={{ background: customStyles.gradients.background, minHeight: '100vh' }}>
      <div className="container-fluid p-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            
            {/* Header */}
            <div className="card mb-4" style={customStyles.glassCard}>
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <div className="d-flex align-items-center">
                      <div style={customStyles.iconWrapper(customStyles.gradients.primary)}>
                        <User className="text-white" size={28} />
                      </div>
                      <div className="ms-4">
                        <h1 className="h2 fw-bold text-dark mb-1" style={{fontSize: '2.5rem'}}>
                          Welcome back, {user?.name}! 👋
                        </h1>
                        <p className="text-muted mb-0 fs-5">
                          {currentTime.toLocaleDateString('en-US', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                          })} • {currentTime.toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                    <button onClick={handleUpdatePassword} className="btn btn-primary btn-lg px-4 py-2 me-2"
                      style={{ background: customStyles.gradients.primary, border: 'none', borderRadius: '25px' }}>
                      <Lock className="me-2" size={18} />
                      Update Password
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger btn-lg px-4 py-2"
                      style={{ background: customStyles.gradients.danger, border: 'none', borderRadius: '25px' }}>
                      <LogOut className="me-2" size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-xl-3">
                <div className="card h-100 border-0 text-white" style={{ background: customStyles.gradients.success }}>
                  <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="card-text text-white-50 mb-2 fs-6">Account Status</p>
                      <h4 className="fw-bold mb-0">{user?.isAccountVerified ? 'Verified' : 'Unverified'}</h4>
                    </div>
                    <div style={customStyles.iconWrapper()}>
                      {user?.isAccountVerified ? <CheckCircle size={28} /> : <XCircle size={28} />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="card h-100 border-0 text-white" style={{ background: customStyles.gradients.primary }}>
                  <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="card-text text-white-50 mb-2 fs-6">User Identity</p>
                      <h4 className="fw-bold mb-0">{user?.userId}</h4>
                    </div>
                    <div style={customStyles.iconWrapper()}>
                      <Key size={28} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="card h-100 border-0 text-white" style={{ background: customStyles.gradients.accent }}>
                  <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="card-text text-white-50 mb-2 fs-6">Member Since</p>
                      <h4 className="fw-bold mb-0">{getDaysAgo(user?.createdAt)} days</h4>
                    </div>
                    <div style={customStyles.iconWrapper()}>
                      <Calendar size={28} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3">
                <div className="card h-100 border-0 text-white" style={{ background: customStyles.gradients.warning }}>
                   <div className="card-body p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="card-text text-white-50 mb-2 fs-6">Security Level</p>
                      <h4 className="fw-bold mb-0">Premium</h4>
                    </div>
                    <div style={customStyles.iconWrapper()}>
                      <Shield size={28} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;