import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import OverviewSection from '@/components/admin/OverviewSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import BookingAnalyticsSection from '@/components/admin/BookingAnalyticsSection';
import PlatformHealthSection from '@/components/admin/PlatformHealthSection';
import LiveUsersSection from '@/components/admin/LiveUsersSection';
import EmergencyControlsSection from '@/components/admin/EmergencyControlsSection';
import DevelopmentToolsSection from '@/components/admin/DevelopmentToolsSection';
import FraudDetectionSection from '@/components/admin/FraudDetectionSection';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('🔍 AdminDashboard: Starting admin status check', {
        user: !!user,
        userId: user?.id,
        userEmail: user?.email,
        loading,
        attempt: checkAttempts + 1
      });

      // Don't check if auth is still loading or no user
      if (loading) {
        console.log('⏳ AdminDashboard: Auth still loading, skipping check');
        return;
      }

      if (!user) {
        console.log('❌ AdminDashboard: No user found, setting isAdmin to false');
        setIsAdmin(false);
        return;
      }

      try {
        console.log('📡 AdminDashboard: Making database query for user role');
        
        // Check user's role from the users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_role, email, id')
          .eq('id', user.id)
          .single();

        console.log('📊 AdminDashboard: Database query result', {
          userData,
          error,
          hasData: !!userData,
          userRole: userData?.user_role
        });

        if (error) {
          console.error('❌ AdminDashboard: Database error checking admin status:', error);
          setError(`Database error: ${error.message}`);
          
          // Retry up to 3 times for database errors
          if (checkAttempts < 3) {
            console.log('🔄 AdminDashboard: Retrying admin check in 1 second...');
            setTimeout(() => {
              setCheckAttempts(prev => prev + 1);
            }, 1000);
            return;
          }
          
          setIsAdmin(false);
          return;
        }

        const adminStatus = userData?.user_role === 'admin';
        console.log('✅ AdminDashboard: Admin status determined', {
          isAdmin: adminStatus,
          userRole: userData?.user_role,
          userId: userData?.id,
          userEmail: userData?.email
        });

        setIsAdmin(adminStatus);
        setError(null);
        
      } catch (error) {
        console.error('💥 AdminDashboard: Unexpected error checking admin status:', error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, loading, checkAttempts]);

  // Show loading while checking admin status
  if (loading || isAdmin === null) {
    console.log('🔄 AdminDashboard: Showing loading state', { loading, isAdmin });
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="text-lg mb-4">Checking admin permissions...</div>
            {error && (
              <div className="text-red-600 text-sm">
                Error: {error}
                {checkAttempts > 0 && <div>Attempt {checkAttempts + 1}/4</div>}
              </div>
            )}
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 pt-20">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Platform management and analytics</p>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Logged in as: {user.email}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8 bg-white dark:bg-gray-800 border dark:border-gray-700">
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
