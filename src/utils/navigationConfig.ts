export interface NavigationItem {
  label: string;
  href: string;
  icon: string | React.ReactNode;
  separator?: boolean;
  action?: string;
  badge?: number;
  active?: boolean;
}

// Simplified navigation for launch mode - customer focused
export const visitorNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "How It Works", href: "/help", icon: "❓" }
];

// Simplified customer navigation for launch
export const customerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "My Bookings", href: "/customer-bookings", icon: "📋" },
  { label: "Help", href: "/help", icon: "❓" }
];

// Keep provider nav minimal for now (hidden from main interface)
export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Dashboard", href: "/provider-dashboard", icon: "📊" },
  { label: "My Services", href: "/provider-bookings", icon: "💼" },
  { label: "Help", href: "/help", icon: "❓" }
];

export const getNavigationItems = (user: any, currentRole?: 'customer' | 'provider'): NavigationItem[] => {
  if (!user) return visitorNav;
  
  // For launch mode, default to customer experience
  const activeRole = currentRole || 'customer';
  
  if (activeRole === 'provider') {
    return providerNav;
  }
  
  return customerNav;
};

export const getUserDropdownItems = (user: any, currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  if (!user) return [];

  // Simplified dropdown for launch
  const dashboardHref = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';

  return [
    { label: "Dashboard", href: dashboardHref, icon: "📊" },
    { label: "My Bookings", href: "/customer-bookings", icon: "📋" },
    { label: "Settings", href: "/customer-settings", icon: "⚙️" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Sign Out", href: "", icon: "🚪", action: "logout" }
  ];
};

export const getProfileMenuItems = (currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  // Simplified profile menu for launch
  const profileHref = currentRole === 'provider' ? '/provider-profile' : '/customer-profile';
  const settingsHref = currentRole === 'provider' ? '/provider-settings' : '/customer-settings';

  return [
    { label: "Profile", href: profileHref, icon: "👤" },
    { label: "Settings", href: settingsHref, icon: "⚙️" },
    { label: "Payment Methods", href: "/payment-methods", icon: "💳" },
    { separator: true, label: "", href: "", icon: "" },
    // Hidden for launch mode - keep provider switching minimal
    { label: "Switch to Provider", href: "", icon: "💼", action: "toggle-provider", active: currentRole === 'provider' }
  ];
};

// Simplified analytics - hidden from main interface for launch
export const getAnalyticsMenuItems = (): NavigationItem[] => {
  return [
    { label: "Analytics", href: "/analytics-dashboard", icon: "📊" }
  ];
};
