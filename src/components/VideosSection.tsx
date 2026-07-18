import React, { useState, useRef, useEffect } from 'react';
import './VideosSection.css';
import { useTranslation } from '../contexts/TranslationContext';
import { TRENDING_HOME_VIDEOS, primeVideoFrame } from '../config/videoLibrary';

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

  const trendingVideos = TRENDING_HOME_VIDEOS.map((video) => ({
    ...video,
    views: '1.2M',
    duration: '3:00',
  }));

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
                    onLoadedData={(e) => primeVideoFrame(e.currentTarget)}
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
