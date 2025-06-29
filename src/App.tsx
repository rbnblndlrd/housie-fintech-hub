
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './contexts/AuthContext';
import { RoleSwitchProvider } from './contexts/RoleSwitchContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Index from './pages/Index';
import UnifiedDashboard from './pages/UnifiedDashboard';
import InteractiveMapPage from './pages/InteractiveMapPage';
import Social from './pages/Social';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import KanbanBoard from './pages/KanbanBoard';
import BookingsPage from './pages/BookingsPage';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import DesktopAdminDashboard from './desktop/pages/DesktopAdminDashboard';
import Services from './pages/Services';

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
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/services" element={<Services />} />
            <Route path="/desktop-admin" element={<DesktopAdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute>
                  <UnifiedDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/interactive-map"
              element={
                <RoleProtectedRoute>
                  <InteractiveMapPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/social"
              element={
                <RoleProtectedRoute>
                  <Social />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <RoleProtectedRoute>
                  <Profile />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <RoleProtectedRoute>
                  <Calendar />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/kanban"
              element={
                <RoleProtectedRoute>
                  <KanbanBoard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <RoleProtectedRoute>
                  <BookingsPage />
                </RoleProtectedRoute>
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
