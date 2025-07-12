
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
  { label: "My Dashboard", href: "/customer-dashboard", icon: "📊" },
  { label: "Service Board", href: "/service-board", icon: "📋" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "Calendar", href: "/calendar", icon: "📅" },
  { label: "Community", href: "/community", icon: "👥" },
  { label: "Map", href: "/gps", icon: "🗺️" },
  { label: "Us vs Them", href: "/competitive-advantage", icon: "⚔️" },
  { label: "Help Center", href: "/help", icon: "❓" }
];

export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Job Hub", href: "/dashboard", icon: "🛠️" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "Calendar", href: "/calendar", icon: "📅" },
  { label: "Community", href: "/community", icon: "👥" },
  { label: "Map", href: "/gps", icon: "🗺️" },
  { label: "Analytics", href: "/analytics-dashboard", icon: "📈" },
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

  const dashboardLabel = currentRole === 'provider' ? 'Job Hub' : 'Service Board';
  const dashboardHref = currentRole === 'provider' ? '/dashboard' : '/service-board';
  
  return [
    { label: "Map", href: "/gps", icon: "🗺️" },
    { label: dashboardLabel, href: dashboardHref, icon: "📊" },
    { label: "Calendar", href: "/calendar", icon: "📅" },
    { label: "AI Assistant", href: "/notifications", icon: "🤖" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Profile", href: "/profile", icon: "👤" },
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
    { label: "Business Insights", href: "/business-insights", icon: "💼" },
    { label: "Tax Reports", href: "/tax-reports", icon: "📋" }
  ];
};
