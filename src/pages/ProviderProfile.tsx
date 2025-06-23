
import React from 'react';
import Header from '@/components/Header';
import ProviderProfileHeader from '@/components/ProviderProfileHeader';
import ProviderProfileNavigation from '@/components/ProviderProfileNavigation';
import { useAuth } from '@/contexts/AuthContext';

const ProviderProfile = () => {
  const { user } = useAuth();

  // Mock provider data for now - this would typically come from API/database
  const mockProvider = {
    business_name: 'Professional Services',
    user: {
      full_name: user?.user_metadata?.full_name || 'Professional Provider',
      city: 'Montreal',
      province: 'QC'
    },
    verified: true,
    verification_level: 'background_check',
    average_rating: 4.8,
    total_bookings: 150,
    hourly_rate: 45,
    service_radius_km: 25,
    description: 'Experienced professional providing quality services in the Montreal area.'
  };

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

          <ProviderProfileNavigation providerName={mockProvider.business_name} />
          <ProviderProfileHeader provider={mockProvider} />
        </div>
      </div>
    </>
  );
};

export default ProviderProfile;
