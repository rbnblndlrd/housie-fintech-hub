
export interface NavigationItem {
  label: string;
  href: string;
  icon: string | React.ReactNode;
  separator?: boolean;
  action?: string;
  badge?: number;
  active?: boolean;
}

// Navigation for visitors (not logged in)
export const visitorNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "How It Works", href: "/help", icon: "❓" }
];

// Customer navigation
export const customerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "Dashboard", href: "/customer-dashboard", icon: "📊" },
  { label: "My Bookings", href: "/customer-bookings", icon: "📋" },
  { label: "Calendar", href: "/customer-calendar", icon: "📅" },
  { label: "Help", href: "/help", icon: "❓" }
];

// Provider navigation
export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Dashboard", href: "/provider-dashboard", icon: "📊" },
  { label: "My Services", href: "/provider-bookings", icon: "💼" },
  { label: "Calendar", href: "/provider-calendar", icon: "📅" },
  { label: "Analytics", href: "/analytics-dashboard", icon: "📈" },
  { label: "Help", href: "/help", icon: "❓" }
];

export const getNavigationItems = (user: any, currentRole?: 'customer' | 'provider'): NavigationItem[] => {
  if (!user) return visitorNav;
  
  const activeRole = currentRole || 'customer';
  
  if (activeRole === 'provider') {
    return providerNav;
  }
  
  return customerNav;
};

export const getUserDropdownItems = (user: any, currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  if (!user) return [];

  const dashboardHref = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';
  const bookingsHref = currentRole === 'provider' ? '/provider-bookings' : '/customer-bookings';
  const settingsHref = currentRole === 'provider' ? '/provider-settings' : '/customer-settings';

  return [
    { label: "Dashboard", href: dashboardHref, icon: "📊" },
    { label: "My Bookings", href: bookingsHref, icon: "📋" },
    { label: "Settings", href: settingsHref, icon: "⚙️" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Sign Out", href: "", icon: "🚪", action: "logout" }
  ];
};

export const getProfileMenuItems = (currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  const profileHref = currentRole === 'provider' ? '/provider-profile' : '/customer-profile';
  const settingsHref = currentRole === 'provider' ? '/provider-settings' : '/customer-settings';

  return [
    { label: "Profile", href: profileHref, icon: "👤" },
    { label: "Settings", href: settingsHref, icon: "⚙️" },
    { label: "Payment Methods", href: "/payment-methods", icon: "💳" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Switch to Provider", href: "", icon: "💼", action: "toggle-provider", active: currentRole === 'provider' }
  ];
};

export const getAnalyticsMenuItems = (): NavigationItem[] => {
  return [
    { label: "Analytics", href: "/analytics-dashboard", icon: "📊" },
    { label: "Performance", href: "/performance-dashboard", icon: "⚡" },
    { label: "Business Insights", href: "/business-insights", icon: "💡" },
    { label: "Tax Reports", href: "/tax-reports", icon: "📋" }
  ];
};
