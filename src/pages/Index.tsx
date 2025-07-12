
import React from 'react';
import Header from '@/components/Header';
import HeroSearchSection from '@/components/home/HeroSearchSection';
import OnboardingCards from '@/components/home/OnboardingCards';
import { PricingSection } from '@/components/PricingSection';
import HousieFooter from '@/components/home/HousieFooter';
import VideoBackground from '@/components/common/VideoBackground';
import { CreateJobTicketButton } from '@/components/ui/CreateJobTicketButton';

const Index = () => {
  console.log('🏠 Index page rendering with video background...');

  return (
    <>
      {/* Video Background */}
      <VideoBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full">
        {/* Hero Search Section */}
        <HeroSearchSection />
        
        {/* Create Job Ticket Button for logged in users */}
        <div className="flex justify-center mb-8">
          <CreateJobTicketButton size="lg" />
        </div>
        
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
