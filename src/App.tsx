import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Welcome from "@/pages/Welcome";
import Dashboard from "@/pages/Dashboard";
import Services from "@/pages/Services";
import Calendar from "@/pages/Calendar";
import Analytics from "@/pages/Analytics";
import Notifications from "@/pages/Notifications";
import BookingHistory from "@/pages/BookingHistory";
import BookingSuccess from "@/pages/BookingSuccess";
import CustomerDashboard from "@/pages/CustomerDashboard";
import ProviderProfile from "@/pages/ProviderProfile";
import ProviderSettings from "@/pages/ProviderSettings";
import BookingManagement from "@/pages/BookingManagement";
import Onboarding from "@/pages/Onboarding";
import ProfileSetup from "@/pages/ProfileSetup";
import AdminDashboard from "@/pages/AdminDashboard";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import FAQArchive from "@/pages/FAQArchive";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<Services />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/provider-profile" element={<ProviderProfile />} />
              <Route path="/provider-settings" element={<ProviderSettings />} />
              <Route path="/booking-management" element={<BookingManagement />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/faq-archive" element={<FAQArchive />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
