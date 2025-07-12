import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate } from 'react-router-dom';
import { ChatBubble } from '@/components/chat/ChatBubble';
import CustomerJobTicketList from '@/components/dashboard/customer/CustomerJobTicketList';
import SpendingSummaryChart from '@/components/dashboard/customer/SpendingSummaryChart';
import RebookingSuggestionPanel from '@/components/dashboard/customer/RebookingSuggestionPanel';
import CustomerPrestigePanel from '@/components/dashboard/customer/CustomerPrestigePanel';
import SmartVerificationReview from '@/components/dashboard/customer/SmartVerificationReview';
import AnnetteCustomerInsights from '@/components/dashboard/customer/AnnetteCustomerInsights';

const ServiceBoard = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentRole, isLoading } = useRoleSwitch();

  // Redirect to auth if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading while auth or role context is loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service board...</p>
        </div>
      </div>
    );
  }

  // Only show for customers
  if (currentRole !== 'customer') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Board</h1>
          <p className="text-gray-600">Manage your service requests, track spending, and discover trusted providers</p>
        </div>

        {/* Annette Insights */}
        <AnnetteCustomerInsights />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Tickets and Spending */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerJobTicketList />
            <SpendingSummaryChart />
          </div>

          {/* Right Column - Prestige and Rebooking */}
          <div className="space-y-6">
            <CustomerPrestigePanel />
            <RebookingSuggestionPanel />
          </div>
        </div>

        {/* Verification Review */}
        <SmartVerificationReview />
      </div>
      
      <ChatBubble />
    </div>
  );
};

export default ServiceBoard;