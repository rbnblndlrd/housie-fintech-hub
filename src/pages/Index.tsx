
import React from 'react';
import Header from '@/components/Header';
import FallHeroSection from '@/components/home/FallHeroSection';
import OnboardingCards from '@/components/home/OnboardingCards';
import { PricingSection } from '@/components/PricingSection';
import HousieFooter from '@/components/home/HousieFooter';
import { CreateJobTicketButton } from '@/components/ui/CreateJobTicketButton';
import { AnnetteIntegration } from '@/components/assistant/AnnetteIntegration';

const Index = () => {
  console.log('🏠 Index page rendering with fall hero section...');

  return (
    <>
      {/* Header */}
      <Header />
      
      {/* Fall Hero Section */}
      <FallHeroSection />
      
      {/* Main Content */}
      <div className="relative z-10 w-full">
        {/* Create Job Ticket Button for logged in users */}
        <div className="flex justify-center mb-8 pt-8">
          <CreateJobTicketButton size="lg" />
        </div>
        
        {/* Onboarding Cards Section */}
        <OnboardingCards />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Footer */}
        <HousieFooter />
      </div>
      
      {/* Annette Assistant */}
      <AnnetteIntegration />
    </>
  );
};

export default Index;
