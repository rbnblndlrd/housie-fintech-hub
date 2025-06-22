
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { CredentialsProvider, useCredentials } from "./contexts/CredentialsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import SetupScreen from "./components/SetupScreen";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading, isSetupComplete } = useCredentials();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return <SetupScreen />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CredentialsProvider>
        <AppContent />
      </CredentialsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
