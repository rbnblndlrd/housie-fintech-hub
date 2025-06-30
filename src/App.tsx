
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleSwitchProvider } from '@/contexts/RoleSwitchContext';
import VideoBackground from '@/components/common/VideoBackground';
import HousieEatsHeader from '@/components/header/HousieEatsHeader';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
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

function App() {
  return (
    <AuthProvider>
      <RoleSwitchProvider>
        <Router>
          {/* Global Video Background */}
          <VideoBackground />
          
          {/* Global HousieEats Header */}
          <HousieEatsHeader />
          
          {/* Main Content with proper z-index to appear over video */}
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<UnifiedDashboard />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />

              {/* Manager System Routes */}
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/gps-job-analyzer" element={<GPSJobAnalyzer />} />
              
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
          </div>
        </Router>
      </RoleSwitchProvider>
    </AuthProvider>
  );
}

export default App;
