
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@/utils/navigationConfig";

interface DynamicNavigationProps {
  items: NavigationItem[];
  className?: string;
  isMobile?: boolean;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ 
  items, 
  className,
  isMobile = false 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log('🔗 DynamicNavigation render:', { 
    items: items.length, 
    isMobile, 
    currentPath: location.pathname,
    navigateFunction: typeof navigate,
    locationObject: !!location
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleNavClick = (href: string, label: string, event?: React.MouseEvent) => {
    console.log('🔗 Navigation click START:', { 
      label, 
      href, 
      currentPath: location.pathname,
      eventType: event?.type,
      eventTarget: event?.target
    });
    
    // Prevent any default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log('🔗 Event prevented and stopped');
    }
    
    try {
      console.log('🔗 Attempting navigation with useNavigate...');
      navigate(href);
      console.log('✅ Navigation successful to:', href);
    } catch (error) {
      console.error('❌ Navigation error with useNavigate:', error);
      
      // Fallback method: Try direct window navigation
      try {
        console.log('🔗 Attempting fallback navigation with window.location...');
        window.location.href = href;
        console.log('✅ Fallback navigation successful');
      } catch (fallbackError) {
        console.error('❌ Fallback navigation also failed:', fallbackError);
      }
    }
  };

  if (isMobile) {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        {items.map((item, index) => (
          <Link
            key={`mobile-nav-${index}-${item.href}`}
            to={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
              "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20",
              isActive(item.href) 
                ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-900 dark:text-white"
            )}
            onClick={() => console.log('🔗 Mobile Link clicked:', item.label)}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center space-x-6">
        {/* Show all navigation items except the first one (HOUSIE logo) for desktop navigation */}
        {items.slice(1).map((item, index) => (
          <Link
            key={`desktop-nav-${index}-${item.href}`}
            to={item.href}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer",
              "whitespace-nowrap min-w-[80px] text-center",
              "hover:text-white hover:bg-gray-800",
              isActive(item.href)
                ? "text-white bg-gray-800"
                : "text-gray-300"
            )}
            onClick={() => console.log('🔗 Desktop Link clicked:', item.label)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DynamicNavigation;
