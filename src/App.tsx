
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { RoleProvider } from './contexts/RoleContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PopArtProvider } from './contexts/PopArtContext';
import Index from './pages/Index';
import Auth from './pages/Auth';
import CustomerProfile from './pages/CustomerProfile';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import BookingSuccess from './pages/BookingSuccess';
import Services from './pages/Services';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import BookingHistory from './pages/BookingHistory';
import BookingManagement from './pages/BookingManagement';
import Notifications from './pages/Notifications';
import ProviderProfile from './pages/ProviderProfile';
import Analytics from './pages/Analytics';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PerformanceDashboard from './pages/PerformanceDashboard';
import Onboarding from './pages/Onboarding';
import About from './pages/About';
import './index.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <RoleProvider>
                <LanguageProvider>
                  <PopArtProvider>
                    <div className="min-h-screen bg-background text-foreground">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Auth />} />
                        <Route path="/signup" element={<Auth />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                        <Route path="/customer-profile" element={<CustomerProfile />} />
                        <Route path="/profile" element={<CustomerProfile />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/provider" element={<ProviderDashboard />} />
                        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                        <Route path="/provider-profile" element={<ProviderProfile />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/booking-history" element={<BookingHistory />} />
                        <Route path="/booking-management" element={<BookingManagement />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                        <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/booking/:id" element={<BookingSuccess />} />
                        <Route path="/booking-success" element={<BookingSuccess />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <Toaster />
                  </PopArtProvider>
                </LanguageProvider>
              </RoleProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
