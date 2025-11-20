import React, { useState, useEffect, useCallback } from 'react';
import './InteractiveCarousel.css';
import { useTranslation } from '../contexts/TranslationContext';

interface CarouselItem {
  id: number;
  title: string;
  video: string;
  description: string;
  image: string;
}

interface InteractiveCarouselProps {
  onGameClick: () => void;
}

const InteractiveCarousel: React.FC<InteractiveCarouselProps> = ({ onGameClick }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(false); // Start with false - use image instead
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [videoTimer, setVideoTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const moreInfoRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safely detect mobile once on mount
    if (typeof window !== 'undefined' && window.innerWidth) {
      setIsMobile(window.innerWidth <= 768);
    }
  }, []);

  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      title: "GTA 6 Trailer",
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/157_-_GTA_6_Trailer_sdhb8f.mp4",
      description: "The most anticipated game trailer",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "OnePiece Edit",
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/127_-_Onepiece_edit_ifvaba.mp4",
      description: "Epic OnePiece moments compilation",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Cyberpunk Edit",
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/134_-_Cyberpunk_Edit_kwejen.mp4",
      description: "Futuristic cyberpunk action",
      image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "OnePiece Quotes",
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/153_-_The_quotes_from_onepiece_aqq6qj.mp4",
      description: "Inspirational quotes from OnePiece",
      image: "https://images.unsplash.com/photo-1532146629-5b8e43dd8f1b?w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Death Note Edit",
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/148_-_Death_note_edit_rf3xpx.mp4",
      description: "Mind games and psychological thriller",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop"
    }
  ];


  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }, [carouselItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  }, [carouselItems.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    // Disable auto-advance on mobile to prevent performance issues
    if (isMobile) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying, isMobile]);

  // Start video when slide changes (only on hover)
  useEffect(() => {
    const video = videoRef.current;
    if (video && isHovered) {
      // Lazy load: set src if not loaded
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [currentIndex, isHovered]);

  // Handle click outside More Info
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreInfoRef.current && !moreInfoRef.current.contains(event.target as Node)) {
        setShowMoreInfo(false);
      }
    };

    if (showMoreInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      if (videoTimer) clearTimeout(videoTimer);
      if (touchTimer) clearTimeout(touchTimer);
    };
  }, [hoverTimer, videoTimer, touchTimer]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAutoPlaying(false);
    setShowVideo(true); // Show video element instead of image
    
    // Start video immediately on hover - load src if not loaded
    const video = videoRef.current;
    if (video) {
      // Lazy load: set src only when hovered/interacted
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAutoPlaying(true);
    setShowVideo(false); // Hide video, show image again
    
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    if (videoTimer) {
      clearTimeout(videoTimer);
      setVideoTimer(null);
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleTouchStart = () => {
    setIsHovered(true);
    setIsAutoPlaying(false);
    setShowVideo(true); // Show video element instead of image
    
    // Start video immediately on touch - load src if not loaded
    const video = videoRef.current;
    if (video) {
      // Lazy load: set src only when touched
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
    
    // Auto-pause after 5 seconds on touch devices
    if (touchTimer) {
      clearTimeout(touchTimer);
    }
      const timer = setTimeout(() => {
        setIsHovered(false);
        setIsAutoPlaying(true);
        setShowVideo(false); // Hide video after touch timeout
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }, 5000);
      setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    // Ensure video plays on touch end if it didn't on touch start
    const video = videoRef.current;
    if (video && video.paused && isHovered) {
      video.play().catch(() => {});
    }
  };

  const handleCarouselClick = () => {
    // On mobile, ensure video plays on click as well (don't open login modal on carousel click)
    // Login modal should only open when clicking the play button
    if (!isHovered) {
      setIsHovered(true);
      setIsAutoPlaying(false);
      
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      
      // Auto-pause after 5 seconds on mobile
      if (touchTimer) {
        clearTimeout(touchTimer);
      }
      const timer = setTimeout(() => {
        setIsHovered(false);
        setIsAutoPlaying(true);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }, 5000);
      setTouchTimer(timer);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering carousel click
    onGameClick();
  };

  const handleMoreInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering carousel click
    setShowMoreInfo(!showMoreInfo);
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <div 
      className="interactive-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleCarouselClick}
    >
      <div className="carousel-container">
        <div className="slide-content">
          <div className="slide-text-overlay">
            <div className="slide-info">
              <h1 className="slide-title">{currentItem.title}</h1>
              <p className="slide-description">{currentItem.description}</p>
              <div className="slide-actions">
                <button 
                  className="slide-button primary"
                  onClick={(e) => handlePlayClick(e)}
                >
                  <span className="btn-icon">▶</span>
                  {t('homepage.action.play')}
                </button>
                <button 
                  className="slide-button secondary hide-on-mobile"
                  onClick={(e) => handleMoreInfoClick(e)}
                >
                  <span className="btn-icon">ℹ</span>
                  {t('homepage.action.moreInfo')}
                </button>
              </div>
            </div>
            
            {showMoreInfo && (
              <div className="more-info-content" ref={moreInfoRef}>
                <div className="info-section">
                  <h3>Game Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Genre:</span>
                      <span className="info-value">{currentItem.title}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Rating:</span>
                      <span className="info-value">★★★★★ (4.8/5)</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Players:</span>
                      <span className="info-value">1-4 Players</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Platform:</span>
                      <span className="info-value">PC, Mobile, Console</span>
                    </div>
                  </div>
                  <div className="info-description">
                    <p>Immerse yourself in the ultimate gaming experience with stunning graphics, 
                    smooth gameplay, and endless entertainment. Perfect for both casual and hardcore gamers.</p>
                  </div>
                  <div className="info-features">
                    <h4>Key Features:</h4>
                    <ul>
                      <li>🎮 Intuitive controls and smooth gameplay</li>
                      <li>🎨 Stunning visual effects and graphics</li>
                      <li>🏆 Multiple difficulty levels and achievements</li>
                      <li>🌐 Online multiplayer support</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="slide-media">
            {!showVideo && (
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="slide-image-element"
              />
            )}
            {showVideo && (
              <video
                key={`video-${currentIndex}`}
                ref={videoRef}
                data-src={currentItem.video}
                poster={currentItem.image}
                className="slide-video-element visible"
                muted
                playsInline
                loop={false}
                preload="none"
              />
            )}
            <div className="media-overlay video-active">
              <div className="video-preview-badge">
                <span className="preview-dot"></span>
                <span>PREVIEW</span>
              </div>
            </div>
            
            
            
            {/* Progress indicator for current slide */}
            <div className="slide-progress">
              <div className="progress-dots">
                {carouselItems.map((_, index) => (
                  <div 
                    key={index}
                    className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-arrow left" onClick={prevSlide}>
        ‹
      </button>
      <button className="carousel-arrow right" onClick={nextSlide}>
        ›
      </button>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveCarousel;
