
import React from "react";
import { Link, useLocation } from "react-router-dom";
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

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  if (isMobile) {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        {items.map((item, index) => (
          <Link 
            key={index}
            to={item.href} 
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20",
              isActive(item.href) 
                ? "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300"
                : "text-gray-900 dark:text-white"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center space-x-8", className)}>
      {items.slice(1).map((item, index) => (
        <Link
          key={index}
          to={item.href}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
            "hover:text-white hover:bg-gray-800",
            isActive(item.href)
              ? "text-white bg-gray-800"
              : "text-gray-300"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default DynamicNavigation;
