import React, { useCallback, useState, useRef, useEffect } from 'react';
import './GameCategories.css';
import { useTranslation } from '../contexts/TranslationContext';

interface VideoItem {
  name: string;
  video: string;
  image: string;
}

interface VideoCategoriesProps {
  onVideoClick: () => void;
  onNavigate?: (page: string) => void;
}

interface VideoCardProps {
  video: VideoItem;
  onVideoClick: () => void;
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
    onVideoClick();
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
                videoRef.current.currentTime = 0.1;
                videoRef.current.pause();
              }
            }}
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
  const categories = [
    {
      title: "TOP TRENDING VIDEOS",
      games: [
        { name: "Demon Slayer Fight", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/122_-_Demon_slayer_fight_scene_fopfyr.mp4", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop" },
        { name: "Jojo Pucci Edit", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/126_-_Jojo_Pucci_Edit_x8przs.mp4", image: "https://images.unsplash.com/photo-1611834905996-b30d97dcf651?w=800&auto=format&fit=crop" },
        { name: "Tunnel to Summer", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/123._-_The_tunnel_to_summer_tjmhev.mp4", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop" },
        { name: "OnePiece Edit", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/127_-_Onepiece_edit_ifvaba.mp4", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop" }
      ]
    },
    {
      title: "ADVENTURE VIDEOS",
      games: [
        { name: "Cyberpunk Edit", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/134_-_Cyberpunk_Edit_kwejen.mp4", image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop" },
        { name: "OnePiece Quotes", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/153_-_The_quotes_from_onepiece_aqq6qj.mp4", image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&auto=format&fit=crop" },
        { name: "Death Note Edit", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/148_-_Death_note_edit_rf3xpx.mp4", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop" },
        { name: "OnePiece Funny", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/165_-_Onepiece_funny_momment_qxqmwf.mp4", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop" }
      ]
    },
    {
      title: "ACTION VIDEOS",
      games: [
        { name: "GTA 6 Trailer", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/157_-_GTA_6_Trailer_sdhb8f.mp4", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop" },
        { name: "Naruto X Hinata", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/161_-_Naruto_X_hinata_pu2g4g.mp4", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop" },
        { name: "Sung Jin Woo", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/169_-_Sung_jin_woo_badass_krrzu7.mp4", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop" },
        { name: "Naruto vs Sasuke", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/191_-_Naruto_X_Sasuke_mxmmkw.mp4", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop" }
      ]
    },
    {
      title: "BRAIN TEASE VIDEOS",
      games: [
        { name: "Gear 5 Awakening", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/199_-_Gear_5_Awaken_moment_k1mczv.mp4", image: "https://images.unsplash.com/photo-1498889444388-e67ea62c464b?w=800&auto=format&fit=crop" },
        { name: "Dance Video", video: "https://res.cloudinary.com/dbudqhbum/video/upload/samples/dance-2.mp4", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop" },
        { name: "Usopp Moment", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/188_-_The_usopp_moment_vqarsl.mp4", image: "https://images.unsplash.com/photo-1532009324734-20a7a5813719?w=800&auto=format&fit=crop" },
        { name: "OnePiece Gear 5", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/199_-_Gear_5_Awaken_moment_k1mczv.mp4", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop" }
      ]
    },
    {
      title: "FIGHTING VIDEOS",
      games: [
        { name: "Demon Slayer Fight", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/122_-_Demon_slayer_fight_scene_fopfyr.mp4", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop" },
        { name: "Jojo Pucci Edit", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/126_-_Jojo_Pucci_Edit_x8przs.mp4", image: "https://images.unsplash.com/photo-1611834905996-b30d97dcf651?w=800&auto=format&fit=crop" },
        { name: "Cyberpunk Edit", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/134_-_Cyberpunk_Edit_kwejen.mp4", image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop" },
        { name: "Death Note Edit", video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/148_-_Death_note_edit_rf3xpx.mp4", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop" }
      ]
    }
  ];

  const handleVideoClick = useCallback(() => {
    onVideoClick();
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
