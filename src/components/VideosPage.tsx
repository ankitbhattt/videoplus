import React, { useState, useRef, useEffect } from 'react';
import './VideosPage.css';

interface VideoItem {
  id: number;
  title: string;
  category: string;
  video: string;
  image: string;
}

interface VideosPageProps {
  onVideoClick?: () => void;
}

interface VideoCardProps {
  video: VideoItem;
  onCardClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play video when showVideo becomes true
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const videoEl = videoRef.current;
      if (!videoEl.src && videoEl.dataset.src) {
        videoEl.src = videoEl.dataset.src;
      }
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    }
  }, [showVideo]);

  const playVideo = () => {
    setShowVideo(true);
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShowVideo(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playVideo();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    pauseVideo();
  };

  const handleTouchStart = () => {
    setIsHovered(true);
    playVideo();
    
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
    
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

  const handleCardClick = () => {
    if (!isHovered) {
      setIsHovered(true);
      playVideo();
      
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
      touchTimerRef.current = setTimeout(() => {
        setIsHovered(false);
        pauseVideo();
      }, 5000);
    }
    
    onCardClick();
  };

  return (
    <div 
      className="video-card-new"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <div className="video-wrapper">
        {!showVideo && (
          <img
            src={video.image}
            alt={video.title}
            className="video-thumbnail"
          />
        )}
        {showVideo && (
          <video
            ref={videoRef}
            data-src={video.video}
            poster={video.image}
            muted
            playsInline
            loop
            preload="none"
            onLoadedMetadata={() => {
              if (videoRef.current && !isHovered) {
                videoRef.current.currentTime = 0.01;
                videoRef.current.pause();
              }
            }}
            className={`video-preview ${isHovered ? 'playing' : ''}`}
          />
        )}
        <div className="video-badge">{video.category.toUpperCase()}</div>
      </div>
      <div className="video-details">
        <h3>{video.title}</h3>
      </div>
    </div>
  );
};

const VideosPage: React.FC<VideosPageProps> = ({ onVideoClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allVideos: VideoItem[] = [
    { id: 1, title: 'GTA 6 Trailer', category: 'trailers', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/157_-_GTA_6_Trailer_sdhb8f.mp4', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop' },
    { id: 2, title: 'OnePiece Edit', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/127_-_Onepiece_edit_ifvaba.mp4', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop' },
    { id: 3, title: 'Cyberpunk Edit', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/134_-_Cyberpunk_Edit_kwejen.mp4', image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop' },
    { id: 4, title: 'OnePiece Quotes', category: 'adventure', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/153_-_The_quotes_from_onepiece_aqq6qj.mp4', image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&auto=format&fit=crop' },
    { id: 5, title: 'Death Note Edit', category: 'thriller', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/148_-_Death_note_edit_rf3xpx.mp4', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop' },
    { id: 6, title: 'Demon Slayer Fight', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/122_-_Demon_slayer_fight_scene_fopfyr.mp4', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop' },
    { id: 7, title: 'Jojo Pucci Edit', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/126_-_Jojo_Pucci_Edit_x8przs.mp4', image: 'https://images.unsplash.com/photo-1611834905996-b30d97dcf651?w=800&auto=format&fit=crop' },
    { id: 8, title: 'Tunnel to Summer', category: 'adventure', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/123._-_The_tunnel_to_summer_tjmhev.mp4', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop' },
    { id: 9, title: 'Naruto X Hinata', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/161_-_Naruto_X_hinata_pu2g4g.mp4', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop' },
    { id: 10, title: 'Sung Jin Woo', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/169_-_Sung_jin_woo_badass_krrzu7.mp4', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop' },
    { id: 11, title: 'Gear 5 Awakening', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/199_-_Gear_5_Awaken_moment_k1mczv.mp4', image: 'https://images.unsplash.com/photo-1498889444388-e67ea62c464b?w=800&auto=format&fit=crop' },
    { id: 12, title: 'OnePiece Funny', category: 'adventure', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/165_-_Onepiece_funny_momment_qxqmwf.mp4', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop' },
    { id: 13, title: 'Naruto vs Sasuke', category: 'action', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/191_-_Naruto_X_Sasuke_mxmmkw.mp4', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop' },
    { id: 14, title: 'Usopp Moment', category: 'adventure', video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/188_-_The_usopp_moment_vqarsl.mp4', image: 'https://images.unsplash.com/photo-1532009324734-20a7a5813719?w=800&auto=format&fit=crop' }
  ];

  const categories = [
    { id: 'all', name: 'All Videos', icon: '🎬' },
    { id: 'trailers', name: 'Trailers', icon: '🎭' },
    { id: 'action', name: 'Action', icon: '💥' },
    { id: 'adventure', name: 'Adventure', icon: '🗺️' },
    { id: 'thriller', name: 'Thriller', icon: '👻' }
  ];

  const filteredVideos = selectedCategory === 'all'
    ? allVideos
    : allVideos.filter(video => video.category === selectedCategory);

  return (
    <div className="videos-page-new">
      <div className="videos-content">
        <div className="videos-page-header">
          <h1>Video Library</h1>
          <p>Watch the latest video game content</p>
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="filter-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="videos-grid-new">
          {filteredVideos.map((video) => (
            <VideoCard 
              key={video.id}
              video={video}
              onCardClick={() => onVideoClick?.()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
