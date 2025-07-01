
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VideoState {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
}

const ContainedVideoBackground = () => {
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

    console.log(`ContainedVideoBackground: Loading attempt ${videoState.retryCount + 1}`);
    
    setVideoState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false
    }));

    const handleSuccess = () => {
      console.log('ContainedVideoBackground: Video loaded successfully');
      setVideoState(prev => ({
        ...prev,
        isLoading: false,
        hasError: false
      }));
    };

    const handleError = () => {
      console.error('ContainedVideoBackground: Video failed to load');
      if (videoState.retryCount < MAX_RETRIES) {
        const nextRetryCount = videoState.retryCount + 1;
        console.log(`ContainedVideoBackground: Retrying in ${RETRY_DELAY}ms (attempt ${nextRetryCount})`);
        
        setVideoState(prev => ({ ...prev, retryCount: nextRetryCount }));
        
        retryTimeoutRef.current = setTimeout(() => {
          attemptVideoLoad();
        }, RETRY_DELAY);
      } else {
        console.error('ContainedVideoBackground: Max retries exceeded');
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

    // Load the video - try both paths
    video.src = '/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4';
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
    <div className="absolute inset-0 w-full h-full overflow-hidden">
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
            <source src="/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
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
    </div>
  );
};

export default ContainedVideoBackground;
