
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import ModernServicesHeader from '@/components/ModernServicesHeader';
import ModernServiceFilters from '@/components/ModernServiceFilters';
import ModernServicesGrid from '@/components/ModernServicesGrid';

const ServicesPage = () => {
  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <ModernServicesHeader />
            <ModernServiceFilters />
            <ModernServicesGrid />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
