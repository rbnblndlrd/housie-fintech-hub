
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VideoState {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
  networkState: number;
  readyState: number;
  currentSrc: string;
}

const VideoBackground = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    isLoading: true,
    hasError: false,
    retryCount: 0,
    networkState: 0,
    readyState: 0,
    currentSrc: ''
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff
  const LOADING_TIMEOUT = 10000; // 10 seconds max loading time

  // Video sources in order of preference
  const videoSources = [
    { src: '/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4', type: 'video/mp4' }
  ];

  const resetVideoState = useCallback(() => {
    setVideoState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false,
      networkState: 0,
      readyState: 0
    }));
  }, []);

  const handleVideoError = useCallback((error: any, context: string) => {
    const video = videoRef.current;
    if (!video) return;

    const errorInfo = {
      context,
      error: error?.message || 'Unknown error',
      networkState: video.networkState,
      readyState: video.readyState,
      currentSrc: video.currentSrc,
      error_code: video.error?.code,
      error_message: video.error?.message,
      retryCount: videoState.retryCount
    };
    
    console.error('VideoBackground: Detailed error info:', errorInfo);

    // Network state meanings:
    // 0 = NETWORK_EMPTY, 1 = NETWORK_IDLE, 2 = NETWORK_LOADING, 3 = NETWORK_NO_SOURCE
    if (video.networkState === 3) {
      console.error('VideoBackground: Video source not found or network error');
    }

    // Ready state meanings:
    // 0 = HAVE_NOTHING, 1 = HAVE_METADATA, 2 = HAVE_CURRENT_DATA, 3 = HAVE_FUTURE_DATA, 4 = HAVE_ENOUGH_DATA
    if (video.readyState === 0) {
      console.error('VideoBackground: Video has no data');
    }

    setVideoState(prev => ({
      ...prev,
      hasError: true,
      isLoading: false,
      networkState: video.networkState,
      readyState: video.readyState,
      currentSrc: video.currentSrc
    }));
  }, [videoState.retryCount]);

  const attemptVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log(`VideoBackground: Attempting to load video (attempt ${videoState.retryCount + 1}/${MAX_RETRIES + 1})`);
    
    resetVideoState();
    
    // Clear existing source and reload
    video.src = '';
    video.load();
    
    // Set new source
    video.src = videoSources[0].src;
    video.load();

    // Set loading timeout
    const loadingTimeout = setTimeout(() => {
      console.error('VideoBackground: Loading timeout exceeded');
      handleVideoError(new Error('Loading timeout'), 'timeout');
    }, LOADING_TIMEOUT);

    const clearLoadingTimeout = () => {
      clearTimeout(loadingTimeout);
    };

    // Success handler
    const handleSuccess = () => {
      console.log('VideoBackground: Video loaded successfully');
      clearLoadingTimeout();
      setVideoState(prev => ({
        ...prev,
        isLoading: false,
        hasError: false,
        networkState: video.networkState,
        readyState: video.readyState,
        currentSrc: video.currentSrc
      }));
    };

    // Error handler with retry logic
    const handleError = (e: Event) => {
      clearLoadingTimeout();
      
      if (videoState.retryCount < MAX_RETRIES) {
        const nextRetryCount = videoState.retryCount + 1;
        const delay = RETRY_DELAYS[nextRetryCount - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        
        console.log(`VideoBackground: Retrying in ${delay}ms (attempt ${nextRetryCount}/${MAX_RETRIES})`);
        
        setVideoState(prev => ({ ...prev, retryCount: nextRetryCount }));
        
        retryTimeoutRef.current = setTimeout(() => {
          attemptVideoLoad();
        }, delay);
      } else {
        console.error('VideoBackground: Max retries exceeded, giving up');
        handleVideoError(e, 'max_retries_exceeded');
      }
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleSuccess);
    video.addEventListener('canplay', handleSuccess);
    video.addEventListener('canplaythrough', handleSuccess);
    video.addEventListener('error', handleError);
    video.addEventListener('abort', handleError);
    video.addEventListener('stalled', handleError);

    // Cleanup function
    return () => {
      clearLoadingTimeout();
      video.removeEventListener('loadeddata', handleSuccess);
      video.removeEventListener('canplay', handleSuccess);
      video.removeEventListener('canplaythrough', handleSuccess);
      video.removeEventListener('error', handleError);
      video.removeEventListener('abort', handleError);
      video.removeEventListener('stalled', handleError);
    };
  }, [videoState.retryCount, resetVideoState, handleVideoError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoBackground: Initializing video component');

    // Check if video file exists first
    const checkVideoExists = async () => {
      try {
        const response = await fetch(videoSources[0].src, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Video file not found: ${response.status} ${response.statusText}`);
        }
        console.log('VideoBackground: Video file exists, proceeding with load');
        attemptVideoLoad();
      } catch (error) {
        console.error('VideoBackground: Video file check failed:', error);
        handleVideoError(error, 'file_not_found');
      }
    };

    checkVideoExists();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [attemptVideoLoad, handleVideoError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  console.log('VideoBackground: Current state:', videoState);

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
            style={{ filter: 'brightness(0.8)' }}
          >
            {videoSources.map((source, index) => (
              <source key={index} src={source.src} type={source.type} />
            ))}
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
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-sm opacity-75 mb-2">
              Video background failed to load
            </div>
            <div className="text-white/50 text-xs">
              Retries: {videoState.retryCount}/{MAX_RETRIES} | 
              Network: {videoState.networkState} | 
              Ready: {videoState.readyState}
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

export default VideoBackground;
