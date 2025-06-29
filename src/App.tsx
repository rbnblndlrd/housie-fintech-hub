import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './contexts/AuthContext';
import { RoleSwitchProvider } from './contexts/RoleSwitchContext';
import ProtectedRoute from './components/ProtectedRoute';
import UnifiedDashboard from './pages/UnifiedDashboard';
import InteractiveMap from './pages/InteractiveMap';
import Social from './pages/Social';
import Profile from './pages/Profile';
import CalendarPage from './pages/CalendarPage';
import KanbanBoard from './pages/KanbanBoard';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import DesktopAdminDashboard from './desktop/pages/DesktopAdminDashboard';

import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PerformanceDashboard from './pages/PerformanceDashboard';
import BusinessInsights from './pages/BusinessInsights';
import FinancialAnalytics from './pages/FinancialAnalytics';
import TaxReports from './pages/TaxReports';

function App() {
  return (
    <AuthProvider>
      <RoleSwitchProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/desktop-admin" element={<DesktopAdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UnifiedDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interactive-map"
              element={
                <ProtectedRoute>
                  <InteractiveMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social"
              element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kanban"
              element={
                <ProtectedRoute>
                  <KanbanBoard />
                </ProtectedRoute>
              }
            />
            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
            <Route path="/business-insights" element={<BusinessInsights />} />
            <Route path="/financial-analytics" element={<FinancialAnalytics />} />
            <Route path="/tax-reports" element={<TaxReports />} />
          </Routes>
          <Toaster />
        </Router>
      </RoleSwitchProvider>
    </AuthProvider>
  );
}

export default App;
