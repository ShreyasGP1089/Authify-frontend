import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../Context/AppContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendurl } = useContext(AppContext);

  // Get email from navigation state
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Redirect to login if no email is provided
  React.useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // Validate password strength
  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(val => val === true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation checks
    if (!isPasswordValid()) {
      setMessage('❌ Password does not meet all requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${backendurl}/api/v1.0/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );

      setMessage('✅ Password updated successfully! Redirecting to login...');
      setIsSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage(error.response?.data?.message || '❌ Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    gradients: {
      background: 'linear-gradient(135deg, #7474BF, #348AC7)',
      primary: 'linear-gradient(135deg, #2575fc, #6a11cb)',
      danger: 'linear-gradient(135deg, #ff7675, #d63031)'
    },
    glassCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
    }
  };

  return (
    <div style={{ background: customStyles.gradients.background, minHeight: '100vh' }}>
      <div className="container-fluid p-4">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            
            {/* Back Button */}
            <button 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-light mb-3"
              style={{ borderRadius: '20px' }}
            >
              <ArrowLeft size={18} className="me-2" />
              Back to Dashboard
            </button>

            {/* Main Card */}
            <div className="card border-0" style={customStyles.glassCard}>
              <div className="card-body p-4 p-md-5">
                
                {/* Header */}
                <div className="text-center mb-4">
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: customStyles.gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}
                  >
                    <Lock className="text-white" size={36} />
                  </div>
                  <h2 className="fw-bold mb-2">Reset Password</h2>
                  <p className="text-muted">Enter your new password below</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  
                  {/* New Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">New Password</label>
                    <div className="position-relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ textDecoration: 'none' }}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicators */}
                  <div className="mb-3">
                    <small className="d-block mb-1 fw-semibold">Password must contain:</small>
                    <div className="d-flex flex-column gap-1">
                      <small className={passwordValidation.length ? 'text-success' : 'text-muted'}>
                        {passwordValidation.length ? <CheckCircle size={14} className="me-1" /> : <XCircle size={14} className="me-1" />}
                        At least 8 characters
                      </small>
                      <small className={passwordValidation.uppercase ? 'text-success' : 'text-muted'}>
                        {passwordValidation.uppercase ? <CheckCircle size={14} className="me-1" /> : <XCircle size={14} className="me-1" />}
                        One uppercase letter
                      </small>
                      <small className={passwordValidation.lowercase ? 'text-success' : 'text-muted'}>
                        {passwordValidation.lowercase ? <CheckCircle size={14} className="me-1" /> : <XCircle size={14} className="me-1" />}
                        One lowercase letter
                      </small>
                      <small className={passwordValidation.number ? 'text-success' : 'text-muted'}>
                        {passwordValidation.number ? <CheckCircle size={14} className="me-1" /> : <XCircle size={14} className="me-1" />}
                        One number
                      </small>
                      <small className={passwordValidation.special ? 'text-success' : 'text-muted'}>
                        {passwordValidation.special ? <CheckCircle size={14} className="me-1" /> : <XCircle size={14} className="me-1" />}
                        One special character
                      </small>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ textDecoration: 'none' }}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white fw-semibold"
                    style={{ 
                      background: customStyles.gradients.primary, 
                      border: 'none',
                      borderRadius: '12px'
                    }}
                    disabled={loading || !isPasswordValid()}
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>

                  {/* Message */}
                  {message && (
                    <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} mt-3 p-2 text-center`}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;