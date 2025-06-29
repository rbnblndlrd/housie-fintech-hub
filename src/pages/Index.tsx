import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/home/HeroSection';
import { UserTypeSelector } from '@/components/home/UserTypeSelector';
import DemoSection from '@/components/home/DemoSection';
import { PricingSection } from '@/components/PricingSection';
import { useState } from 'react';

const Index = () => {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  console.log('🏠 Index page rendering...');

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with extended background for seamless transition */}
      <ErrorBoundary fallback={<div className="py-20 text-center text-white">Hero section temporarily unavailable</div>}>
        <div className="relative">
          <HeroSection />
          {/* Seamless gradient extension from hero to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
        </div>
      </ErrorBoundary>
      
      {/* User Type Selector - clean positioning */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">User selection loading...</div>}>
        <UserTypeSelector 
          onUserTypeSelect={handleUserTypeSelect}
          selectedUserType={selectedUserType}
        />
      </ErrorBoundary>
      
      {/* Demo Section - seamless background flow */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Demo section loading...</div>}>
        <DemoSection />
      </ErrorBoundary>

      {/* Pricing Section - seamless background flow */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Pricing section loading...</div>}>
        <div id="pricing-section">
          <PricingSection />
        </div>
      </ErrorBoundary>
    </div>
  );
};

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode }, 
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.warn('⚠️ Index page component error caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('⚠️ Index page error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default Index;
