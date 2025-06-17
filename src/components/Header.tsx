
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, BarChart3, Calendar, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'seeker' | 'provider'>('seeker');
  const { isDark, toggleTheme } = useTheme();

  const switchRole = () => {
    setUserRole(prev => prev === 'seeker' ? 'provider' : 'seeker');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-orange-100 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
              H
            </div>
            <div className="font-black text-2xl">
              <span className="text-orange-500">HOUSIE</span>
              <span className="text-purple-600">.ca</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/services" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors">
              Services
            </Link>
            <Link to="/roadmap" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors">
              Comment ça marche
            </Link>
            <div className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors cursor-pointer">
              Tarifs
            </div>
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium transition-colors">
              Tableau de bord
            </Link>
          </nav>

          {/* User Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 rounded-xl"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Role Switcher */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <Button
                variant={userRole === 'seeker' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserRole('seeker')}
                className={`rounded-lg font-medium ${
                  userRole === 'seeker' 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Client
              </Button>
              <Button
                variant={userRole === 'provider' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserRole('provider')}
                className={`rounded-lg font-medium ${
                  userRole === 'provider' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Prestataire
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 border-orange-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 rounded-xl">
                  <User className="h-4 w-4 mr-2" />
                  Mon Compte
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">Mode actuel:</p>
                  <Badge className={`mt-1 ${
                    userRole === 'seeker' 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {userRole === 'seeker' ? '👤 Client' : '🔧 Prestataire'}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={switchRole} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Changer de rôle
                </DropdownMenuItem>
                <Link to="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Tableau de bord
                  </DropdownMenuItem>
                </Link>
                <Link to="/calendar">
                  <DropdownMenuItem className="cursor-pointer">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendrier
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link to="/auth">
                  <DropdownMenuItem className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/auth">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg">
                CONNEXION
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-orange-100 dark:border-gray-700">
            <nav className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="border-gray-300 dark:border-gray-600"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
              <Link to="/services" className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium py-2">
                Services
              </Link>
              <Link to="/roadmap" className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium py-2">
                Comment ça marche
              </Link>
              <div className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium py-2 cursor-pointer">
                Tarifs
              </div>
              <Link to="/dashboard" className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium py-2">
                Tableau de bord
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl">
                    CONNEXION
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
