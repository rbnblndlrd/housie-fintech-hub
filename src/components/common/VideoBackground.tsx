
import React, { useState, useRef, useEffect } from 'react';

const VideoBackground = () => {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      console.log('Video loading started...');
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      setIsLoading(false);
      setVideoError(false);
    };

    const handleError = (e: Event) => {
      console.error('Video failed to load:', e);
      setVideoError(true);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded successfully');
      setIsLoading(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0">
      {!videoError ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.8)' }}
            onError={() => {
              console.error('Video element error event fired');
              setVideoError(true);
              setIsLoading(false);
            }}
          >
            <source src="/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
          </video>
          
          {(isLoading || videoError) && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-300 via-amber-400 to-red-400" />
          )}
        </>
      ) : (
        // Fallback background when video fails
        <div className="w-full h-full bg-gradient-to-br from-orange-300 via-amber-400 to-red-400" />
      )}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

export default VideoBackground;
