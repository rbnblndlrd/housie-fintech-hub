
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VideoState {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
  networkState: number;
  readyState: number;
  currentSrc: string;
  isHardRefresh: boolean;
}

const VideoBackground = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    isLoading: true,
    hasError: false,
    retryCount: 0,
    networkState: 0,
    readyState: 0,
    currentSrc: '',
    isHardRefresh: false
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const MAX_RETRIES = 5; // Increased for hard refresh scenarios
  const RETRY_DELAYS = [500, 1000, 2000, 4000, 8000]; // More aggressive retry timing
  const LOADING_TIMEOUT = 15000; // Longer timeout for hard refresh

  // Video sources in order of preference
  const videoSources = [
    { src: '/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4', type: 'video/mp4' }
  ];

  // Detect hard refresh
  const detectHardRefresh = useCallback(() => {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
      return navigationEntry.type === 'reload';
    }
    return false;
  }, []);

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
      retryCount: videoState.retryCount,
      isHardRefresh: videoState.isHardRefresh
    };
    
    console.error('VideoBackground: Detailed error info:', errorInfo);

    setVideoState(prev => ({
      ...prev,
      hasError: true,
      isLoading: false,
      networkState: video.networkState,
      readyState: video.readyState,
      currentSrc: video.currentSrc
    }));
  }, [videoState.retryCount, videoState.isHardRefresh]);

  const attemptVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHardRefresh = detectHardRefresh();
    const currentRetry = videoState.retryCount;
    
    console.log(`VideoBackground: Attempting to load video (attempt ${currentRetry + 1}/${MAX_RETRIES + 1}) - Hard refresh: ${isHardRefresh}`);
    
    setVideoState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false,
      networkState: 0,
      readyState: 0,
      isHardRefresh
    }));

    // Clear any existing timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // For hard refresh, add a small delay to let the page settle
    const loadDelay = isHardRefresh ? 200 : 0;
    
    setTimeout(() => {
      // Clear existing source and reload
      video.src = '';
      video.load();
      
      // Set new source
      video.src = videoSources[0].src;
      video.preload = 'auto';
      video.load();

      // Set loading timeout (longer for hard refresh)
      const timeout = isHardRefresh ? LOADING_TIMEOUT + 5000 : LOADING_TIMEOUT;
      loadingTimeoutRef.current = setTimeout(() => {
        console.error(`VideoBackground: Loading timeout exceeded (${timeout}ms)`);
        handleVideoError(new Error('Loading timeout'), 'timeout');
      }, timeout);

      const clearLoadingTimeout = () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
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

      // Error handler with enhanced retry logic
      const handleError = (e: Event) => {
        clearLoadingTimeout();
        
        if (currentRetry < MAX_RETRIES) {
          const nextRetryCount = currentRetry + 1;
          const delay = RETRY_DELAYS[nextRetryCount - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
          
          // Add extra delay for hard refresh scenarios
          const finalDelay = isHardRefresh ? delay + 500 : delay;
          
          console.log(`VideoBackground: Retrying in ${finalDelay}ms (attempt ${nextRetryCount}/${MAX_RETRIES}) - Hard refresh: ${isHardRefresh}`);
          
          setVideoState(prev => ({ ...prev, retryCount: nextRetryCount }));
          
          retryTimeoutRef.current = setTimeout(() => {
            attemptVideoLoad();
          }, finalDelay);
        } else {
          console.error('VideoBackground: Max retries exceeded, giving up');
          handleVideoError(e, 'max_retries_exceeded');
        }
      };

      // Add comprehensive event listeners
      video.addEventListener('loadeddata', handleSuccess, { once: true });
      video.addEventListener('canplay', handleSuccess, { once: true });
      video.addEventListener('canplaythrough', handleSuccess, { once: true });
      video.addEventListener('loadedmetadata', handleSuccess, { once: true });
      video.addEventListener('error', handleError, { once: true });
      video.addEventListener('abort', handleError, { once: true });
      video.addEventListener('stalled', handleError, { once: true });

      // Cleanup function
      return () => {
        clearLoadingTimeout();
        video.removeEventListener('loadeddata', handleSuccess);
        video.removeEventListener('canplay', handleSuccess);
        video.removeEventListener('canplaythrough', handleSuccess);
        video.removeEventListener('loadedmetadata', handleSuccess);
        video.removeEventListener('error', handleError);
        video.removeEventListener('abort', handleError);
        video.removeEventListener('stalled', handleError);
      };
    }, loadDelay);
  }, [videoState.retryCount, detectHardRefresh, handleVideoError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoBackground: Initializing video component');

    // Wait for DOM to be fully loaded
    const initializeVideo = () => {
      // Check network connection before attempting load
      if (navigator.onLine === false) {
        console.warn('VideoBackground: No network connection detected');
        setTimeout(initializeVideo, 1000);
        return;
      }

      attemptVideoLoad();
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(initializeVideo, 100);
    });

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [attemptVideoLoad]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
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
                    {videoState.isHardRefresh && <span className="ml-2">(Hard refresh detected)</span>}
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
              {videoState.isHardRefresh && <span className="ml-2">| Hard refresh: Yes</span>}
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
