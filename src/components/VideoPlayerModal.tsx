import React, { useEffect, useRef } from 'react';
import './VideoPlayerModal.css';
import { VideoData } from '../types/video';

interface VideoPlayerModalProps {
  video: VideoData;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [video.video]);

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="video-player-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="video-player-title">{video.title}</h2>
        <video
          ref={videoRef}
          src={video.video}
          poster={video.image}
          className="video-player-element"
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
};

export default VideoPlayerModal;
