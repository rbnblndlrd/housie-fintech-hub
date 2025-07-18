
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageProvider';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { SubscriptionProvider } from './contexts/SubscriptionProvider';
import { RoleSwitchProvider } from './contexts/RoleSwitchContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient } from './contexts/QueryClientContext';
import { MapProvider } from './contexts/MapContext';
import ConditionalHeader from './components/layout/ConditionalHeader';
import FloatingNavigation from './components/layout/FloatingNavigation';
import ConditionalSpacingWrapper from './components/layout/ConditionalSpacingWrapper';
import ConditionalVideoBackground from './components/layout/ConditionalVideoBackground';

import AuthPage from './pages/Auth';
import UnifiedDashboard from './pages/UnifiedDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CommunityDashboard from './pages/CommunityDashboard';
import ServiceBoard from './pages/ServiceBoard';

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
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/auth" element={<AuthPage />} />
                                    <Route path="/dashboard" element={<UnifiedDashboard />} />
                                    <Route path="/service-board" element={<ServiceBoard />} />
                                    <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                                    <Route path="/community-dashboard" element={<CommunityDashboard />} />
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
