
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { RoleSwitchProvider } from './contexts/RoleSwitchContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient } from './contexts/QueryClientContext';
import { MapProvider } from './contexts/MapContext';
import ConditionalHeader from './components/layout/ConditionalHeader';
import FloatingNavigation from './components/layout/FloatingNavigation';
import ConditionalSpacingWrapper from './components/layout/ConditionalSpacingWrapper';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import UnifiedDashboard from './pages/UnifiedDashboard';
import ProviderProfile from './pages/ProviderProfile';
import NotificationsPage from './pages/Notifications';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Social from './pages/Social';
import CompetitiveAdvantage from './pages/CompetitiveAdvantage';
import Help from './pages/Help';
import Calendar from './pages/Calendar';
import GPS from './pages/GPS';
import ManagerDashboard from './pages/ManagerDashboard';
import Profile from './pages/Profile';
import Services from './pages/Services';
import BookingsPage from './pages/BookingsPage';
import PerformanceDashboard from './pages/PerformanceDashboard';
import BusinessInsights from './pages/BusinessInsights';
import HelpCenter from './pages/HelpCenter';
import InteractiveMapPage from './pages/InteractiveMapPage';
import { Toaster } from '@/components/ui/toaster';
import DynamicGradientProvider from '@/components/common/DynamicGradientProvider';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RoleProvider>
          <SubscriptionProvider>
            <RoleSwitchProvider>
              <ThemeProvider>
                <QueryClient>
                  <MapProvider>
                    <DynamicGradientProvider>
                      <Router>
                        <div className="App min-h-screen">
                          {/* Conditional Header - only shows on specific pages */}
                          <ConditionalHeader />
                          
                          {/* Floating Navigation - shows on headerless pages */}
                          <FloatingNavigation />
                          
                          {/* Main content with conditional spacing */}
                          <main className="conditional-main-spacing">
                            <ConditionalSpacingWrapper>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/auth" element={<AuthPage />} />
                              <Route path="/dashboard" element={<UnifiedDashboard />} />
                              <Route path="/provider-profile/:id" element={<ProviderProfile />} />
                              <Route path="/notifications" element={<NotificationsPage />} />
                              <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                              <Route path="/admin-dashboard" element={<AdminDashboard />} />
                              <Route path="/social" element={<Social />} />
                              <Route path="/competitive-advantage" element={<CompetitiveAdvantage />} />
                              <Route path="/help" element={<Help />} />
                              <Route path="/help-center" element={<HelpCenter />} />
                              <Route path="/calendar" element={<Calendar />} />
                              <Route path="/gps" element={<GPS />} />
                              <Route path="/interactive-map" element={<InteractiveMapPage />} />
                              <Route path="/manager" element={<ManagerDashboard />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/services" element={<Services />} />
                              <Route path="/bookings" element={<BookingsPage />} />
                              <Route path="/analytics" element={<AnalyticsDashboard />} />
                              <Route path="/performance" element={<PerformanceDashboard />} />
                              <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
                              <Route path="/business-insights" element={<BusinessInsights />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                            </ConditionalSpacingWrapper>
                          </main>
                          <Toaster />
                        </div>
                      </Router>
                    </DynamicGradientProvider>
                  </MapProvider>
                </QueryClient>
              </ThemeProvider>
            </RoleSwitchProvider>
          </SubscriptionProvider>
        </RoleProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
