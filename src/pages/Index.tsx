
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/home/HeroSection';
import { UserTypeSelector } from '@/components/home/UserTypeSelector';
import DemoSection from '@/components/home/DemoSection';
import { PricingSection } from '@/components/PricingSection';
import { useState } from 'react';

const Index = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>('customer'); // Default to customer for launch

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      {/* Simplified Hero Section focused on customers */}
      <ErrorBoundary fallback={<div className="py-20 text-center text-white">Loading your trusted service platform...</div>}>
        <UserTypeSelector 
          onUserTypeSelect={handleUserTypeSelect}
          selectedUserType={selectedUserType}
        />
      </ErrorBoundary>
      
      {/* Demo Section with customer focus */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Demo section loading...</div>}>
        <DemoSection />
      </ErrorBoundary>

      {/* Simplified Pricing Section */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Pricing information loading...</div>}>
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
    console.warn('Component error caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Error boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default Index;
