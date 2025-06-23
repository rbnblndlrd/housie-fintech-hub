
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PopArtProvider } from "@/contexts/PopArtContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Welcome from "@/pages/Welcome";
import Services from "@/pages/Services";
import Calendar from "@/pages/Calendar";
import CustomerCalendar from "@/pages/CustomerCalendar";
import ProviderCalendar from "@/pages/ProviderCalendar";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import PerformanceDashboard from "@/pages/PerformanceDashboard";
import BusinessInsights from "@/pages/BusinessInsights";
import TaxReports from "@/pages/TaxReports";
import Notifications from "@/pages/Notifications";
import BookingHistory from "@/pages/BookingHistory";
import BookingSuccess from "@/pages/BookingSuccess";
import CustomerDashboard from "@/pages/CustomerDashboard";
import CustomerBookings from "@/pages/CustomerBookings";
import CustomerSettings from "@/pages/CustomerSettings";
import ProviderDashboard from "@/pages/ProviderDashboard";
import ProviderBookings from "@/pages/ProviderBookings";
import ProviderSettings from "@/pages/ProviderSettings";
import CustomerProfile from "@/pages/CustomerProfile";
import ProviderProfile from "@/pages/ProviderProfile";
import BookingManagement from "@/pages/BookingManagement";
import Onboarding from "@/pages/Onboarding";
import ProfileSetup from "@/pages/ProfileSetup";
import AdminDashboard from "@/pages/AdminDashboard";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import FAQArchive from "@/pages/FAQArchive";
import PublicProviderProfile from "@/pages/PublicProviderProfile";
import NotFound from "@/pages/NotFound";
import GoogleCalendarCallback from "@/components/GoogleCalendarCallback";
import CompetitiveAdvantage from "@/pages/CompetitiveAdvantage";
import InteractiveMapPage from "@/pages/InteractiveMapPage";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

const queryClient = new QueryClient();

// Check if running in desktop mode
const isDesktopMode = typeof window !== 'undefined' && (window as any).DESKTOP_MODE;

const App = () => {
  // If in desktop mode, redirect to desktop app
  if (isDesktopMode) {
    return null; // Desktop app handles its own routing
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PopArtProvider>
          <LanguageProvider>
            <BrowserRouter>
              <AuthProvider>
                <RoleProvider>
                  <SubscriptionProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/welcome" element={<Welcome />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/provider/:id" element={<PublicProviderProfile />} />
                      
                      {/* Customer-specific routes */}
                      <Route path="/customer-dashboard" element={
                        <RoleProtectedRoute requiredRole="customer">
                          <CustomerDashboard />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/customer-bookings" element={
                        <RoleProtectedRoute requiredRole="customer">
                          <CustomerBookings />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/customer-settings" element={
                        <RoleProtectedRoute requiredRole="customer">
                          <CustomerSettings />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/customer-profile" element={
                        <RoleProtectedRoute requiredRole="customer">
                          <CustomerProfile />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/customer-calendar" element={
                        <RoleProtectedRoute requiredRole="customer">
                          <CustomerCalendar />
                        </RoleProtectedRoute>
                      } />
                      
                      {/* Provider-specific routes */}
                      <Route path="/provider-dashboard" element={
                        <RoleProtectedRoute requiredRole="provider">
                          <ProviderDashboard />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/provider-bookings" element={
                        <RoleProtectedRoute requiredRole="provider">
                          <ProviderBookings />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/provider-settings" element={
                        <RoleProtectedRoute requiredRole="provider">
                          <ProviderSettings />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/provider-profile" element={
                        <RoleProtectedRoute requiredRole="provider">
                          <ProviderProfile />
                        </RoleProtectedRoute>
                      } />
                      <Route path="/provider-calendar" element={
                        <RoleProtectedRoute requiredRole="provider">
                          <ProviderCalendar />
                        </RoleProtectedRoute>
                      } />
                      
                      {/* Shared routes */}
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                      <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
                      <Route path="/business-insights" element={<BusinessInsights />} />
                      <Route path="/tax-reports" element={<TaxReports />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/booking-history" element={<BookingHistory />} />
                      <Route path="/booking-success" element={<BookingSuccess />} />
                      <Route path="/booking-management" element={<BookingManagement />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/profile-setup" element={<ProfileSetup />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/faq-archive" element={<FAQArchive />} />
                      <Route path="/competitive-advantage" element={<CompetitiveAdvantage />} />
                      <Route path="/interactive-map" element={<InteractiveMapPage />} />
                      <Route path="/google-calendar-callback" element={<GoogleCalendarCallback />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                    <Sonner />
                  </SubscriptionProvider>
                </RoleProvider>
              </AuthProvider>
            </BrowserRouter>
          </LanguageProvider>
        </PopArtProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
