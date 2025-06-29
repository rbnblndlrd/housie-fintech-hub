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
      
      {/* Hero Section with seamless gradient background */}
      <ErrorBoundary fallback={<div className="py-20 text-center text-white">Hero section temporarily unavailable</div>}>
        <HeroSection />
      </ErrorBoundary>
      
      {/* User Type Selector - perfectly blended gradient continuation */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">User selection loading...</div>}>
        <UserTypeSelector 
          onUserTypeSelect={handleUserTypeSelect}
          selectedUserType={selectedUserType}
        />
      </ErrorBoundary>
      
      {/* Demo Section - continuing the gradient flow */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Demo section loading...</div>}>
        <div className="bg-gradient-to-b from-slate-500/15 to-transparent">
          <DemoSection />
        </div>
      </ErrorBoundary>

      {/* Pricing Section - final gradient fade */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Pricing section loading...</div>}>
        <div id="pricing-section" className="bg-gradient-to-b from-transparent to-slate-100/50">
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
