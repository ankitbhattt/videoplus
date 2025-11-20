import React, { useState, useRef, useEffect } from 'react';
import './VideosSection.css';
import { useTranslation } from '../contexts/TranslationContext';

interface TrendingVideo {
  name: string;
  video: string;
  image: string;
  views: string;
  duration: string;
}

const VideosSection: React.FC = () => {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const trendingVideos: TrendingVideo[] = [
    { 
      name: "GTA 6 Trailer", 
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/157_-_GTA_6_Trailer_sdhb8f.mp4", 
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop",
      views: "2.5M",
      duration: "3:24"
    },
    { 
      name: "OnePiece Edit", 
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/127_-_Onepiece_edit_ifvaba.mp4", 
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop",
      views: "1.8M",
      duration: "2:45"
    },
    { 
      name: "Cyberpunk Edit", 
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/134_-_Cyberpunk_Edit_kwejen.mp4", 
      image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop",
      views: "1.2M",
      duration: "4:12"
    },
    { 
      name: "Death Note Edit", 
      video: "https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/148_-_Death_note_edit_rf3xpx.mp4", 
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop",
      views: "950K",
      duration: "3:58"
    }
  ];

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const video = videoRefs.current[index];
    if (video) {
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };
  
  return (
    <div className="videos-section">
      <div className="videos-container">
        <div className="videos-header">
          <div className="videos-title-wrapper">
            <h2 className="videos-title">🔥 Trending Videos</h2>
            <p className="videos-subtitle">Most watched videos this week</p>
          </div>
        </div>
        <div className="trending-videos-grid">
          {trendingVideos.map((video, index) => (
            <div 
              key={index}
              className="trending-video-card"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="trending-video-wrapper">
                {hoveredIndex === index ? (
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    data-src={video.video}
                    poster={video.image}
                    className="trending-video-element"
                    muted
                    playsInline
                    loop={false}
                    preload="none"
                  />
                ) : (
                  <img
                    src={video.image}
                    alt={video.name}
                    className="trending-video-thumbnail"
                  />
                )}
                <div className="trending-video-overlay">
                  <div className="trending-video-badge">TRENDING</div>
                  <div className="trending-video-duration">{video.duration}</div>
                </div>
                <div className="trending-video-info">
                  <h3 className="trending-video-title">{video.name}</h3>
                  <div className="trending-video-stats">
                    <span className="trending-video-views">👁 {video.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosSection;
