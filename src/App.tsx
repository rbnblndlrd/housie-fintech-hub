import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleSwitchProvider } from '@/contexts/RoleSwitchContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import SubscriptionManagement from '@/pages/SubscriptionManagement';
import UnifiedDashboard from '@/pages/UnifiedDashboard';
import ManagerDashboard from "@/pages/ManagerDashboard";
import KanbanBoard from "@/pages/KanbanBoard";
import GPSJobAnalyzer from "@/pages/GPSJobAnalyzer";
import Calendar from "@/pages/Calendar";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import PerformanceDashboard from "@/pages/PerformanceDashboard";
import BusinessInsights from "@/pages/BusinessInsights";
import TaxReports from "@/pages/TaxReports";
import FinancialAnalytics from "@/pages/FinancialAnalytics";
import CustomerDashboard from "@/pages/CustomerDashboard";
import Social from "@/pages/Social";
import Services from "@/pages/Services";
import Help from "@/pages/Help";
import CompetitiveAdvantage from "@/pages/CompetitiveAdvantage";
import BookingsPage from "@/pages/BookingsPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { CredentialsProvider } from "./contexts/CredentialsContext";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import CustomerSettings from "./pages/CustomerSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CredentialsProvider>
        <SupabaseAuthProvider>
          <AuthProvider>
            <RoleSwitchProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/unified-dashboard" element={<UnifiedDashboard />} />
                    <Route path="/manager" element={<ManagerDashboard />} />
                    <Route path="/financial-analytics" element={<FinancialAnalytics />} />
                    <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                    <Route path="/settings/customer" element={<CustomerSettings />} />
                    <Route path="/gps-job-analyzer" element={<GPSJobAnalyzer />} />
                  </Routes>
                  <Toaster />
                </div>
              </BrowserRouter>
            </RoleSwitchProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </CredentialsProvider>
    </QueryClientProvider>
  );
}

export default App;
