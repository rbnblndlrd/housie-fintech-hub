
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
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import UnifiedDashboard from './pages/UnifiedDashboard';
import ProviderProfile from './pages/ProviderProfile';
import NotificationsPage from './pages/Notifications';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
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
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/dashboard" element={<UnifiedDashboard />} />
                            <Route path="/provider-profile/:id" element={<ProviderProfile />} />
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                            <Route path="/admin-dashboard" element={<AdminDashboard />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
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
