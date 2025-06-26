
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/home/HeroSection';
import ServiceCategories from '@/components/ServiceCategories';
import FeaturedProviders from '@/components/FeaturedProviders';
import DemoSection from '@/components/home/DemoSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      {/* Hero Section with error boundary */}
      <ErrorBoundary fallback={<div className="py-20 text-center text-white">Hero section temporarily unavailable</div>}>
        <HeroSection />
      </ErrorBoundary>
      
      {/* Service Categories with error boundary */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Service categories loading...</div>}>
        <ServiceCategories onCategorySelect={() => {}} />
      </ErrorBoundary>
      
      {/* Featured Providers with error boundary */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Featured providers loading...</div>}>
        <FeaturedProviders />
      </ErrorBoundary>
      
      {/* Demo Section with error boundary */}
      <ErrorBoundary fallback={<div className="py-12 text-center text-white">Demo section loading...</div>}>
        <DemoSection />
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
