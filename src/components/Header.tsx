
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Globe, User, Settings, LogOut, BarChart3, Calendar, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [currentRole, setCurrentRole] = useState<'seeker' | 'provider'>('seeker');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const toggleRole = () => {
    setCurrentRole(currentRole === 'seeker' ? 'provider' : 'seeker');
  };

  return (
    <header className="bg-black text-white px-4 py-3 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">H</span>
            </div>
            <span className="text-2xl font-bold">HOUSIE</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-white hover:text-orange-400" onClick={() => navigate('/services')}>
              Services
            </Button>
            <Button variant="ghost" className="text-white hover:text-orange-400" onClick={() => navigate('/roadmap')}>
              Roadmap
            </Button>
            <Button variant="ghost" className="text-white hover:text-orange-400">
              Support
            </Button>
            <Button variant="ghost" className="text-white hover:text-orange-400">
              HOUSIE Pro
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
            <Globe className="h-4 w-4 mr-1" />
            FR
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="bg-cyan-500 border-2 border-cyan-400">
                  <AvatarFallback className="bg-cyan-500 text-white font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current Role:</span>
                    <Badge 
                      variant={currentRole === 'provider' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={toggleRole}
                    >
                      {currentRole === 'provider' ? 'Provider' : 'Customer'}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Click badge to switch: Customer ↔ Provider
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/calendar')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
