
import React from 'react';
import HeroSearchSection from '@/components/home/HeroSearchSection';
import VideoBackground from '@/components/common/VideoBackground';

const Home = () => {
  console.log('🏠 Home page rendering with clean search layout and video background...');

  return (
    <>
      {/* Video Background */}
      <VideoBackground />
      
      {/* Main Content - Just the search section */}
      <div className="relative z-10 min-h-screen w-full">
        <HeroSearchSection />
      </div>
    </>
  );
};

export default Home;
