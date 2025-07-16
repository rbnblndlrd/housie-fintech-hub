
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import DesktopAdminDashboard from "./pages/DesktopAdminDashboard";
import Auth from "@/pages/Auth";
import { ObsidianDashboard } from "@/components/obsidian/ObsidianDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <RoleProvider>
              <SubscriptionProvider>
                <Routes>
                  <Route path="/" element={<Navigate to="/admin" replace />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<DesktopAdminDashboard />} />
                  <Route path="/vault" element={<ObsidianDashboard />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
                <Toaster />
                <Sonner />
              </SubscriptionProvider>
            </RoleProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
