
export interface NavigationItem {
  label: string;
  href: string;
  icon: string | React.ReactNode;
  separator?: boolean;
  action?: string;
  badge?: number;
  active?: boolean;
}

export const visitorNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "Become a Provider", href: "/onboarding", icon: "💼" },
  { label: "How It Works", href: "/about", icon: "❓" },
  { label: "Sign In", href: "/auth", icon: "🔐" }
];

export const customerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/dashboard", icon: "🏠" },
  { label: "Dashboard", href: "/customer-dashboard", icon: "📊" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "Interactive Map", href: "/interactive-map", icon: "🗺️" },
  { label: "My Bookings", href: "/customer-bookings", icon: "📅" },
  { label: "Us vs Them", href: "/competitive-advantage", icon: "⚔️" }
];

export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/dashboard", icon: "🏠" },
  { label: "Dashboard", href: "/provider-dashboard", icon: "📊" },
  { label: "Find Work", href: "/interactive-map", icon: "🗺️" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "AI Assistant", href: "/notifications", icon: "🤖" },
  { label: "Profile", href: "/provider-profile", icon: "👤" }
];

export const getNavigationItems = (user: any, currentRole?: 'customer' | 'provider'): NavigationItem[] => {
  if (!user) return visitorNav;
  
  // Use the currentRole parameter if provided, otherwise fallback to user metadata
  const activeRole = currentRole || user.user_metadata?.user_role || 'customer';
  
  // Return navigation based on current active role
  if (activeRole === 'provider') {
    return providerNav;
  }
  
  // Default to customer navigation for authenticated users
  return customerNav;
};

export const getUserDropdownItems = (user: any, currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  if (!user) return [];

  // Dynamic dashboard link based on current role
  const dashboardHref = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';

  return [
    { label: "Map", href: "/interactive-map", icon: "🗺️" },
    { label: "Dashboard", href: dashboardHref, icon: "📊" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Sign Out", href: "", icon: "🚪", action: "logout" }
  ];
};

export const getProfileMenuItems = (currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  // Dynamic profile link based on current role
  const profileHref = currentRole === 'provider' ? '/provider-profile' : '/customer-profile';

  // Dynamic settings link based on current role
  const settingsHref = currentRole === 'provider' ? '/provider-settings' : '/customer-settings';

  return [
    { label: "Profile", href: profileHref, icon: "👤" },
    { label: "Settings", href: settingsHref, icon: "⚙️" },
    { label: "Payment Methods", href: "/payment-methods", icon: "💳" },
    { label: "Verification Status", href: "/provider-profile", icon: "✅" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Switch to Customer", href: "", icon: "👥", action: "toggle-customer", active: currentRole === 'customer' },
    { label: "Switch to Provider", href: "", icon: "💼", action: "toggle-provider", active: currentRole === 'provider' }
  ];
};

export const getAnalyticsMenuItems = (): NavigationItem[] => {
  return [
    { label: "Analytics", href: "/analytics-dashboard", icon: "📊" },
    { label: "Performance", href: "/performance-dashboard", icon: "📈" },
    { label: "Business Insights", href: "/business-insights", icon: "💼" },
    { label: "Tax Reports", href: "/tax-reports", icon: "📋" }
  ];
};
