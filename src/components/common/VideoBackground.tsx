
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

    console.log(`🎬 VideoBackground: Loading attempt ${videoState.retryCount + 1} - using /lovable-uploads/automne_gif.mp4`);
    
    setVideoState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false
    }));

    const handleSuccess = () => {
      console.log('🎬 VideoBackground: Video loaded successfully!');
      setVideoState(prev => ({
        ...prev,
        isLoading: false,
        hasError: false
      }));
    };

    const handleError = (e: Event) => {
      console.error('🎬 VideoBackground: Video failed to load:', e);
      if (videoState.retryCount < MAX_RETRIES) {
        const nextRetryCount = videoState.retryCount + 1;
        console.log(`🎬 VideoBackground: Retrying in ${RETRY_DELAY}ms (attempt ${nextRetryCount})`);
        
        setVideoState(prev => ({ ...prev, retryCount: nextRetryCount }));
        
        retryTimeoutRef.current = setTimeout(() => {
          attemptVideoLoad();
        }, RETRY_DELAY);
      } else {
        console.error('🎬 VideoBackground: Max retries exceeded, using fallback');
        setVideoState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true
        }));
      }
    };

    // Clear previous event listeners
    video.removeEventListener('loadeddata', handleSuccess);
    video.removeEventListener('canplay', handleSuccess);
    video.removeEventListener('error', handleError);

    // Set up new event listeners
    video.addEventListener('loadeddata', handleSuccess, { once: true });
    video.addEventListener('canplay', handleSuccess, { once: true });
    video.addEventListener('error', handleError, { once: true });

    // Load the video
    video.src = '/lovable-uploads/automne_gif.mp4';
    video.load();
  }, [videoState.retryCount]);

  useEffect(() => {
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
            style={{ 
              filter: 'brightness(0.7)',
              zIndex: 1
            }}
          >
            <source src="/lovable-uploads/automne_gif.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {videoState.isLoading && (
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center z-10">
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
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/70 text-sm">Video background unavailable</div>
          </div>
        </div>
      )}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 z-20"></div>
    </div>
  );
};

export default VideoBackground;
