
import React, { useState, useRef, useEffect } from 'react';

const VideoBackground = () => {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoBackground: Initializing video for homepage');

    const handleCanPlay = () => {
      console.log('VideoBackground: Video can play - loading complete');
      setIsLoading(false);
      setVideoError(false);
    };

    const handleError = (e: Event) => {
      console.error('VideoBackground: Video failed to load:', e);
      setVideoError(true);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      console.log('VideoBackground: Video data loaded successfully');
      setIsLoading(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  console.log('VideoBackground: Rendering with states:', { videoError, isLoading });

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
            onError={(e) => {
              console.error('VideoBackground: Video element error event fired:', e);
              setVideoError(true);
              setIsLoading(false);
            }}
          >
            <source src="/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {isLoading && (
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
              <div className="text-white text-lg font-medium">Loading video background...</div>
            </div>
          )}
        </>
      ) : (
        // Fallback background when video fails - use black instead of orange
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="text-white text-sm opacity-75">Video background unavailable</div>
        </div>
      )}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

export default VideoBackground;
