
import React, { useState, useRef, useEffect } from 'react';

interface VideoState {
  isLoading: boolean;
  hasError: boolean;
}

const VideoBackground = () => {
  const [videoState, setVideoState] = useState<VideoState>({
    isLoading: true,
    hasError: false
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryCountRef = useRef(0);
  const loadAttemptedRef = useRef(false);
  
  const MAX_RETRIES = 2;

  useEffect(() => {
    if (loadAttemptedRef.current) return;
    loadAttemptedRef.current = true;

    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 VideoBackground: Starting video load attempt');
    
    const handleSuccess = () => {
      console.log('🎬 VideoBackground: Video loaded successfully!');
      setVideoState({
        isLoading: false,
        hasError: false
      });
    };

    const handleError = () => {
      console.error('🎬 VideoBackground: Video failed to load');
      
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        console.log(`🎬 VideoBackground: Retrying (attempt ${retryCountRef.current + 1})`);
        
        setTimeout(() => {
          if (video) {
            video.load();
          }
        }, 1000);
      } else {
        console.error('🎬 VideoBackground: Max retries exceeded, using fallback');
        setVideoState({
          isLoading: false,
          hasError: true
        });
      }
    };

    // Set up event listeners
    video.addEventListener('loadeddata', handleSuccess, { once: true });
    video.addEventListener('canplaythrough', handleSuccess, { once: true });
    video.addEventListener('error', handleError);

    // Start loading
    console.log('🎬 VideoBackground: Setting video source');
    video.src = '/lovable-uploads/automne_gif.mp4';
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleSuccess);
      video.removeEventListener('canplaythrough', handleSuccess);
      video.removeEventListener('error', handleError);
    };
  }, []);

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
              filter: 'brightness(0.6)',
            }}
          >
            <source src="/lovable-uploads/automne_gif.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {videoState.isLoading && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-900 via-red-900 to-yellow-800 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-white text-lg font-medium mb-2">
                  Loading video background...
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-900 via-red-900 to-yellow-800">
          <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-amber-800/40 to-orange-900/40"></div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white/70 text-sm">Beautiful autumn backdrop</div>
          </div>
        </div>
      )}
      
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 z-5"></div>
    </div>
  );
};

export default VideoBackground;
