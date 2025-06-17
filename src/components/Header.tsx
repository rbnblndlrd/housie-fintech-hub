
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

  async function handleSignOut() {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center font-bold text-2xl text-white">
          <img src="/lovable-uploads/89886ba9-5881-408e-93f3-d899470b94ad.png" alt="HOUSIE Logo" className="mr-2 h-8" />
          HOUSIE
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-gray-300 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/services" className="text-white hover:text-gray-300">
            Services
          </Link>
          <Link to="/roadmap" className="text-white hover:text-gray-300">
            Roadmap
          </Link>
          <a href="https://housie.canny.io/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            Feature Requests
          </a>
        </div>
        
        {/* Desktop Navigation - Auth section */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:text-gray-300 hover:bg-gray-800">
            {isDark ? <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> : <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-white">
                Bonjour, {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-black"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-black">
                  <User className="h-4 w-4" />
                  Connexion
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="sm">
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu (Hidden by Default) */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-black border-b border-gray-800 py-4 px-6 flex flex-col space-y-3 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <Link to="/services" className="text-white hover:text-gray-300">
            Services
          </Link>
          <Link to="/roadmap" className="text-white hover:text-gray-300">
            Roadmap
          </Link>
          <a href="https://housie.canny.io/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
            Feature Requests
          </a>
          
          {/* Mobile Auth Section */}
          {user ? (
            <div className="flex flex-col items-start space-y-3">
              <span className="text-sm text-white">
                Bonjour, {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-center flex items-center gap-2 border-white text-white hover:bg-white hover:text-black"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-start space-y-2">
              <Link to="/auth" className="w-full">
                <Button variant="outline" size="sm" className="w-full justify-center flex items-center gap-2 border-white text-white hover:bg-white hover:text-black">
                  <User className="h-4 w-4" />
                  Connexion
                </Button>
              </Link>
              <Link to="/auth" className="w-full">
                <Button className="bg-purple-600 hover:bg-purple-700 w-full justify-center text-white" size="sm">
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
