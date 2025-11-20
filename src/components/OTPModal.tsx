import React, { useState, useEffect } from 'react';
import './OTPModal.css';
import videoPlusLogo from '../assets/VideoPlus Logo.png';

interface OTPModalProps {
  phoneNumber: string;
  onVerify: () => void;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ phoneNumber, onVerify, onClose }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);


  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every(digit => digit !== '')) {
      onVerify();
    }
  };

  const handleResend = () => {
    setTimeLeft(120);
    setIsResendDisabled(true);
    setOtp(['', '', '', '']);
    // In a real app, you would resend the OTP here
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="otp-header">
          <div className="snapflix-logo-container-custom">
            <img src={videoPlusLogo} alt="VideoPlus" className="modal-videoplus-logo" />
          </div>
          <h2 className="otp-title">Verify Your Phone</h2>
          <p className="otp-description">
            Enter the 4-digit code sent to {phoneNumber}
          </p>
        </div>

        <div className="otp-inputs-container">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-input ${digit ? 'filled' : ''}`}
                maxLength={1}
                autoComplete="off"
              />
            ))}
          </div>
          <div className="otp-progress">
            {/* <div className={`progress-bar ${otp.filter(d => d).length > 0 ? 'active' : ''}`} 
                 style={{width: `${(otp.filter(d => d).length / 4) * 100}%`}}></div> */}
          </div>
        </div>

        <div className="security-notice">
          <div className="security-icon">🛡️</div>
          <span>Your verification is secure and encrypted</span>
        </div>

        <div className="resend-section">
          {isResendDisabled ? (
            <div className="resend-timer-container">
              <div className="timer-icon">⏱️</div>
              <div className="timer-content">
                <p className="resend-timer">
                  Resend Available in {formatTime(timeLeft)}
                </p>
                <p className="timer-description">Didn't receive the code?</p>
              </div>
            </div>
          ) : (
            <button className="resend-button" onClick={handleResend}>
              <span>🔄</span>
              <span>Resend OTP</span>
            </button>
          )}
        </div>

        <div className="verify-section">
          <button 
            className="verify-button"
            onClick={handleVerify}
            disabled={!otp.every(digit => digit !== '')}
            style={{
              background: 'var(--gradient-primary)',
              opacity: !otp.every(digit => digit !== '') ? 0.6 : 1
            }}
          >
            <span>Verify & Continue</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
