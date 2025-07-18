
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useAppTheme } from "../contexts/ThemeContext";
import { LogOut, Moon, Sun, Minimize2, Maximize2, X, Settings } from "lucide-react";
import { useState } from "react";
import SettingsDialog from "./SettingsDialog";

const Header = () => {
  const { user, signOut, supabaseReady } = useAuth();
  const { isDark, toggleTheme } = useAppTheme();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleMinimize = () => {
    console.log('Minimize window');
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    console.log('Toggle maximize window');
  };

  const handleClose = () => {
    console.log('Close window');
  };

  if (!supabaseReady) {
    return null; // Don't render header during setup
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-xl">Housie Admin</span>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Desktop
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <SettingsDialog>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </SettingsDialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="h-9"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-1 ml-2 pl-2 border-l">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimize}
                className="h-8 w-8"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMaximize}
                className="h-8 w-8"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
