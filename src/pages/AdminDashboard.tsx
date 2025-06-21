
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import OverviewSection from '@/components/admin/OverviewSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import BookingAnalyticsSection from '@/components/admin/BookingAnalyticsSection';
import PlatformHealthSection from '@/components/admin/PlatformHealthSection';
import LiveUsersSection from '@/components/admin/LiveUsersSection';
import EmergencyControlsSection from '@/components/admin/EmergencyControlsSection';
import DevelopmentToolsSection from '@/components/admin/DevelopmentToolsSection';
import FraudDetectionSection from '@/components/admin/FraudDetectionSection';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || user.subscription_tier !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Platform management and analytics</p>
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
  );
};

export default AdminDashboard;
