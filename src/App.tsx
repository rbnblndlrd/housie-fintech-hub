
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleSwitchProvider } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import UnifiedDashboard from '@/pages/UnifiedDashboard';
import ManagerDashboard from "@/pages/ManagerDashboard";
import KanbanBoard from "@/pages/KanbanBoard";
import GPSJobAnalyzer from "@/pages/GPSJobAnalyzer";

function App() {
  return (
    <AuthProvider>
      <RoleSwitchProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<UnifiedDashboard />} />

            {/* Manager System Routes */}
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/gps-job-analyzer" element={<GPSJobAnalyzer />} />
          </Routes>
        </Router>
      </RoleSwitchProvider>
    </AuthProvider>
  );
}

export default App;
