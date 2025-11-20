import React, { useState } from 'react';
import './SubscriptionPage.css';

interface Plan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular: boolean;
  discount?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed' | null>(null);

  const plans: Plan[] = [
    {
      id: 'daily',
      name: 'Daily Pack',
      duration: '1 Day',
      price: 1,
      popular: false,
      features: ['Unlimited Videos', 'HD Quality', 'Mobile Access', 'Ad-Free Experience']
    },
    {
      id: 'weekly',
      name: 'Weekly Pack',
      duration: '7 Days',
      price: 5,
      originalPrice: 15,
      discount: '29% OFF',
      popular: false,
      features: ['Unlimited Videos', 'HD Quality', 'Mobile & Desktop', 'Ad-Free Experience', 'Early Access']
    },
    {
      id: 'monthly',
      name: 'Monthly Pass',
      duration: '30 Days',
      price: 15,
      originalPrice: 25,
      discount: '40% OFF',
      popular: true,
      features: ['Unlimited Videos', '4K Quality', 'All Devices', 'Ad-Free Experience', 'Early Access', 'Exclusive Content', 'Priority Support']
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '💳',
      description: 'Pay using your digital wallet'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: '📱',
      description: 'Pay using UPI apps like PhonePe, GPay'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'Pay directly from your bank account'
    },
    {
      id: 'cards',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay using Visa, Mastercard, or RuPay'
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentMethods(false);
    setSelectedPaymentMethod('');
  };

  const handlePayment = () => {
    setShowPaymentMethods(true);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      // Handle coupon application logic
    }
  };

  const handleFinalPayment = () => {
    setShowPaymentModal(true);
    setPaymentStatus('pending');
  };

  const processPayment = () => {
    setPaymentStatus('processing');
    
    // Simulate Razorpay payment processing
    setTimeout(() => {
      // Simulate successful payment (90% success rate)
      const isSuccess = Math.random() > 0.1;
      setPaymentStatus(isSuccess ? 'success' : 'failed');
      
      if (isSuccess) {
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentStatus(null);
          // Reset form
          setSelectedPlan('monthly');
          setShowPaymentMethods(false);
          setSelectedPaymentMethod('');
          setCouponCode('');
        }, 3000);
      }
    }, 3000);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus(null);
  };

  return (
    <div className="subscription-page">
      {/* Background Effects */}
      <div className="background-effects">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="subscription-container">
        {/* Header Section */}
        <div className="subscription-header">
          <h1 className="main-title">Choose Your <span className="highlight">VideoPlus</span> Plan</h1>
          <p className="subtitle">Unlock unlimited video content and premium features</p>
        </div>

        {/* Plans Section */}
        <div className="plans-section">
          <div className="plans-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                {plan.discount && <div className="discount-badge">{plan.discount}</div>}
                
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-duration">{plan.duration}</p>
                </div>

                <div className="plan-pricing">
                  <div className="price-container">
                    <span className="currency">SZL</span>
                    <span className="price">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="original-price">SZL{plan.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="plan-features">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="check-icon">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`select-plan-btn ${selectedPlan === plan.id ? 'selected' : ''}`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="coupon-section">
          <h3>Have a coupon code?</h3>
          <div className="coupon-input-group">
            <input 
              type="text" 
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="coupon-input"
            />
            <button className="apply-coupon-btn" onClick={applyCoupon}>
              Apply
            </button>
          </div>
        </div>

        {/* Payment Section - Coming Soon */}
        {selectedPlanData && (
          <div className="payment-section">
            <div className="selected-plan-summary">
              <h3>Selected Plan: {selectedPlanData.name}</h3>
              <div className="plan-details">
                <span>Duration: {selectedPlanData.duration}</span>
                <span>Price: SZL{selectedPlanData.price}</span>
              </div>
            </div>

            <div className="coming-soon-section">
              <div className="coming-soon-icon">🚀</div>
              <h3>Payment Integration Coming Soon</h3>
              <p>We're working on integrating secure payment methods. Check back soon to complete your subscription!</p>
              <div className="coming-soon-features">
                <div className="feature-preview">
                  <span className="feature-icon">💳</span>
                  <span>Multiple Payment Options</span>
                </div>
                <div className="feature-preview">
                  <span className="feature-icon">🔒</span>
                  <span>Secure & Encrypted</span>
                </div>
                <div className="feature-preview">
                  <span className="feature-icon">⚡</span>
                  <span>Instant Activation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms Section */}
        <div className="terms-section">
          <p>
            By proceeding with the payment, you agree to our{' '}
            <a href="#" className="terms-link">Terms of Service</a> and{' '}
            <a href="#" className="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <div className="razorpay-logo">
                <div className="logo-text">Razorpay</div>
              </div>
              <button className="close-btn" onClick={closePaymentModal}>×</button>
            </div>

            <div className="modal-content">
              {paymentStatus === 'pending' && (
                <div className="payment-pending">
                  <h3>Complete Your Payment</h3>
                  <div className="payment-details">
                    <div className="merchant-info">
                      <span>Pay to:</span>
                      <span>VideoPlus Gaming</span>
                    </div>
                    <div className="amount-info">
                      <span>Amount:</span>
                      <span>SZL{selectedPlanData?.price}</span>
                    </div>
                    <div className="plan-info">
                      <span>Plan:</span>
                      <span>{selectedPlanData?.name}</span>
                    </div>
                  </div>

                  <div className="payment-method-selection">
                    <h4>Choose Payment Method</h4>
                    <div className="payment-options-modal">
                      <button className="payment-option-btn" onClick={processPayment}>
                        <span className="option-icon">💳</span>
                        <span>Credit/Debit Card</span>
                      </button>
                      <button className="payment-option-btn" onClick={processPayment}>
                        <span className="option-icon">📱</span>
                        <span>UPI</span>
                      </button>
                      <button className="payment-option-btn" onClick={processPayment}>
                        <span className="option-icon">🏦</span>
                        <span>Net Banking</span>
                      </button>
                      <button className="payment-option-btn" onClick={processPayment}>
                        <span className="option-icon">💰</span>
                        <span>Wallet</span>
                      </button>
                    </div>
                  </div>

                  <div className="security-badges">
                    <div className="security-item">
                      <span className="security-icon">🔒</span>
                      <span>Secure Payment</span>
                    </div>
                    <div className="security-item">
                      <span className="security-icon">🛡️</span>
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="payment-processing">
                  <div className="processing-spinner">
                    <div className="spinner"></div>
                  </div>
                  <h3>Processing Payment...</h3>
                  <p>Please don't close this window</p>
                  <div className="processing-steps">
                    <div className="step completed">
                      <span className="step-icon">✓</span>
                      <span>Payment Details Verified</span>
                    </div>
                    <div className="step active">
                      <span className="step-icon">⏳</span>
                      <span>Processing Transaction</span>
                    </div>
                    <div className="step">
                      <span className="step-icon">⏳</span>
                      <span>Confirming Payment</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="payment-success">
                  <div className="success-icon">✅</div>
                  <h3>Payment Successful!</h3>
                  <p>Your VideoPlus subscription has been activated</p>
                  <div className="success-details">
                    <div className="detail-item">
                      <span>Transaction ID:</span>
                      <span>TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                    <div className="detail-item">
                      <span>Plan:</span>
                      <span>{selectedPlanData?.name}</span>
                    </div>
                    <div className="detail-item">
                      <span>Amount:</span>
                      <span>SZL{selectedPlanData?.price}</span>
                    </div>
                  </div>
                  <button className="continue-btn" onClick={closePaymentModal}>
                    Continue to VideoPlus
                  </button>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="payment-failed">
                  <div className="failed-icon">❌</div>
                  <h3>Payment Failed</h3>
                  <p>Your payment could not be processed. Please try again.</p>
                  <div className="failed-actions">
                    <button className="retry-btn" onClick={() => setPaymentStatus('pending')}>
                      Try Again
                    </button>
                    <button className="cancel-btn" onClick={closePaymentModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;