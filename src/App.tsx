import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import PostLoginHeader from './components/PostLoginHeader';
import InteractiveCarousel from './components/InteractiveCarousel';
import VideoCategories from './components/GameCategories';
import VideosSection from './components/VideosSection';
import FavoritesSection from './components/FavoritesSection';
import LoginModal from './components/LoginModal';
import OTPModal from './components/OTPModal';
import RewardsPage from './components/RewardsPage';
import ProfilePage from './components/ProfilePage';
import SubscriptionPage from './components/SubscriptionPage';
import NewsPage from './components/NewsPage';
import UnsubscribePage from './components/UnsubscribePage';
import SubscriptionManagementPage from './components/SubscriptionManagementPage';
import VideosPage from './components/VideosPage';
import FavoritesPage from './components/FavoritesPage';
import ExploreVideosPage from './components/ExploreVideosPage';
import FAQPage from './components/FAQPage';
import AboutPage from './components/AboutPage';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import FloatingActionButton from './components/FloatingActionButton';
import Footer from './components/Footer';
import VideoPlayerModal from './components/VideoPlayerModal';
import { TranslationProvider } from './contexts/TranslationContext';
import { buildMsisdn, sendOtp, verifyOtp } from './services/otpService';
import { VideoData } from './types/video';
import {
  clearSession,
  createOtpVerifiedSession,
  createSubscribedSession,
  isSessionActive,
  loadSession,
  saveSession,
} from './utils/sessionStorage';

type Page = 'home' | 'rewards' | 'profile' | 'subscription' | 'news' | 'unsubscribe' | 'subscription-management' | 'videos' | 'favorites' | 'explore' | 'faq' | 'about';

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerifyError, setOtpVerifyError] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    const session = loadSession();

    if (!isSessionActive(session)) {
      clearSession();
      return;
    }

    if (session) {
      setMsisdn(session.msisdn);
      setPhoneNumber(session.phoneNumber);
      setIsLoggedIn(true);
      setIsSubscribed(session.isSubscribed);
    }
  }, []);

  const handleVideoClick = useCallback(
    (video?: VideoData) => {
      if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
      }

      if (!isSubscribed) {
        setCurrentPage('subscription');
        return;
      }

      if (video) {
        setActiveVideo(video);
      }
    },
    [isLoggedIn, isSubscribed]
  );

  const handleSubscribeClick = useCallback(() => {
    if (isSubscribed) {
      return;
    }

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setCurrentPage('subscription');
  }, [isLoggedIn, isSubscribed]);

  const handleLoginSubmit = useCallback(async (phone: string) => {
    const phoneDigits = phone.replace(/[^\d]/g, '').slice(-8);
    const nextMsisdn = buildMsisdn(phoneDigits);

    setIsSendingOtp(true);

    try {
      const response = await sendOtp(nextMsisdn);

      if (response.ok) {
        setPhoneNumber(phone);
        setMsisdn(nextMsisdn);
        setOtpVerifyError('');
        setShowLoginModal(false);
        setShowOTPModal(true);
        setNotification({
          message: 'OTP sent successfully',
          type: 'success',
        });
      } else {
        setNotification({
          message: 'There is an error please try again later.',
          type: 'error',
        });
      }
    } catch {
      setNotification({
        message: 'There is an error please try again later.',
        type: 'error',
      });
    } finally {
      setIsSendingOtp(false);
    }
  }, []);

  const handleOTPVerify = useCallback(
    async (otp: string) => {
      setIsVerifyingOtp(true);
      setOtpVerifyError('');

      try {
        const response = await verifyOtp(msisdn, otp);

        if (response.ok) {
          const session = createOtpVerifiedSession(msisdn, phoneNumber);
          saveSession(session);

          setShowOTPModal(false);
          setIsLoggedIn(true);
          setIsSubscribed(false);
          setCurrentPage('subscription');
          setNotification({
            message: 'Welcome to VideoPlus!',
            type: 'success',
          });
        } else {
          const errorMessage =
            response.errorMessage || 'There is an error please try again later.';
          setOtpVerifyError(errorMessage);
          setNotification({
            message: errorMessage,
            type: 'error',
          });
        }
      } catch {
        const errorMessage = 'There is an error please try again later.';
        setOtpVerifyError(errorMessage);
        setNotification({
          message: errorMessage,
          type: 'error',
        });
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [msisdn, phoneNumber]
  );

  const handleSubscribeSuccess = useCallback(
    (planId: string) => {
      const session = createSubscribedSession(msisdn, phoneNumber, planId);
      saveSession(session);

      setIsLoggedIn(true);
      setIsSubscribed(true);
      setCurrentPage('home');
    },
    [msisdn, phoneNumber]
  );

  const handleBackToLogin = useCallback(() => {
    setShowOTPModal(false);
    setShowLoginModal(true);
    setOtpVerifyError('');
  }, []);

  const handleCloseModals = useCallback(() => {
    setShowLoginModal(false);
    setShowOTPModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    clearSession();
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setMsisdn('');
    setPhoneNumber('');
    setActiveVideo(null);
    setCurrentPage('home');
  }, []);

  const handleNavigate = useCallback(
    (page: string) => {
      if (page === 'login') {
        setShowLoginModal(true);
        return;
      }

      if (page === 'subscription') {
        handleSubscribeClick();
        return;
      }

      setCurrentPage(page as Page);
    },
    [handleSubscribeClick]
  );

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleThemeChange = useCallback((theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
  }, []);

  const handleQuickAction = useCallback(() => {
    setNotification({
      message: 'Quick action activated! ⚡',
      type: 'info',
    });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'rewards':
        return <RewardsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'subscription':
        return (
          <SubscriptionPage
            msisdn={msisdn}
            onNotify={(message, type) => setNotification({ message, type })}
            onSubscribeSuccess={handleSubscribeSuccess}
          />
        );
      case 'news':
        return <NewsPage />;
      case 'unsubscribe':
        return <UnsubscribePage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'subscription-management':
        return <SubscriptionManagementPage onNavigate={handleNavigate} />;
      case 'videos':
        return <VideosPage onVideoClick={handleVideoClick} />;
      case 'favorites':
        return <FavoritesPage onVideoClick={handleVideoClick} />;
      case 'explore':
        return <ExploreVideosPage />;
      case 'faq':
        return <FAQPage />;
      case 'about':
        return <AboutPage />;
      default:
        return (
          <>
            <InteractiveCarousel onGameClick={handleVideoClick} />
            <FavoritesSection onVideoClick={handleVideoClick} onNavigate={handleNavigate} />
            <VideoCategories onVideoClick={handleVideoClick} onNavigate={handleNavigate} />
            <VideosSection />
          </>
        );
    }
  };

  return (
    <div className="App" data-theme={currentTheme}>
      {isLoggedIn ? (
        <PostLoginHeader
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentPage={currentPage}
          isSubscribed={isSubscribed}
          onSubscribeClick={handleSubscribeClick}
        />
      ) : (
        <Header
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onSubscribeClick={handleSubscribeClick}
        />
      )}

      {renderPage()}

      <Footer />

      {showLoginModal && (
        <LoginModal
          onSubmit={handleLoginSubmit}
          onClose={handleCloseModals}
          isSubmitting={isSendingOtp}
        />
      )}

      {showOTPModal && (
        <OTPModal
          phoneNumber={phoneNumber}
          onVerify={handleOTPVerify}
          onBack={handleBackToLogin}
          onClose={handleCloseModals}
          isVerifying={isVerifyingOtp}
          verifyError={otpVerifyError}
        />
      )}

      {activeVideo && (
        <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}

      <ThemeToggle onThemeChange={handleThemeChange} />
      <FloatingActionButton onQuickAction={handleQuickAction} />
    </div>
  );
}

function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
}

export default App;
