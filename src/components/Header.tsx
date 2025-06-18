
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Settings, Calendar, BarChart3, MessageCircle, Bell, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NotificationBell from "./NotificationBell";

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

  const scrollToPricing = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      const pricingSection = document.querySelector('#pricing-section');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/new-housie-logo.png" 
              alt="HOUSIE Logo" 
              className={`h-36 transition-all duration-200 ${isDark ? 'filter invert brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-900 dark:text-white hover:text-gray-600 focus:outline-none rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Desktop Navigation - Simplified */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link
                to="/dashboard"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/services"
                className="text-gray-900 dark:text-white hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Services
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation - Auth section */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="text-gray-900 dark:text-white hover:text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
              >
                {isDark ? 
                  <Sun className="h-[1.2rem] w-[1.2rem]" /> : 
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                }
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              {/* Notifications Bell */}
              {user && <NotificationBell />}
              
              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                        </div>
                        <span className="text-sm font-medium hidden lg:block text-gray-900 dark:text-white">
                          {user.user_metadata?.full_name || user.email}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <DropdownMenuLabel className="flex items-center space-x-3 p-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{user.user_metadata?.full_name || user.email}</p>
                          <p className="text-xs text-gray-500">PREMIUM</p>
                        </div>
                      </DropdownMenuLabel>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Gestion Section */}
                      <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">
                        Gestion
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/provider-profile" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <User className="h-4 w-4" />
                          <span>Mon Profil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/calendar" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <Calendar className="h-4 w-4" />
                          <span>Calendrier</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/booking-management" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <Calendar className="h-4 w-4" />
                          <span>Réservations</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      
                      {/* Analytics & Growth Section */}
                      <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">
                        Analytics & Growth
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/analytics" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <BarChart3 className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/analytics" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <BarChart3 className="h-4 w-4" />
                          <span>Insights Avancées</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/booking-history" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <BarChart3 className="h-4 w-4" />
                          <span>Rapports Professionnels</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      
                      {/* Communication & Support Section */}
                      <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">
                        Communication & Support
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                        <MessageCircle className="h-4 w-4" />
                        <span>Messages</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/faq" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <Bell className="h-4 w-4" />
                          <span>FAQ & Support</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/provider-settings" className="flex items-center space-x-2 px-3 py-2 text-gray-900 dark:text-white">
                          <Settings className="h-4 w-4" />
                          <span>Paramètres</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={handleSignOut} className="flex items-center space-x-2 px-3 py-2 text-red-600">
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* HOUSIE Pro Diamond - After user dropdown */}
                  <Button
                    onClick={scrollToPricing}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20 rounded-xl transition-all duration-200"
                    title="HOUSIE Pro"
                  >
                    <span className="text-lg">💎</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <Link to="/auth">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 font-medium rounded-xl border-gray-200 dark:border-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 text-gray-900 dark:text-white"
                      >
                        <User className="h-4 w-4" />
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/onboarding">
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200" 
                        size="sm"
                      >
                        S'inscrire
                      </Button>
                    </Link>
                  </div>
                  
                  {/* HOUSIE Pro Diamond - After signup button */}
                  <Button
                    onClick={scrollToPricing}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20 rounded-xl transition-all duration-200"
                    title="HOUSIE Pro"
                  >
                    <span className="text-lg">💎</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex flex-col space-y-3 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] rounded-b-2xl ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <Link to="/dashboard" className="text-gray-900 dark:text-white hover:text-gray-600 font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
              Dashboard
            </Link>
            <Link to="/services" className="text-gray-900 dark:text-white hover:text-gray-600 font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
              Services
            </Link>
            <Button
              onClick={scrollToPricing}
              variant="ghost"
              className="justify-start text-gray-900 dark:text-white hover:text-gray-600 font-medium rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20 transition-all duration-200"
            >
              💎 HOUSIE Pro
            </Button>
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="flex flex-col items-start space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 w-full">
                  <NotificationBell />
                  <span className="text-sm text-gray-900 dark:text-white font-medium flex-1">
                    Bonjour, {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-center flex items-center gap-2 font-medium rounded-xl border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-start space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link to="/auth" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-center flex items-center gap-2 font-medium rounded-xl border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                    <User className="h-4 w-4" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/onboarding" className="w-full">
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
