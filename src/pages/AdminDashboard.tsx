import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import OverviewSection from "@/components/admin/OverviewSection";
import LiveUsersSection from "@/components/admin/LiveUsersSection";
import UserManagementSection from "@/components/admin/UserManagementSection";
import BookingAnalyticsSection from "@/components/admin/BookingAnalyticsSection";
import FraudDetectionSection from "@/components/admin/FraudDetectionSection";
import EmergencyControlsSection from "@/components/admin/EmergencyControlsSection";
import PlatformHealthSection from "@/components/admin/PlatformHealthSection";
import FinancialInsightsSection from "@/components/admin/FinancialInsightsSection";
import CreditAnalyticsSection from "@/components/admin/CreditAnalyticsSection";
import DevelopmentToolsSection from "@/components/admin/DevelopmentToolsSection";
import AdminTestingDashboard from "@/components/admin/AdminTestingDashboard";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Component Error</p>
                <p className="text-sm text-red-500">
                  {this.state.error?.message || 'An error occurred while rendering this section'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [renderError, setRenderError] = useState(null);

  // Updated admin detection logic with explicit email checks and debugging
  const isAdmin = user?.email === '7utile@gmail.com' || 
                  user?.email === 'gabeleven@gmail.com' || 
                  user?.email === 'admin@housie.ca' ||
                  user?.email?.includes('admin');
  
  console.log('Admin check:', { userEmail: user?.email, isAdmin });
  
  const roleLoading = false;

  useEffect(() => {
    // Add error handling for the entire component
    const handleError = (error) => {
      console.error('Admin Dashboard Runtime Error:', error);
      setRenderError(error.message);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    console.log('Access denied for:', user?.email);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
                <p className="text-muted-foreground">
                  You don't have administrator privileges to access this page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">Dashboard Error</h2>
                <p className="text-red-600 mb-4">{renderError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reload Dashboard
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  console.log('✅ Admin Dashboard rendering for:', user?.email);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive platform management and testing
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Admin Access</Badge>
              <Badge variant="outline">Community Rating System</Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="dev-tools">Dev Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary>
                <OverviewSection />
              </ErrorBoundary>
              <ErrorBoundary>
                <LiveUsersSection />
              </ErrorBoundary>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary>
                <UserManagementSection />
              </ErrorBoundary>
              <ErrorBoundary>
                <PlatformHealthSection />
              </ErrorBoundary>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <ErrorBoundary>
              <AdminTestingDashboard />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary>
                <BookingAnalyticsSection />
              </ErrorBoundary>
              <ErrorBoundary>
                <FinancialInsightsSection />
              </ErrorBoundary>
            </div>
            <ErrorBoundary>
              <CreditAnalyticsSection />
            </ErrorBoundary>
            <ErrorBoundary>
              <FraudDetectionSection />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <ErrorBoundary>
              <EmergencyControlsSection />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="dev-tools" className="space-y-6">
            <ErrorBoundary>
              <DevelopmentToolsSection />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
