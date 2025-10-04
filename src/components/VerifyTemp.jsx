import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
// NEW: Imported useNavigate
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const VerifyTemp = () => {
    // NEW: Initialized the navigate function
    const navigate = useNavigate();
    const { email } = useParams();
    const { backendurl } = useContext(AppContext);

    const location = useLocation();
const isPasswordUpdate = location.state?.from === 'password-update';

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [message, setMessage] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    // NEW: State to track if verification was successful
    const [isVerified, setIsVerified] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // NEW: useEffect to handle navigation after verification
useEffect(() => {
    if (isVerified) {
        const timer = setTimeout(() => {
            if (isPasswordUpdate) {
                // Navigate to reset password page
                navigate('/reset-password', { state: { email } });
            } else {
                // Original: navigate to login after registration
                navigate('/login');
            }
        }, 2000);
        return () => clearTimeout(timer);
    }
}, [isVerified, navigate, isPasswordUpdate, email]);

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };
    
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
        if (pastedData && /^\d+$/.test(pastedData)) {
            const newOtp = pastedData.split('').concat(new Array(6 - pastedData.length).fill(""));
            setOtp(newOtp);
            inputRefs.current[Math.min(5, pastedData.length -1)].focus();
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setIsResending(true);
        setMessage("");
        
        try {
            await axios.post(`${backendurl}/api/v1.0/send-verify-OTP`, null, {
                params: { email },
                withCredentials: true
            });

            setMessage("📧 OTP resent successfully!");
            setResendTimer(60);
        } catch (error) {
            console.error("Resend OTP error:", error);
            setMessage("❌ Failed to resend OTP. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const verifyOtp = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setMessage("❌ Please enter all 6 digits");
            return;
        }

        setIsVerifying(true);
        setMessage("");

        try {
            await axios.post(`${backendurl}/api/v1.0/verify-OTP`, 
                { email, otp: otpValue },
                { withCredentials: true }
            );
            setMessage("✅ OTP verified successfully!");
            // CHANGED: Set isVerified to true on success to trigger the useEffect
            setIsVerified(true);
        } catch (error) {
            console.error("OTP verification error:", error);
            const errorMessage = error.response?.data?.message || "Invalid OTP, please try again.";
            setMessage(`❌ ${errorMessage}`);
        } finally {
            setIsVerifying(false);
        }
    };

    const maskEmail = (email) => {
        if (!email || !email.includes('@')) return "Invalid email";
        return `${email.slice(0, 3)}*****${email.slice(email.indexOf('@'))}`;
    };

    return (
        <div className="verify-temp">
            <div className="container height-100 d-flex justify-content-center align-items-center">
                <div className="position-relative">
                    <div className="card p-3 p-md-4 text-center">
                        <h6>
    {isPasswordUpdate 
        ? "Please verify your identity to update password" 
        : "Please enter the one time password to verify your account"}
</h6>
                        <div>
                            <span>A code has been sent to </span>
                            <small id="maskedNumber">{maskEmail(email)}</small>
                        </div>

                        <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2" onPaste={handlePaste}>
                            {otp.map((data, index) => (
                                <input
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    key={index}
                                    className="m-2 text-center form-control rounded"
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    disabled={isVerifying || isResending}
                                />
                            ))}
                        </div>

                        <div className="mt-4">
                            <button
                                id="validateBtn"
                                className="btn btn-danger px-4 validate"
                                onClick={verifyOtp}
                                disabled={isVerifying || isResending}
                            >
                                {isVerifying ? "Validating..." : "Validate"}
                            </button>
                            <button
                                id="resendBtn"
                                className="btn btn-link px-4"
                                onClick={handleResendOtp}
                                disabled={isVerifying || isResending || resendTimer > 0}
                            >
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                            </button>
                        </div>

                        {message && (
                            <div className="d-flex justify-content-center text-center mt-3">
                                <div className={`alert ${message.includes('✅') || message.includes('📧') ? 'alert-success' : 'alert-danger'} p-2`}>
                                    {message}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyTemp;