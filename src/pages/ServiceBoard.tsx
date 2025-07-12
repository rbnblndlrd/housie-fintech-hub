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

  // Only show for customers - redirect providers to their dashboard
  if (currentRole !== 'customer') {
    console.log('🔄 ServiceBoard: Non-customer role detected, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Fall Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'blur(1px)' }}
        >
          <source src="/lovable-uploads/automne_gif.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-800/15 to-red-900/10 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="video-text-overlay inline-block">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Service Board</h1>
              <p className="text-sm md:text-base opacity-90">Manage your service requests, track spending, and discover trusted providers</p>
            </div>
          </div>

          {/* Mobile Stack Layout */}
          <div className="block lg:hidden space-y-4">
            <AnnetteCustomerInsights />
            <CustomerJobTicketList />
            <SpendingSummaryChart />
            <CustomerPrestigePanel />
            <RebookingSuggestionPanel />
            <SmartVerificationReview />
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden lg:block space-y-6">
            <AnnetteCustomerInsights />
            
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

            <SmartVerificationReview />
          </div>
        </div>
      </div>
      
      {/* Mobile FAB for Create Ticket */}
      <div className="lg:hidden fixed bottom-6 right-6 z-20">
        <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <ChatBubble />
    </div>
  );
};

export default ServiceBoard;