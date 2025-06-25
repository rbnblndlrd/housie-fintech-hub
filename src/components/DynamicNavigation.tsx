
import React from "react";
import { Link, useLocation } from "react-router-dom";
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

  console.log('🔗 DynamicNavigation render:', { 
    items: items.length, 
    isMobile, 
    currentPath: location.pathname
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  if (isMobile) {
    return (
      <div className={cn("flex flex-col space-y-2", className)} style={{ pointerEvents: 'auto' }}>
        {items.map((item, index) => (
          <Link
            key={`mobile-nav-${index}-${item.href}`}
            to={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20",
              isActive(item.href) 
                ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-900 dark:text-white"
            )}
            style={{ 
              pointerEvents: 'auto', 
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <nav className={cn("flex items-center justify-center", className)} style={{ pointerEvents: 'auto' }}>
      <div className="flex items-center space-x-6" style={{ pointerEvents: 'auto' }}>
        {/* Show all navigation items except the first one (HOUSIE logo) for desktop navigation */}
        {items.slice(1).map((item, index) => (
          <Link
            key={`desktop-nav-${index}-${item.href}`}
            to={item.href}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 relative z-50",
              "whitespace-nowrap min-w-[80px] text-center",
              "hover:text-white hover:bg-gray-800",
              isActive(item.href)
                ? "text-white bg-gray-800"
                : "text-gray-300"
            )}
            style={{ 
              pointerEvents: 'auto', 
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
            onClick={(e) => {
              console.log('🔗 Navigation link clicked:', item.href);
              // Let React Router handle the navigation naturally
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default DynamicNavigation;
