import React, { useState } from 'react';
import './LoginModal.css';
import { useTranslation } from '../contexts/TranslationContext';
import { COUNTRY_CODE, PHONE_DIGIT_LENGTH } from '../config/api';
import videoPlusLogo from '../assets/VideoPlus Logo.png';

interface LoginModalProps {
  onSubmit: (phone: string) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onSubmit, onClose, isSubmitting = false }) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState(COUNTRY_CODE);
  const [phoneError, setPhoneError] = useState('');

  const validateMobileNumber = (phoneNumber: string): boolean => {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

    if (!cleanNumber.startsWith(COUNTRY_CODE)) {
      return false;
    }

    const digits = cleanNumber.substring(COUNTRY_CODE.length);
    return digits.length === PHONE_DIGIT_LENGTH && /^\d+$/.test(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateMobileNumber(phone)) {
      setPhoneError(`Please enter a valid ${PHONE_DIGIT_LENGTH}-digit mobile number`);
      return;
    }

    await onSubmit(phone);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-logo-custom">
            <img src={videoPlusLogo} alt="VideoPlus" className="modal-videoplus-logo" />
          </div>
          <h1 className="modal-title">{t('login.welcome')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label className="input-label">{t('login.phone.label')}</label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">{COUNTRY_CODE}</span>
              <input
                type="tel"
                value={phone.replace(COUNTRY_CODE, '')}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^\d]/g, '');
                  if (value.length > PHONE_DIGIT_LENGTH) {
                    value = value.substring(0, PHONE_DIGIT_LENGTH);
                  }
                  setPhone(COUNTRY_CODE + value);
                  if (phoneError) {
                    setPhoneError('');
                  }
                }}
                className={`phone-input ${phoneError ? 'error' : ''}`}
                placeholder="76521792"
                required
                disabled={isSubmitting}
              />
            </div>
            {phoneError && (
              <div className="error-message">{phoneError}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="send-otp-button"
            disabled={!validateMobileNumber(phone) || isSubmitting}
            style={{
              background: 'var(--gradient-primary)',
              opacity: !validateMobileNumber(phone) || isSubmitting ? 0.6 : 1
            }}
          >
            <span>{isSubmitting ? 'Sending...' : t('login.send.otp')}</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <span>{t('login.security')}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
