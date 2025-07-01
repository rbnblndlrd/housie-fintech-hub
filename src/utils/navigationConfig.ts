
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
  { label: "Us vs Them", href: "/competitive-advantage", icon: "⚔️" },
  { label: "Help Center", href: "/help", icon: "❓" }
];

export const customerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "Calendar", href: "/calendar", icon: "📅" },
  { label: "Manager", href: "/manager", icon: "⚙️" },
  { label: "Social", href: "/social", icon: "👥" },
  { label: "Us vs Them", href: "/competitive-advantage", icon: "⚔️" },
  { label: "Help Center", href: "/help", icon: "❓" }
];

export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "Calendar", href: "/calendar", icon: "📅" },
  { label: "Manager", href: "/manager", icon: "⚙️" },
  { label: "Social", href: "/social", icon: "👥" },
  { label: "Us vs Them", href: "/competitive-advantage", icon: "⚔️" },
  { label: "Help Center", href: "/help", icon: "❓" }
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

  return [
    { label: "Map", href: "/emergency", icon: "🗺️" },
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Calendar", href: "/calendar", icon: "📅" },
    { label: "Manager", href: "/manager", icon: "⚙️" },
    { label: "AI Assistant", href: "/notifications", icon: "🤖" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Manage", href: "/subscription-management", icon: "⚙️" },
    { label: "Sign Out", href: "", icon: "🚪", action: "logout" }
  ];
};

export const getProfileMenuItems = (currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  return [
    { label: "Profile", href: "/profile", icon: "👤" },
    { label: "Settings", href: "/profile", icon: "⚙️" },
    { label: "Payment Methods", href: "/payment-methods", icon: "💳" },
    { label: "Verification Status", href: "/profile", icon: "✅" },
    { label: "Manage", href: "/subscription-management", icon: "⚙️" },
    { separator: true, label: "", href: "", icon: "" }
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
