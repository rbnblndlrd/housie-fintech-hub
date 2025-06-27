
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/home/HeroSection';
import { UserTypeSelector } from '@/components/home/UserTypeSelector';
import DemoSection from '@/components/home/DemoSection';
import { PricingSection } from '@/components/PricingSection';
import { useState } from 'react';

const Index = () => {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      {/* User Type Selection */}
      <UserTypeSelector 
        onUserTypeSelect={handleUserTypeSelect}
        selectedUserType={selectedUserType}
      />
      
      {/* Demo Section */}
      <div id="demo-section">
        <DemoSection />
      </div>

      {/* Pricing Section */}
      <div id="pricing-section">
        <PricingSection />
      </div>
    </div>
  );
};

export default Index;
