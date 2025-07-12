import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import BackNavigation from '@/components/navigation/BackNavigation';
import CustomerJobTicketList from '@/components/dashboard/customer/CustomerJobTicketList';
import SpendingSummaryChart from '@/components/dashboard/customer/SpendingSummaryChart';
import RebookingSuggestionPanel from '@/components/dashboard/customer/RebookingSuggestionPanel';
import CustomerPrestigePanel from '@/components/dashboard/customer/CustomerPrestigePanel';
import SmartVerificationReview from '@/components/dashboard/customer/SmartVerificationReview';
import AnnetteCustomerInsights from '@/components/dashboard/customer/AnnetteCustomerInsights';

const CustomerDashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <BackNavigation />
        
        <div className="pt-16 px-4 md:px-8 pb-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
              My Service Dashboard
            </h1>
            <p className="text-white/90 text-shadow">
              Manage your job tickets, track spending, and grow your prestige
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <CustomerJobTicketList />
              <SpendingSummaryChart />
              <SmartVerificationReview />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <AnnetteCustomerInsights />
              <CustomerPrestigePanel />
              <RebookingSuggestionPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboardPage;