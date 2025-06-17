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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-primary/95 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/89886ba9-5881-408e-93f3-d899470b94ad.png" alt="HOUSIE Logo" className="h-16" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground hover:text-muted-foreground focus:outline-none"
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
                className="text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Accueil
              </Link>
              <Link
                to="/services"
                className="text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                to="/calendar"
                className="text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Calendrier
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Tableau de bord
              </Link>
              <Link
                to="/booking-management"
                className="text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Réservations
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation - Auth section */}
          <div className="hidden md:block">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground hover:text-muted-foreground">
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
                  className="flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 font-medium">
                    <User className="h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium" size="sm">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-background border-b border-border py-4 px-6 flex flex-col space-y-3 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <Link to="/services" className="text-foreground hover:text-muted-foreground font-medium">
              Services
            </Link>
            <Link to="/roadmap" className="text-foreground hover:text-muted-foreground font-medium">
              Roadmap
            </Link>
            <a href="https://housie.canny.io/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground font-medium">
              Feature Requests
            </a>
            
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
                  className="w-full justify-center flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-start space-y-2">
                <Link to="/auth" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-center flex items-center gap-2 font-medium">
                    <User className="h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth" className="w-full">
                  <Button className="bg-purple-600 hover:bg-purple-700 w-full justify-center text-white font-medium" size="sm">
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
