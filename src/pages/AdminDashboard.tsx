
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import Header from '@/components/Header';
import OverviewSection from '@/components/admin/OverviewSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import BookingAnalyticsSection from '@/components/admin/BookingAnalyticsSection';
import PlatformHealthSection from '@/components/admin/PlatformHealthSection';
import LiveUsersSection from '@/components/admin/LiveUsersSection';
import EmergencyControlsSection from '@/components/admin/EmergencyControlsSection';
import DevelopmentToolsSection from '@/components/admin/DevelopmentToolsSection';
import FraudDetectionSection from '@/components/admin/FraudDetectionSection';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { isAdmin, checkingAdmin } = useAdminStatus();

  // Show loading while checking admin status
  if (loading || checkingAdmin) {
    console.log('🔄 AdminDashboard: Showing loading state', { loading, checkingAdmin });
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="text-lg mb-4">Checking admin permissions...</div>
            {user && (
              <div className="text-xs text-gray-500 mt-2">
                User: {user.email} (ID: {user.id})
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Check if user is admin
  if (!user || !isAdmin) {
    console.log('🚫 AdminDashboard: Access denied, redirecting to home', {
      hasUser: !!user,
      isAdmin,
      userEmail: user?.email
    });
    return <Navigate to="/" replace />;
  }

  console.log('🎯 AdminDashboard: Rendering admin dashboard for user:', user.email);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6 pt-20">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Platform management and analytics</p>
            <div className="text-xs text-gray-500 mt-2">
              Logged in as: {user.email}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="fraud">Fraud</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="live">Live Users</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="dev">Dev Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewSection />
            </TabsContent>

            <TabsContent value="users">
              <UserManagementSection />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingAnalyticsSection />
            </TabsContent>

            <TabsContent value="fraud">
              <FraudDetectionSection />
            </TabsContent>

            <TabsContent value="health">
              <PlatformHealthSection />
            </TabsContent>

            <TabsContent value="live">
              <LiveUsersSection />
            </TabsContent>

            <TabsContent value="emergency">
              <EmergencyControlsSection />
            </TabsContent>

            <TabsContent value="dev">
              <DevelopmentToolsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
