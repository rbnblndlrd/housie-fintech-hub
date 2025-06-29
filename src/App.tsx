
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser, useSupabaseClient, SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import BookingHistory from '@/pages/BookingHistory';
import Notifications from '@/pages/Notifications';
import Auth from '@/pages/Auth';
import ProviderDashboard from '@/pages/ProviderDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import InteractiveMapPage from '@/pages/InteractiveMapPage';
import CustomerDashboard from '@/pages/CustomerDashboard';
import AdminTestingDashboard from '@/components/admin/AdminTestingDashboard';
import { RoleSwitchProvider } from '@/contexts/RoleSwitchContext';
import UnifiedProfilePage from '@/components/profile/UnifiedProfilePage';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <RoleSwitchProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/bookings" element={<BookingHistory />} />
                <Route path="/messages" element={<Notifications />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/provider" element={<ProviderDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/emergency" element={<InteractiveMapPage />} />
                <Route path="/calendar" element={<CustomerDashboard />} />
                <Route path="/admin/users" element={<CustomerDashboard />} />
                <Route path="/admin/testing" element={<AdminTestingDashboard />} />
                <Route path="/admin/fraud" element={<AdminDashboard />} />
                <Route path="/profile" element={<UnifiedProfilePage />} />
              </Routes>
            </BrowserRouter>
          </RoleSwitchProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
