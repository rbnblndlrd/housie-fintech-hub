
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import About from "./pages/About";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingSuccess from "./pages/BookingSuccess";
import Welcome from "./pages/Welcome";
import ProfileSetup from "./pages/ProfileSetup";
import Calendar from "./pages/Calendar";
import BookingManagement from "./pages/BookingManagement";
import Analytics from "./pages/Analytics";
import BookingHistory from "./pages/BookingHistory";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderSettings from "./pages/ProviderSettings";
import Notifications from "./pages/Notifications";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import { ChatAssistant } from "@/components/ChatAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/booking-management" element={<BookingManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/provider-profile" element={<ProviderProfile />} />
              <Route path="/provider-settings" element={<ProviderSettings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Add Chat System - Available on all authenticated pages */}
            <ChatAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
