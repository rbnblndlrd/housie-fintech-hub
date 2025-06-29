
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
      
      {/* Hero Section - seamless background flow */}
      <ErrorBoundary fallback={<div className="py-20 text-center text-white">Hero section temporarily unavailable</div>}>
        <HeroSection />
      </ErrorBoundary>
      
      {/* Enhanced Gradient Transition - longer and smoother */}
      <div className="h-48 bg-gradient-to-b from-transparent via-black/5 to-black/15 -mt-32 relative z-10"></div>
      
      {/* User Type Selector - seamless background flow */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">User selection loading...</div>}>
        <div className="-mt-32 relative z-20">
          <UserTypeSelector 
            onUserTypeSelect={handleUserTypeSelect}
            selectedUserType={selectedUserType}
          />
        </div>
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
