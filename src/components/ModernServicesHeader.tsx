
import React from 'react';
import { AnnetteButton } from '@/components/chat/AnnetteButton';

const ModernServicesHeader = () => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Where do you need help?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Find trusted professionals in your area. Book instantly with verified providers.
          </p>
        </div>
        <AnnetteButton
          onClick={() => {}} // ChatBubble will handle this
          variant="embedded"
        />
      </div>
    </div>
  );
};

export default ModernServicesHeader;
