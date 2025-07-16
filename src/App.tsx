
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
import Dashboard from './pages/Dashboard';
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
import ServiceBoard from './pages/ServiceBoard';
import InteractiveMapPage from './pages/InteractiveMapPage';
import MapView from './pages/MapView';
import Pricing from './pages/Pricing';
import ProviderSetup from './pages/ProviderSetup';
import ClusterCreate from './pages/clusters/ClusterCreate';
import ClusterView from './pages/clusters/ClusterView';
import ClusterDashboard from './pages/clusters/ClusterDashboard';
import ProviderBids from './pages/clusters/ProviderBids';
import OpportunityList from './pages/opportunities/OpportunityList';
import OpportunityCreate from './pages/opportunities/OpportunityCreate';
import OpportunityDetail from './pages/opportunities/OpportunityDetail';
import CrewOpportunities from './pages/crews/CrewOpportunities';
import CrewBids from './pages/crews/CrewBids';
import OpportunityBidPlannerPage from './pages/opportunities/OpportunityBidPlanner';
import { QuoteVaultManager } from './pages/QuoteVaultManager';
import FusionLab from './pages/FusionLab';
import ShowcaseRoom from './pages/ShowcaseRoom';
import { CanonThreads } from './pages/CanonThreads';
import { CanonThreadViewer } from './pages/CanonThreadViewer';
import { CreateCanonThread } from './pages/CreateCanonThread';
import BroadcastDashboard from './pages/BroadcastDashboard';

import { Toaster } from '@/components/ui/toaster';
import { CanonBroadcast } from '@/components/broadcast/CanonBroadcast';
import DynamicGradientProvider from '@/components/common/DynamicGradientProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CBSProvider } from '@/components/cbs/CBSProvider';

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
                  <CBSProvider enableForGuests={true}>
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
                  <Route path="/service-board" element={<ServiceBoard />} />
                  
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
                  <Route path="/map" element={<MapView />} />
                  <Route path="/interactive-map" element={<InteractiveMapPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  
                  <Route path="/community-dashboard" element={<CommunityDashboard />} />
                  <Route path="/prestige" element={<Prestige />} />
                  <Route path="/business-insights" element={<BusinessInsights />} />
                  <Route path="/tax-reports" element={<TaxReports />} />
                  <Route path="/performance" element={<PerformanceDashboard />} />
                  <Route path="/financial-analytics" element={<FinancialAnalytics />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/provider-setup" element={<ProviderSetup />} />
                  <Route path="/clusters/new" element={<ClusterCreate />} />
                  <Route path="/clusters/:id" element={<ClusterView />} />
                  <Route path="/clusters" element={<ClusterDashboard />} />
                  <Route path="/bids" element={<ProviderBids />} />
                  <Route path="/opportunities" element={<OpportunityList />} />
                  <Route path="/opportunities/new" element={<OpportunityCreate />} />
                  <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                  <Route path="/opportunities/:id/bid" element={<OpportunityBidPlannerPage />} />
                  <Route path="/crews/opportunities" element={<CrewOpportunities />} />
                  <Route path="/crews/bids" element={<CrewBids />} />
                  <Route path="/quote-vault" element={<QuoteVaultManager />} />
                  <Route path="/fusion-lab" element={<FusionLab />} />
                  <Route path="/showcase/:username" element={<ShowcaseRoom />} />
            <Route path="/canon-threads" element={<CanonThreads />} />
            <Route path="/canon-threads/new" element={<CreateCanonThread />} />
            <Route path="/canon-threads/:threadId" element={<CanonThreadViewer />} />
            <Route path="/broadcast" element={<BroadcastDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                              </ConditionalSpacingWrapper>
                            </main>
                            
                            {/* Global Canon Broadcast System */}
                            <CanonBroadcast position="bottom-left" />
                            
                            <Toaster />
                          </div>
                        </Router>
                       </DynamicGradientProvider>
                    </MapProvider>
                  </CBSProvider>
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
