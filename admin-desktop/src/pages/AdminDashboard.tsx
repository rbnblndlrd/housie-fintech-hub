
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
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

        <div className="space-y-8">
          <OverviewSection />
          <LiveUsersSection />
          <UserManagementSection />
          <BookingAnalyticsSection />
          <FraudDetectionSection />
          <EmergencyControlsSection />
          <PlatformHealthSection />
          <FinancialInsightsSection />
          <CreditAnalyticsSection />
          <DevelopmentToolsSection />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
