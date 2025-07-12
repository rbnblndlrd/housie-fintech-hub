import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FallHeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fall Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1445965205320-a4635e9c9eaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-orange-900/30 backdrop-blur-[1px]" />
      
      {/* Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subheading */}
        <p className="text-orange-200/90 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mb-4 md:mb-6">
          Home's never been easier.
        </p>
        
        {/* Main Heading */}
        <h1 className="text-white font-bold mb-4 md:mb-6">
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
            Welcome to
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight text-orange-400 drop-shadow-2xl">
            HOUSIE
          </span>
        </h1>
        
        {/* Tagline */}
        <p className="text-white/90 text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
          Your home services launchpad
        </p>
        
        {/* Call to Action Button */}
        <div className="flex flex-col items-center space-y-4 md:space-y-6">
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border-2 border-orange-400/20"
            >
              Sign In to Join the Network
            </Button>
          </Link>
          
          {/* Helper Text */}
          <Link 
            to="/welcome" 
            className="text-orange-200/80 hover:text-orange-100 text-sm md:text-base font-light underline decoration-dotted underline-offset-4 hover:underline-offset-2 transition-all duration-200"
          >
            New here? Learn how HOUSIE works →
          </Link>
        </div>
      </div>
      
      {/* Floating Elements for Extra Polish */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default FallHeroSection;