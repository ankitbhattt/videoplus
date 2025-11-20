import React, { useState, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import PostLoginHeader from './components/PostLoginHeader';
import HeroSection from './components/HeroSection';
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
import ParticleBackground from './components/ParticleBackground';
import SimpleParticleBackground from './components/SimpleParticleBackground';
import FloatingActionButton from './components/FloatingActionButton';
import Footer from './components/Footer';
import { TranslationProvider } from './contexts/TranslationContext';

type Page = 'home' | 'rewards' | 'profile' | 'subscription' | 'news' | 'unsubscribe' | 'subscription-management' | 'videos' | 'favorites' | 'explore' | 'faq' | 'about';

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const handleVideoClick = useCallback(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setCurrentPage('subscription');
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = useCallback((phone: string) => {
    setPhoneNumber(phone);
    setShowLoginModal(false);
    setShowOTPModal(true);
  }, []);

  const handleOTPVerify = useCallback(() => {
    setShowOTPModal(false);
    setIsLoggedIn(true);
    setCurrentPage('subscription');
    setNotification({
      message: 'Welcome to VideoPlus!',
      type: 'success'
    });
  }, []);

  const handleCloseModals = useCallback(() => {
    setShowLoginModal(false);
    setShowOTPModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  }, []);

  const handleNavigate = useCallback((page: string) => {
    if (page === 'login') {
      setShowLoginModal(true);
    } else {
      setCurrentPage(page as Page);
    }
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleThemeChange = useCallback((theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
  }, []);

  const handleQuickAction = useCallback(() => {
    setNotification({
      message: 'Quick action activated! ⚡',
      type: 'info'
    });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'rewards':
        return <RewardsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'subscription':
        return <SubscriptionPage />;
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
      {/* Particle background disabled for performance - was causing crashes */}
      {/* <SimpleParticleBackground /> */}
      
      {isLoggedIn ? (
        <PostLoginHeader 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
      ) : (
        <Header 
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
      )}
      
      
      {renderPage()}
      
      <Footer />
      
      {showLoginModal && (
        <LoginModal 
          onSubmit={handleLoginSubmit}
          onClose={handleCloseModals}
        />
      )}
      
      {showOTPModal && (
        <OTPModal 
          phoneNumber={phoneNumber}
          onVerify={handleOTPVerify}
          onClose={handleCloseModals}
        />
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