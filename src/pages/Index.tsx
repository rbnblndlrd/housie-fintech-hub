
import React from 'react';
import UberEatsHeader from '@/components/home/UberEatsHeader';
import OnboardingCards from '@/components/home/OnboardingCards';
import { PricingSection } from '@/components/PricingSection';
import HousieFooter from '@/components/home/HousieFooter';

const Index = () => {
  console.log('🏠 Index page rendering with UberEats-style layout...');

  return (
    <div className="min-h-screen w-full">
      {/* UberEats Style Header with Hero */}
      <UberEatsHeader />
      
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
