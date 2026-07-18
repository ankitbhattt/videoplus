import React, { useEffect, useState } from 'react';
import './FavoritesSection.css';
import { VideoData } from '../types/video';
import { ALL_HOME_VIDEOS } from '../config/videoLibrary';

interface VideoItem {
  name: string;
  video: string;
  image: string;
  category: string;
}

interface FavoritesSectionProps {
  onVideoClick: (video: VideoData) => void;
  onNavigate?: (page: string) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ onVideoClick, onNavigate }) => {
  const [favoriteVideos, setFavoriteVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      const stored = localStorage.getItem('snapflix_favorites');
      if (stored) {
        const favoriteNames = new Set(JSON.parse(stored));
        
        const allVideos = ALL_HOME_VIDEOS.map((video) => ({
          ...video,
          category: 'Favorites',
        }));
        
        const favorites = allVideos.filter(video => favoriteNames.has(video.name));
        setFavoriteVideos(favorites);
      }
    };
    
    loadFavorites();
    
    // Listen for storage changes (when favorites are updated)
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadFavorites);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadFavorites);
    };
  }, []);
  
  if (favoriteVideos.length === 0) {
    return null;
  }
  
  return (
    <div className="favorites-section">
      <div className="favorites-header">
        <h2 className="favorites-title">
          ❤️ Your Favorite Videos
        </h2>
        {onNavigate && (
          <button 
            className="view-all-btn"
            onClick={() => onNavigate('videos')}
          >
            View All →
          </button>
        )}
      </div>
      
      <div className="favorites-grid">
        {favoriteVideos.slice(0, 4).map((video, index) => (
          <div 
            key={index}
            className="favorite-card"
            onClick={() =>
              onVideoClick({
                title: video.name,
                video: video.video,
                image: video.image,
              })
            }
          >
            <div className="favorite-video-container">
              <img
                src={video.image}
                alt={video.name}
                className="favorite-thumbnail"
                onMouseEnter={(e) => {
                  const container = e.currentTarget.parentElement;
                  if (container && !container.querySelector('video')) {
                    const img = e.currentTarget;
                    const videoEl = document.createElement('video');
                    videoEl.src = video.video;
                    videoEl.poster = video.image;
                    videoEl.className = 'favorite-video-element';
                    videoEl.muted = true;
                    videoEl.playsInline = true;
                    videoEl.loop = true;
                    videoEl.preload = 'none';
                    videoEl.style.width = '100%';
                    videoEl.style.height = '100%';
                    videoEl.style.objectFit = 'cover';
                    videoEl.style.position = 'absolute';
                    videoEl.style.top = '0';
                    videoEl.style.left = '0';
                    videoEl.onloadeddata = () => videoEl.play().catch(() => {});
                    container.appendChild(videoEl);
                    img.style.display = 'none';
                  }
                }}
                onTouchStart={(e) => {
                  const container = e.currentTarget.parentElement;
                  if (container && !container.querySelector('video')) {
                    const img = e.currentTarget;
                    const videoEl = document.createElement('video');
                    videoEl.src = video.video;
                    videoEl.poster = video.image;
                    videoEl.className = 'favorite-video-element';
                    videoEl.muted = true;
                    videoEl.playsInline = true;
                    videoEl.loop = true;
                    videoEl.preload = 'none';
                    videoEl.style.width = '100%';
                    videoEl.style.height = '100%';
                    videoEl.style.objectFit = 'cover';
                    videoEl.style.position = 'absolute';
                    videoEl.style.top = '0';
                    videoEl.style.left = '0';
                    videoEl.onloadeddata = () => videoEl.play().catch(() => {});
                    container.appendChild(videoEl);
                    img.style.display = 'none';
                  }
                }}
              />
              <div className="favorite-overlay">
                <span className="favorite-badge">❤️ FAVORITE</span>
              </div>
            </div>
            <h3 className="favorite-title">{video.name}</h3>
            <span className="favorite-category">{video.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;

