
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/home/HeroSection';
import ServiceCategories from '@/components/ServiceCategories';
import FeaturedProviders from '@/components/FeaturedProviders';
import DemoSection from '@/components/home/DemoSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServiceCategories onCategorySelect={() => {}} />
      <FeaturedProviders />
      <DemoSection />
    </div>
  );
};

export default Index;
