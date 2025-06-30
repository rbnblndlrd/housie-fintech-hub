
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
import CustomerDashboard from "@/pages/CustomerDashboard";
import Social from "@/pages/Social";

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
              
              {/* Calendar Route */}
              <Route path="/calendar" element={<Calendar />} />
              
              {/* Social Route */}
              <Route path="/social" element={<Social />} />
            </Routes>
          </div>
        </Router>
      </RoleSwitchProvider>
    </AuthProvider>
  );
}

export default App;
