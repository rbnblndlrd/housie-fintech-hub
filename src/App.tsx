import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SupabaseAuthProvider } from '@supabase/auth-helpers-react';
import { Toaster } from '@/components/ui/toaster';
import { Sonner } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import BookingsPage from '@/pages/BookingsPage';
import MessagesPage from '@/pages/MessagesPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ProviderDashboard from '@/pages/ProviderDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import EmergencyDashboard from '@/pages/EmergencyDashboard';
import CalendarPage from '@/pages/CalendarPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import AdminTestingDashboard from '@/components/admin/AdminTestingDashboard';
import FraudDetectionDashboard from '@/pages/admin/FraudDetectionDashboard';
import { RoleSwitchProvider } from '@/contexts/RoleSwitchContext';
import UnifiedProfilePage from '@/components/profile/UnifiedProfilePage';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider client={supabase}>
          <RoleSwitchProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/provider" element={<ProviderDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/emergency" element={<EmergencyDashboard />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/testing" element={<AdminTestingDashboard />} />
                <Route path="/admin/fraud" element={<FraudDetectionDashboard />} />
                <Route path="/profile" element={<UnifiedProfilePage />} />
              </Routes>
            </BrowserRouter>
          </RoleSwitchProvider>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
