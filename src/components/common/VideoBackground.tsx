
import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        style={{ filter: 'brightness(0.8)' }}
      >
        <source src="/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
        {/* Fallback background */}
        <div className="w-full h-full bg-gradient-to-br from-orange-300 via-amber-400 to-red-400"></div>
      </video>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

export default VideoBackground;
