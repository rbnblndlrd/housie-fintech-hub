
import React from 'react';
import Header from '@/components/Header';
import OverviewSection from '@/components/admin/OverviewSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import BookingAnalyticsSection from '@/components/admin/BookingAnalyticsSection';
import FraudDetectionSection from '@/components/admin/FraudDetectionSection';
import EmergencyControlsSection from '@/components/admin/EmergencyControlsSection';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();

  // Check if user has admin access
  if (!user || currentRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Consistent Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor platform performance and manage users
            </p>
          </div>

          <div className="space-y-8">
            <OverviewSection />
            <UserManagementSection />
            <BookingAnalyticsSection />
            <FraudDetectionSection />
            <EmergencyControlsSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
