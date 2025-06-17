
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import BookingSuccess from "./pages/BookingSuccess";
import Welcome from "./pages/Welcome";
import ProfileSetup from "./pages/ProfileSetup";
import Calendar from "./pages/Calendar";
import BookingManagement from "./pages/BookingManagement";
import Analytics from "./pages/Analytics";
import BookingHistory from "./pages/BookingHistory";
import NotFound from "./pages/NotFound";

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
              <Route path="/services" element={<Services />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/booking-management" element={<BookingManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
