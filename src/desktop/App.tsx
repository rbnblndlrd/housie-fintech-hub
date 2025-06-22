
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PopArtProvider } from "@/contexts/PopArtContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import DesktopAdminDashboard from "./pages/DesktopAdminDashboard";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <PopArtProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <RoleProvider>
                <SubscriptionProvider>
                  <Routes>
                    <Route path="/" element={<Navigate to="/admin" replace />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<DesktopAdminDashboard />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
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

export default App;
