import React, { useState, useEffect } from 'react';
import './OTPModal.css';
import videoPlusLogo from '../assets/VideoPlus Logo.png';

interface OTPModalProps {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  onClose: () => void;
  isVerifying?: boolean;
  verifyError?: string;
}

const OTPModal: React.FC<OTPModalProps> = ({
  phoneNumber,
  onVerify,
  onBack,
  onClose,
  isVerifying = false,
  verifyError = '',
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120);
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

  const handleVerify = async () => {
    if (otp.every(digit => digit !== '')) {
      await onVerify(otp.join(''));
    }
  };

  const handleResend = () => {
    setTimeLeft(120);
    setIsResendDisabled(true);
    setOtp(['', '', '', '']);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
                className={`otp-input ${digit ? 'filled' : ''} ${verifyError ? 'error' : ''}`}
                maxLength={1}
                autoComplete="off"
                disabled={isVerifying}
              />
            ))}
          </div>
          {verifyError && (
            <div className="otp-error-message">{verifyError}</div>
          )}
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
            <button className="resend-button" onClick={handleResend} disabled={isVerifying}>
              <span>🔄</span>
              <span>Resend OTP</span>
            </button>
          )}
        </div>

        <div className="verify-section">
          <button 
            className="verify-button"
            onClick={handleVerify}
            disabled={!isOtpComplete || isVerifying}
            style={{
              background: 'var(--gradient-primary)',
              opacity: !isOtpComplete || isVerifying ? 0.6 : 1
            }}
          >
            <span>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="otp-back-button"
          onClick={onBack}
          disabled={isVerifying}
        >
          ← Back to Phone Number
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
