import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { RoleProvider } from './contexts/RoleContext';
import { RoleSwitchProvider } from './contexts/RoleSwitchContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient } from './contexts/QueryClientContext';
import { MapProvider } from './contexts/MapContext';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderProfile from './pages/ProviderProfile';
import ServiceDetails from './pages/ServiceDetails';
import SearchResults from './pages/SearchResults';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingDetails from './pages/BookingDetails';
import NotificationsPage from './pages/Notifications';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminServices from './pages/AdminServices';
import AdminBookings from './pages/AdminBookings';
import AdminPayments from './pages/AdminPayments';
import AdminCategories from './pages/AdminCategories';
import AdminReviews from './pages/AdminReviews';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import DynamicGradientProvider from '@/components/common/DynamicGradientProvider';

function App() {
  return (
    <LanguageProvider>
      <RoleProvider>
        <RoleSwitchProvider>
          <SubscriptionProvider>
            <AuthProvider>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <QueryClient>
                  <MapProvider>
                    <DynamicGradientProvider>
                      <Router>
                        <div className="App min-h-screen">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                            <Route path="/provider-profile/:id" element={<ProviderProfile />} />
                            <Route path="/service-details/:id" element={<ServiceDetails />} />
                            <Route path="/search-results" element={<SearchResults />} />
                            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                            <Route path="/booking-details/:id" element={<BookingDetails />} />
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                            <Route path="/admin-dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/services" element={<AdminServices />} />
                            <Route path="/admin/bookings" element={<AdminBookings />} />
                            <Route path="/admin/payments" element={<AdminPayments />} />
                            <Route path="/admin/categories" element={<AdminCategories />} />
                            <Route path="/admin/reviews" element={<AdminReviews />} />
                            <Route path="/admin/settings" element={<AdminSettings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                          <Toaster />
                        </div>
                      </Router>
                    </DynamicGradientProvider>
                  </MapProvider>
                </QueryClient>
              </ThemeProvider>
            </AuthProvider>
          </SubscriptionProvider>
        </RoleSwitchProvider>
      </RoleProvider>
    </LanguageProvider>
  );
}

export default App;
