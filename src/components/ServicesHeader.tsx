
import React from 'react';

const ServicesHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Find Home Services
      </h1>
      <p className="text-xl text-gray-800 dark:text-gray-700 max-w-2xl mx-auto">
        Connect with verified professionals in your area
      </p>
    </div>
  );
};

export default ServicesHeader;
