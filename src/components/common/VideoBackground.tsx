
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
  const loadAttemptedRef = useRef(false);
  
  useEffect(() => {
    if (loadAttemptedRef.current) return;
    loadAttemptedRef.current = true;

    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 VideoBackground: Loading video from correct path');
    
    const handleSuccess = () => {
      console.log('🎬 VideoBackground: Video loaded successfully!');
      setVideoState({
        isLoading: false,
        hasError: false
      });
    };

    const handleError = (e: Event) => {
      console.log('🎬 VideoBackground: Video failed to load, using fallback background', e);
      setVideoState({
        isLoading: false,
        hasError: true
      });
    };

    const handleLoadStart = () => {
      console.log('🎬 VideoBackground: Video load started');
      setVideoState(prev => ({ ...prev, isLoading: true }));
    };

    // Set up event listeners
    video.addEventListener('loadeddata', handleSuccess, { once: true });
    video.addEventListener('canplaythrough', handleSuccess, { once: true });
    video.addEventListener('error', handleError, { once: true });
    video.addEventListener('loadstart', handleLoadStart, { once: true });

    // Try multiple video sources
    const videoSources = [
      '/lovable-uploads/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4',
      '/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4'
    ];

    let currentSourceIndex = 0;
    
    const loadNextSource = () => {
      if (currentSourceIndex < videoSources.length) {
        console.log('🎬 VideoBackground: Trying source:', videoSources[currentSourceIndex]);
        video.src = videoSources[currentSourceIndex];
        video.load();
        currentSourceIndex++;
      } else {
        console.log('🎬 VideoBackground: All sources failed, using fallback');
        handleError(new Event('error'));
      }
    };

    // Start loading the first source
    loadNextSource();

    // If first source fails, try the next one
    const handleSourceError = () => {
      loadNextSource();
    };

    video.addEventListener('error', handleSourceError);

    return () => {
      video.removeEventListener('loadeddata', handleSuccess);
      video.removeEventListener('canplaythrough', handleSuccess);
      video.removeEventListener('error', handleError);
      video.removeEventListener('error', handleSourceError);
      video.removeEventListener('loadstart', handleLoadStart);
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
            <source src="/lovable-uploads/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
            <source src="/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {videoState.isLoading && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-900 via-red-900 to-yellow-800 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <div className="text-white text-lg font-medium">
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
