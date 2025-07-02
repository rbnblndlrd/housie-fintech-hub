
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VideoState {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
}

const VideoBackground = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    isLoading: true,
    hasError: false,
    retryCount: 0
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const attemptVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log(`VideoBackground: Loading attempt ${videoState.retryCount + 1} - using /lovable-uploads/automne_gif.mp4`);
    
    setVideoState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false
    }));

    const handleSuccess = () => {
      console.log('VideoBackground: Video loaded successfully from /lovable-uploads/automne_gif.mp4');
      setVideoState(prev => ({
        ...prev,
        isLoading: false,
        hasError: false
      }));
    };

    const handleError = () => {
      console.error('VideoBackground: Video failed to load from /lovable-uploads/automne_gif.mp4');
      if (videoState.retryCount < MAX_RETRIES) {
        const nextRetryCount = videoState.retryCount + 1;
        console.log(`VideoBackground: Retrying in ${RETRY_DELAY}ms (attempt ${nextRetryCount})`);
        
        setVideoState(prev => ({ ...prev, retryCount: nextRetryCount }));
        
        retryTimeoutRef.current = setTimeout(() => {
          attemptVideoLoad();
        }, RETRY_DELAY);
      } else {
        console.error('VideoBackground: Max retries exceeded');
        setVideoState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true
        }));
      }
    };

    // Set up event listeners
    video.addEventListener('loadeddata', handleSuccess, { once: true });
    video.addEventListener('canplay', handleSuccess, { once: true });
    video.addEventListener('error', handleError, { once: true });

    // Load the video with correct path
    video.src = '/lovable-uploads/automne_gif.mp4';
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleSuccess);
      video.removeEventListener('canplay', handleSuccess);
      video.removeEventListener('error', handleError);
    };
  }, [videoState.retryCount]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    attemptVideoLoad();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [attemptVideoLoad]);

  return (
    <div className="fixed inset-0 w-full h-full z-0">
      {!videoState.hasError ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src="/lovable-uploads/automne_gif.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {videoState.isLoading && (
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-lg font-medium mb-2">
                  Loading video background...
                </div>
                {videoState.retryCount > 0 && (
                  <div className="text-white/70 text-sm">
                    Attempt {videoState.retryCount + 1} of {MAX_RETRIES + 1}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        </div>
      )}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};

export default VideoBackground;
