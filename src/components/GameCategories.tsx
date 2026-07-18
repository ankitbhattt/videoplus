import React, { useCallback, useState, useRef, useEffect } from 'react';
import './GameCategories.css';
import { useTranslation } from '../contexts/TranslationContext';
import { VideoData } from '../types/video';
import { HOME_CATEGORY_SECTIONS, primeVideoFrame } from '../config/videoLibrary';

interface VideoItem {
  name: string;
  video: string;
  image: string;
}

interface VideoCategoriesProps {
  onVideoClick: (video: VideoData) => void;
  onNavigate?: (page: string) => void;
}

interface VideoCardProps {
  video: VideoItem;
  onVideoClick: (video: VideoData) => void;
  onFavorite?: (name: string) => void;
  isFavorite?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoClick, onFavorite, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // Start with false - use image instead
  const [favorite, setFavorite] = useState(isFavorite || false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play video when showVideo becomes true
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const videoEl = videoRef.current;
      // Lazy load: set src only when hovered/interacted
      if (!videoEl.src && videoEl.dataset.src) {
        videoEl.src = videoEl.dataset.src;
      }
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    }
  }, [showVideo]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onFavorite) {
      onFavorite(video.name);
    }
  };

  const playVideo = () => {
    setShowVideo(true); // Show video element instead of image - useEffect will handle play
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShowVideo(false); // Hide video, show image again
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playVideo();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    pauseVideo();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default to allow natural touch behavior
    setIsHovered(true);
    playVideo(); // Will trigger useEffect to play
    
    // Clear any existing timer
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
    
    // Auto-pause after 5 seconds on touch devices
    touchTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      pauseVideo();
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    // On mobile, ensure video plays on click as well
    if (!isHovered) {
      setIsHovered(true);
      playVideo();
      
      // Auto-pause after 5 seconds on mobile
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
      touchTimerRef.current = setTimeout(() => {
        setIsHovered(false);
        pauseVideo();
      }, 5000);
    }
    
    // Call the original onClick handler
    onVideoClick({
      title: video.name,
      video: video.video,
      image: video.image,
    });
  };

  return (
    <div 
      className={`video-card ${isHovered ? 'hovered' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <div className="video-image-container">
        {!showVideo && (
          <img
            src={video.image}
            alt={video.name}
            className="video-image"
          />
        )}
        {showVideo && (
          <video
            ref={videoRef}
            data-src={video.video}
            poster={video.image}
            className="video-element visible"
            muted
            playsInline
            loop={false}
            preload="none"
            onLoadedMetadata={() => {
              if (videoRef.current && !isHovered) {
                primeVideoFrame(videoRef.current);
                videoRef.current.pause();
              }
            }}
            onLoadedData={(e) => primeVideoFrame(e.currentTarget)}
          />
        )}
        <div className="video-overlay video-active">
          <div className="video-preview-badge">
            <span className="preview-dot"></span>
            <span>PREVIEW</span>
          </div>
        </div>
        <button 
          className={`favorite-btn ${favorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
        >
          ❤️
        </button>
      </div>
      <h3 className="video-title">{video.name}</h3>
    </div>
  );
};

const VideoCategories: React.FC<VideoCategoriesProps> = ({ onVideoClick, onNavigate }) => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('snapflix_favorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);
  
  // Save favorites to localStorage
  const handleFavorite = (videoName: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(videoName)) {
      newFavorites.delete(videoName);
    } else {
      newFavorites.add(videoName);
    }
    setFavorites(newFavorites);
    localStorage.setItem('snapflix_favorites', JSON.stringify(Array.from(newFavorites)));
  };
  
  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('videos');
    }
  };
  const categories = HOME_CATEGORY_SECTIONS;

  const handleVideoClick = useCallback((video: VideoData) => {
    onVideoClick(video);
  }, [onVideoClick]);

  return (
    <div className="game-categories">
      <div className="categories-header">
        <h1 className="categories-main-title">{t('homepage.categories.title')}</h1>
        <p className="categories-main-subtitle">{t('homepage.categories.subtitle')}</p>
      </div>
      
      {categories.map((category, categoryIndex) => (
        <section key={categoryIndex} className="category-section">
          <div className="category-header">
            <h2 className="category-title">{category.title}</h2>
            <button 
              className="view-all-btn" 
              onClick={handleViewAll}
            >
              View All →
            </button>
          </div>
          
          <div className="videos-grid">
            {category.games.map((video, videoIndex) => (
              <VideoCard 
                key={videoIndex}
                video={video}
                onVideoClick={handleVideoClick}
                onFavorite={handleFavorite}
                isFavorite={favorites.has(video.name)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default VideoCategories;
