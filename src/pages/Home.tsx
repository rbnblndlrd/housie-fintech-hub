
import React from 'react';
import HeroSearchSection from '@/components/home/HeroSearchSection';
import VideoBackground from '@/components/common/VideoBackground';
import ExitArrows from '@/components/home/ExitArrows';

const Home = () => {
  console.log('🏠 Home page rendering with clean search layout and video background...');

  return (
    <>
      {/* Video Background */}
      <VideoBackground />
      
      {/* Main Content - Adjusted for header spacing */}
      <div className="relative z-10 min-h-screen w-full pt-0">
        <HeroSearchSection />
        <ExitArrows />
      </div>
    </>
  );
};

export default Home;
