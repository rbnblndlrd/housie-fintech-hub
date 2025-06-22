
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Header from "../components/Header";
import OverviewSection from "../components/admin/OverviewSection";
import LiveUsersSection from "../components/admin/LiveUsersSection";
import UserManagementSection from "../components/admin/UserManagementSection";
import BookingAnalyticsSection from "../components/admin/BookingAnalyticsSection";
import FraudDetectionSection from "../components/admin/FraudDetectionSection";
import EmergencyControlsSection from "../components/admin/EmergencyControlsSection";
import PlatformHealthSection from "../components/admin/PlatformHealthSection";
import FinancialInsightsSection from "../components/admin/FinancialInsightsSection";
import CreditAnalyticsSection from "../components/admin/CreditAnalyticsSection";
import DevelopmentToolsSection from "../components/admin/DevelopmentToolsSection";
import FraudMegaMenu from "../components/admin/FraudMegaMenu";

declare global {
  interface Window {
    electronAPI?: {
      getAppVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;
      isElectron: boolean;
    };
  }
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [appInfo, setAppInfo] = useState<{ version: string; platform: string } | null>(null);

  // For desktop app, we'll assume admin access
  const isAdmin = true;

  useEffect(() => {
    const loadAppInfo = async () => {
      if (window.electronAPI) {
        try {
          const [version, platform] = await Promise.all([
            window.electronAPI.getAppVersion(),
            window.electronAPI.getPlatform()
          ]);
          setAppInfo({ version, platform });
        } catch (error) {
          console.error('Failed to load app info:', error);
        }
      }
    };

    loadAppInfo();
  }, []);

  if (authLoading) {
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
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
                <p className="text-muted-foreground">
                  You don't have administrator privileges to access this desktop application.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Desktop application for comprehensive platform management
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Desktop App</Badge>
              {appInfo && (
                <>
                  <Badge variant="outline">v{appInfo.version}</Badge>
                  <Badge variant="outline">{appInfo.platform}</Badge>
                </>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Controls</TabsTrigger>
            <TabsTrigger value="dev-tools">Development Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OverviewSection />
              <FraudMegaMenu />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveUsersSection />
              <UserManagementSection />
            </div>
            <PlatformHealthSection />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookingAnalyticsSection />
              <FinancialInsightsSection />
            </div>
            <CreditAnalyticsSection />
            <FraudDetectionSection />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <EmergencyControlsSection />
          </TabsContent>

          <TabsContent value="dev-tools" className="space-y-6">
            <DevelopmentToolsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
