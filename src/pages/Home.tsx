
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VideoBackground from '@/components/common/VideoBackground';

const Home = () => {
  console.log('🏠 Home page rendering with fall hero section and video background...');

  return (
    <>
      {/* Video Background - Autumn falling leaves */}
      <VideoBackground />
      
      {/* Hero Section Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Content Container */}
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subheading */}
          <p className="text-orange-200/90 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mb-4 md:mb-6 drop-shadow-lg">
            Home's never been easier.
          </p>
          
          {/* Main Heading */}
          <h1 className="text-white font-bold mb-4 md:mb-6">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight drop-shadow-2xl">
              Welcome to
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight text-orange-400 drop-shadow-2xl">
              HOUSIE
            </span>
          </h1>
          
          {/* Tagline */}
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Your trusted home services platform
          </p>
          
          {/* Call to Action Button */}
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <Link to="/auth" onClick={(e) => {
              console.log('🔗 Link clicked, navigating to /auth');
              // Let the default Link behavior handle navigation
            }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border-2 border-orange-400/20"
                onClick={() => console.log('🔘 Button clicked')}
              >
                Sign In to Join the Network
              </Button>
            </Link>
            
            {/* Helper Text */}
            <Link 
              to="/welcome" 
              className="text-orange-200/80 hover:text-orange-100 text-sm md:text-base font-light underline decoration-dotted underline-offset-4 hover:underline-offset-2 transition-all duration-200 drop-shadow"
            >
              New here? Learn how HOUSIE works →
            </Link>
          </div>
        </div>
        
        {/* Additional Gradient Overlays for Polish */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      </div>
    </>
  );
};

export default Home;
