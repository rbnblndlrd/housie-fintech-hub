
import React from 'react';
import HeroSearchSection from '@/components/home/HeroSearchSection';
import OnboardingCards from '@/components/home/OnboardingCards';
import { PricingSection } from '@/components/PricingSection';
import HousieFooter from '@/components/home/HousieFooter';

const Index = () => {
  console.log('🏠 Index page rendering with HousieEats header and video background...');

  return (
    <div className="min-h-screen w-full">
      {/* Hero Search Section with Video Background */}
      <HeroSearchSection />
      
      {/* Onboarding Cards Section */}
      <OnboardingCards />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Footer */}
      <HousieFooter />
    </div>
  );
};

export default Index;
