
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import ConditionalVideoBackground from './components/layout/ConditionalVideoBackground';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import UnifiedDashboard from './pages/UnifiedDashboard';
import BookingsPage from './pages/BookingsPage';
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
import Profile from './pages/Profile';
import Services from './pages/Services';
import PerformanceDashboard from './pages/PerformanceDashboard';
import BusinessInsights from './pages/BusinessInsights';
import CommunityDashboard from './pages/CommunityDashboard';
import Prestige from './pages/Prestige';
import TaxReports from './pages/TaxReports';
import FinancialAnalytics from './pages/FinancialAnalytics';
import InteractiveMapPage from './pages/InteractiveMapPage';
import Pricing from './pages/Pricing';
import { Toaster } from '@/components/ui/toaster';
import DynamicGradientProvider from '@/components/common/DynamicGradientProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
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
                            {/* Conditional Video Background - only shows on specific pages */}
                            <ConditionalVideoBackground />
                            
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
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/provider-profile/:id" element={<ProviderProfile />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
                  <Route path="/social" element={<Social />} />
                  <Route path="/competitive-advantage" element={<CompetitiveAdvantage />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/gps" element={<GPS />} />
                  <Route path="/interactive-map" element={<InteractiveMapPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/community" element={<CommunityDashboard />} />
                  <Route path="/community-dashboard" element={<CommunityDashboard />} />
                  <Route path="/prestige" element={<Prestige />} />
                  <Route path="/business-insights" element={<BusinessInsights />} />
                  <Route path="/tax-reports" element={<TaxReports />} />
                  <Route path="/performance" element={<PerformanceDashboard />} />
                  <Route path="/financial-analytics" element={<FinancialAnalytics />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/clusters/new" element={<React.lazy(() => import('./pages/clusters/ClusterCreate'))} />
                  <Route path="/clusters/:id" element={<React.lazy(() => import('./pages/clusters/ClusterView'))} />
                  <Route path="/clusters" element={<React.lazy(() => import('./pages/clusters/ClusterDashboard'))} />
                  <Route path="/bids" element={<React.lazy(() => import('./pages/clusters/ProviderBids'))} />
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
    </ErrorBoundary>
  );
}

export default App;
