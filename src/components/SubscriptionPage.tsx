import React, { useState } from 'react';
import './SubscriptionPage.css';
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
  formatPlanPrice,
} from '../config/subscriptionPlans';
import { subscribe } from '../services/subscriptionService';

interface SubscriptionPageProps {
  msisdn: string;
  onNotify: (message: string, type: 'success' | 'error') => void;
  onSubscribeSuccess: (planId: string) => void;
}

type SubscribeUiState = 'idle' | 'loading' | 'success' | 'error';

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  msisdn,
  onNotify,
  onSubscribeSuccess,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState('monthly');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [subscribeUiState, setSubscribeUiState] = useState<SubscribeUiState>('idle');

  const isProcessing = subscribeUiState === 'loading';

  const handlePlanSelect = (planId: string) => {
    if (isProcessing) {
      return;
    }
    setSelectedPlanId(planId);
  };

  const getButtonContent = (plan: SubscriptionPlan) => {
    const isActivePlan = activePlanId === plan.id;

    if (isActivePlan && subscribeUiState === 'loading') {
      return (
        <span className="subscribe-btn-content">
          <span className="subscribe-mini-spinner" />
          Subscribing...
        </span>
      );
    }

    if (isActivePlan && subscribeUiState === 'success') {
      return (
        <span className="subscribe-btn-content success">
          <span className="subscribe-status-icon">✓</span>
          Subscribed!
        </span>
      );
    }

    if (isActivePlan && subscribeUiState === 'error') {
      return (
        <span className="subscribe-btn-content error">
          <span className="subscribe-status-icon">✕</span>
          Failed
        </span>
      );
    }

    return 'Subscribe';
  };

  const handleSubscribe = async (
    event: React.MouseEvent<HTMLButtonElement>,
    plan: SubscriptionPlan
  ) => {
    event.stopPropagation();

    if (isProcessing) {
      return;
    }

    if (!msisdn) {
      setActivePlanId(plan.id);
      setSubscribeUiState('error');
      onNotify('There is an error please try again later.', 'error');
      window.setTimeout(() => {
        setSubscribeUiState('idle');
        setActivePlanId(null);
      }, 1800);
      return;
    }

    setActivePlanId(plan.id);
    setSubscribeUiState('loading');

    try {
      const response = await subscribe(msisdn, plan.planId);

      if (response.ok) {
        setSubscribeUiState('success');
        onNotify('You are subscribed', 'success');

        window.setTimeout(() => {
          onSubscribeSuccess(plan.planId);
          setSubscribeUiState('idle');
          setActivePlanId(null);
        }, 1200);
      } else {
        setSubscribeUiState('error');
        onNotify('There is an error please try again later.', 'error');

        window.setTimeout(() => {
          setSubscribeUiState('idle');
          setActivePlanId(null);
        }, 1800);
      }
    } catch {
      setSubscribeUiState('error');
      onNotify('There is an error please try again later.', 'error');

      window.setTimeout(() => {
        setSubscribeUiState('idle');
        setActivePlanId(null);
      }, 1800);
    }
  };

  return (
    <div className="subscription-page">
      <div className="background-effects">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="subscription-container">
        <div className="subscription-header">
          <h1 className="main-title">
            Choose Your <span className="highlight">VideoPlus</span> Plan
          </h1>
          <p className="subtitle">Unlock unlimited video content and premium features</p>
        </div>

        <div className="plans-section">
          <div className="plans-grid">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${plan.popular ? 'popular' : ''} ${
                  selectedPlanId === plan.id ? 'selected' : ''
                } ${activePlanId === plan.id && subscribeUiState === 'loading' ? 'plan-loading' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}

                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-duration">{plan.duration}</p>
                </div>

                <div className="plan-pricing">
                  <div className="price-container">
                    <span className="currency">SZL</span>
                    <span className="price">{formatPlanPrice(plan.price)}</span>
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
                  type="button"
                  className={`select-plan-btn ${selectedPlanId === plan.id ? 'selected' : ''} ${
                    activePlanId === plan.id && subscribeUiState === 'loading'
                      ? 'loading'
                      : activePlanId === plan.id && subscribeUiState === 'success'
                        ? 'success'
                        : activePlanId === plan.id && subscribeUiState === 'error'
                          ? 'error'
                          : ''
                  }`}
                  onClick={(event) => handleSubscribe(event, plan)}
                  disabled={isProcessing}
                >
                  {getButtonContent(plan)}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="terms-section">
          <p>
            By proceeding with the subscription, you agree to our{' '}
            <a href="#" className="terms-link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="terms-link">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
