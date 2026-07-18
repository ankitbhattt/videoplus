import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { useTranslation } from '../contexts/TranslationContext';
import videoPlusLogo from '../assets/VideoPlus Logo.png';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
  onSubscribeClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, onSubscribeClick }) => {
  const { language, setLanguage, t } = useTranslation();
  // const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' }
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode as 'en' | 'zh' | 'fr');
    setShowLanguageDropdown(false);
  };

  // Debug menu visibility
  useEffect(() => {
    console.log('Menu state changed:', showMobileMenu);
    if (mobileMenuRef.current) {
      const menu = mobileMenuRef.current;
      console.log('Menu element exists:', !!menu);
      console.log('Menu classes:', menu.className);
      const styles = window.getComputedStyle(menu);
      console.log('Computed display:', styles.display);
      console.log('Computed visibility:', styles.visibility);
      console.log('Computed opacity:', styles.opacity);
      console.log('Computed z-index:', styles.zIndex);
      console.log('Computed position:', styles.position);
      console.log('Computed top:', styles.top);
      console.log('Computed left:', styles.left);
      console.log('Computed width:', styles.width);
      console.log('Computed height:', styles.height);
    } else {
      console.log('Menu element NOT found in DOM');
    }
  }, [showMobileMenu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (languageRef.current && !languageRef.current.contains(target)) {
        setShowLanguageDropdown(false);
      }
      if (showMobileMenu && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        const htmlTarget = event.target as HTMLElement;
        if (!htmlTarget.closest('.mobile-menu-toggle')) {
          setShowMobileMenu(false);
        }
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [showMobileMenu]);

  // const handleProfileAction = (action: string) => {
  //   setShowProfileDropdown(false);
  //   setShowMobileMenu(false);
  //   if (action === 'login' && onNavigate) {
  //     onNavigate('login');
  //   } else if (action === 'videos' && onNavigate) {
  //     onNavigate('videos');
  //   } else if (action === 'faq' && onNavigate) {
  //     onNavigate('faq');
  //   } else if (action === 'about' && onNavigate) {
  //     onNavigate('about');
  //   }
  // };

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setShowMobileMenu(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => handleNavigation('home')}>
          <img src={videoPlusLogo} alt="VideoPlus" className="videoplus-logo" />
        </div>
        
        {/* Mobile Header Center Elements */}
        <div className="mobile-header-center">
          <div className="mobile-header-indicator">
            <span className="indicator-dot"></span>
          </div>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${showMobileMenu ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Toggle clicked, current state:', showMobileMenu);
            setShowMobileMenu(prev => {
              console.log('Setting menu to:', !prev);
              return !prev;
            });
          }}
          aria-label="Toggle menu"
          type="button"
          style={{ zIndex: 10000 }}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <nav className="navigation">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            {t('header.home')}
          </button>
          <button 
            className={`nav-link ${currentPage === 'videos' ? 'active' : ''}`}
            onClick={() => handleNavigation('videos')}
          >
            {t('header.videos')}
          </button>
          <button 
            className={`nav-link ${currentPage === 'favorites' ? 'active' : ''}`}
            onClick={() => handleNavigation('favorites')}
          >
            FAVORITES
          </button>
          <button 
            className="nav-link"
            onClick={() => handleNavigation('login')}
          >
            LOGIN
          </button>
        </nav>
        
        <div className="header-actions">
          <div className="language-selector" ref={languageRef}>
            <button 
              className="action-btn language-btn"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span className="language-icon">
                {languages.find(lang => lang.code === language)?.flag || '🌐'}
              </span>
            </button>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`language-option ${language === lang.code ? 'selected' : ''}`}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="radio-indicator">
                      {language === lang.code && <div className="radio-dot"></div>}
                    </span>
                    <span className="language-flag">{lang.flag}</span>
                    {lang.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="subscribe-btn"
            onClick={() => onSubscribeClick?.()}
          >
            {t('header.subscribe')}
          </button>
          
          {/* <div className="profile-dropdown" ref={profileRef}>
            <button 
              className={`action-btn profile-btn ${showProfileDropdown ? 'active' : ''}`}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <span className="profile-icon">👤</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            {showProfileDropdown && (
              <div className="profile-menu">
                <div className="profile-menu-item" onClick={() => handleProfileAction('login')}>
                  <span className="menu-icon">🔑</span>
                  {t('login.title')}
                </div>
                <div className="profile-menu-item" onClick={() => handleProfileAction('videos')}>
                  <span className="menu-icon">🎬</span>
                  {t('header.videos')}
                </div>
                <div className="profile-menu-item" onClick={() => handleProfileAction('faq')}>
                  <span className="menu-icon">❓</span>
                  {t('profile.menu.faq')}
                </div>
                <div className="profile-menu-item" onClick={() => handleProfileAction('about')}>
                  <span className="menu-icon">ℹ️</span>
                  {t('profile.menu.about')}
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
      
      {/* Mobile Menu - Outside header-container */}
      <div 
        className={`mobile-menu ${showMobileMenu ? 'open' : ''}`} 
        ref={mobileMenuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-menu-content">
          <div className="mobile-menu-nav">
            <button 
              className={`mobile-nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavigation('home')}
            >
              <span className="mobile-nav-icon">🏠</span>
              {t('header.home')}
            </button>
            <button 
              className={`mobile-nav-link ${currentPage === 'videos' ? 'active' : ''}`}
              onClick={() => handleNavigation('videos')}
            >
              <span className="mobile-nav-icon">🎬</span>
              {t('header.videos')}
            </button>
            <button 
              className={`mobile-nav-link ${currentPage === 'favorites' ? 'active' : ''}`}
              onClick={() => handleNavigation('favorites')}
            >
              <span className="mobile-nav-icon">❤️</span>
              FAVORITES
            </button>
            <button 
              className={`mobile-nav-link ${currentPage === 'subscription' ? 'active' : ''}`}
              onClick={() => {
                setShowMobileMenu(false);
                onSubscribeClick?.();
              }}
            >
              <span className="mobile-nav-icon">💳</span>
              {t('header.subscribe')}
            </button>
            <button 
              className="mobile-nav-link"
              onClick={() => handleNavigation('login')}
            >
              <span className="mobile-nav-icon">🔑</span>
              LOGIN
            </button>
          </div>
          
          <div className="mobile-menu-divider"></div>
          
          <div className="mobile-menu-language">
            <div className="mobile-language-label">Language</div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`mobile-language-option ${language === lang.code ? 'selected' : ''}`}
                onClick={() => {
                  handleLanguageSelect(lang.code);
                  setShowMobileMenu(false);
                }}
              >
                <span className="mobile-nav-icon">{lang.flag}</span>
                {lang.name}
                {language === lang.code && <span className="check-icon">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
