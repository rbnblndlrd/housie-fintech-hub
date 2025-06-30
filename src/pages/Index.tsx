
import React from 'react';
import HeroSearchSection from '@/components/home/HeroSearchSection';
import OnboardingCards from '@/components/home/OnboardingCards';
import { PricingSection } from '@/components/PricingSection';
import HousieFooter from '@/components/home/HousieFooter';
import VideoBackground from '@/components/common/VideoBackground';

const Index = () => {
  console.log('🏠 Index page rendering with video background...');

  return (
    <>
      {/* Video Background */}
      <VideoBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full">
        {/* Hero Search Section */}
        <HeroSearchSection />
        
        {/* Onboarding Cards Section */}
        <OnboardingCards />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Footer */}
        <HousieFooter />
      </div>
    </>
  );
};

export default Index;
