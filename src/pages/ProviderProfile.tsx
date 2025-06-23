
import React from 'react';
import Header from '@/components/Header';
import ProviderProfileHeader from '@/components/ProviderProfileHeader';
import ProviderProfileNavigation from '@/components/ProviderProfileNavigation';
import { useAuth } from '@/contexts/AuthContext';

const ProviderProfile = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Consistent Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Provider Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your business information and services
            </p>
          </div>

          <ProviderProfileHeader />
          <ProviderProfileNavigation />
        </div>
      </div>
    </>
  );
};

export default ProviderProfile;
