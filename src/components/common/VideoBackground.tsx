
import React, { useState, useRef, useEffect } from 'react';

const VideoBackground = () => {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoPath, setVideoPath] = useState('/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoBackground: Initializing video with path:', videoPath);

    const handleLoadStart = () => {
      console.log('VideoBackground: Video loading started...');
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      console.log('VideoBackground: Video can play - loading complete');
      setIsLoading(false);
      setVideoError(false);
    };

    const handleError = (e: Event) => {
      console.error('VideoBackground: Video failed to load:', e);
      console.error('VideoBackground: Video element:', video);
      console.error('VideoBackground: Video src:', video.src);
      console.error('VideoBackground: Video readyState:', video.readyState);
      console.error('VideoBackground: Video networkState:', video.networkState);
      setVideoError(true);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      console.log('VideoBackground: Video data loaded successfully');
      console.log('VideoBackground: Video duration:', video.duration);
      console.log('VideoBackground: Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      setIsLoading(false);
    };

    const handleLoadedMetadata = () => {
      console.log('VideoBackground: Video metadata loaded');
    };

    // Check if video file exists by trying to fetch it
    fetch(videoPath, { method: 'HEAD' })
      .then(response => {
        console.log('VideoBackground: Video file check response:', response.status);
        if (!response.ok) {
          console.error('VideoBackground: Video file not found or not accessible');
          setVideoError(true);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error('VideoBackground: Error checking video file:', error);
        setVideoError(true);
        setIsLoading(false);
      });

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoPath]);

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
              console.error('VideoBackground: Error details:', e.currentTarget.error);
              setVideoError(true);
              setIsLoading(false);
            }}
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {isLoading && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-300 via-amber-400 to-red-400 flex items-center justify-center">
              <div className="text-white text-lg font-medium">Loading video background...</div>
            </div>
          )}
        </>
      ) : (
        // Fallback background when video fails
        <div className="w-full h-full bg-gradient-to-br from-orange-300 via-amber-400 to-red-400 flex items-center justify-center">
          <div className="text-white text-sm opacity-75">Video background unavailable</div>
        </div>
      )}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

export default VideoBackground;
