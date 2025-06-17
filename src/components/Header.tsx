import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur HOUSIE!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vous déconnecter",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-primary/95 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/89886ba9-5881-408e-93f3-d899470b94ad.png" alt="HOUSIE Logo" className="h-16" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground hover:text-muted-foreground focus:outline-none rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Accueil
              </Link>
              <Link
                to="/services"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Services
              </Link>
              <Link
                to="/calendar"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Calendrier
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Tableau de bord
              </Link>
              <Link
                to="/booking-management"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Réservations
              </Link>
              <Link
                to="/analytics"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Analytics
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation - Auth section */}
          <div className="hidden md:block">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="text-foreground hover:text-muted-foreground rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
            >
              {isDark ? 
                <Sun className="h-[1.2rem] w-[1.2rem]" /> : 
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              }
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-foreground font-medium">
                  Bonjour, {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 font-medium rounded-xl border-gray-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-200 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 font-medium rounded-xl border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200" 
                    size="sm"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-dark-primary border-b border-border py-4 px-6 flex flex-col space-y-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] rounded-b-2xl ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <Link to="/services" className="text-foreground hover:text-muted-foreground font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
              Services
            </Link>
            <Link to="/calendar" className="text-foreground hover:text-muted-foreground font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
              Calendrier
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-muted-foreground font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
              Tableau de bord
            </Link>
            <Link to="/booking-management" className="text-foreground hover:text-muted-foreground font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
              Réservations
            </Link>
            <Link to="/analytics" className="text-foreground hover:text-muted-foreground font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
              Analytics
            </Link>
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="flex flex-col items-start space-y-3">
                <span className="text-sm text-foreground font-medium">
                  Bonjour, {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-center flex items-center gap-2 font-medium rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-start space-y-2">
                <Link to="/auth" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-center flex items-center gap-2 font-medium rounded-xl">
                    <User className="h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth" className="w-full">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full justify-center text-white font-medium rounded-xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)]" size="sm">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
