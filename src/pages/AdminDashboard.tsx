
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';

// Import admin sections
import OverviewSection from '@/components/admin/OverviewSection';
import UserManagementSection from '@/components/admin/UserManagementSection';
import FraudDetectionSection from '@/components/admin/FraudDetectionSection';
import PlatformHealthSection from '@/components/admin/PlatformHealthSection';
import EmergencyControlsSection from '@/components/admin/EmergencyControlsSection';
import DevelopmentToolsSection from '@/components/admin/DevelopmentToolsSection';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-admin-status');
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (data?.isAdmin) {
        setIsAdmin(true);
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">Platform management and analytics</p>
            <p className="text-sm text-gray-500 mt-2">
              Logged in as: {user?.email}
            </p>
          </div>

          {/* Main Content */}
          <Card className="fintech-card">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6 bg-white border border-gray-200">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="users"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="fraud"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                >
                  Fraud
                </TabsTrigger>
                <TabsTrigger 
                  value="health"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                >
                  Health
                </TabsTrigger>
                <TabsTrigger 
                  value="emergency"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Emergency
                </TabsTrigger>
                <TabsTrigger 
                  value="dev"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                >
                  Dev Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <OverviewSection />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <UserManagementSection />
              </TabsContent>

              <TabsContent value="fraud" className="space-y-6">
                <FraudDetectionSection />
              </TabsContent>

              <TabsContent value="health" className="space-y-6">
                <PlatformHealthSection />
              </TabsContent>

              <TabsContent value="emergency" className="space-y-6">
                <EmergencyControlsSection />
              </TabsContent>

              <TabsContent value="dev" className="space-y-6">
                <DevelopmentToolsSection />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
