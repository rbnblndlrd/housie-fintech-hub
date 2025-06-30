
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleSwitchProvider } from '@/contexts/RoleSwitchContext';
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

function App() {
  return (
    <AuthProvider>
      <RoleSwitchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/subscription-management" element={<SubscriptionManagement />} />
            <Route path="/dashboard" element={<UnifiedDashboard />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />

            {/* Manager System Routes */}
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/gps-job-analyzer" element={<GPSJobAnalyzer />} />
            <Route path="/bookings" element={<BookingsPage />} />
            
            {/* Analytics Routes */}
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
            <Route path="/business-insights" element={<BusinessInsights />} />
            <Route path="/tax-reports" element={<TaxReports />} />
            <Route path="/financial-analytics" element={<FinancialAnalytics />} />
            
            {/* Calendar Route */}
            <Route path="/calendar" element={<Calendar />} />
            
            {/* Social Route */}
            <Route path="/social" element={<Social />} />

            {/* Public Pages */}
            <Route path="/services" element={<Services />} />
            <Route path="/help" element={<Help />} />
            <Route path="/competitive-advantage" element={<CompetitiveAdvantage />} />
          </Routes>
        </Router>
      </RoleSwitchProvider>
    </AuthProvider>
  );
}

export default App;
