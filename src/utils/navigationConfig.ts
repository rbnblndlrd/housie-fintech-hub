
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
  { label: "Dashboard", href: "/dashboard", icon: "🛠️" }
];

export const customerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Service Board", href: "/service-board", icon: "📋" },
  { label: "Community", href: "/community-dashboard", icon: "👥" },
  { label: "Analytics", href: "/analytics-dashboard", icon: "📈" }
];

export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/", icon: "🏠" },
  { label: "Dashboard", href: "/dashboard", icon: "🛠️" },
  { label: "Community", href: "/community-dashboard", icon: "👥" },
  { label: "Analytics", href: "/analytics-dashboard", icon: "📈" }
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

  const dashboardLabel = currentRole === 'provider' ? 'Dashboard' : 'Service Board';
  const dashboardHref = currentRole === 'provider' ? '/dashboard' : '/service-board';
  
  return [
    { label: dashboardLabel, href: dashboardHref, icon: "📊" },
    { label: "Community", href: "/community-dashboard", icon: "👥" },
    { label: "Analytics", href: "/analytics-dashboard", icon: "📈" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Sign Out", href: "", icon: "🚪", action: "logout" }
  ];
};

export const getProfileMenuItems = (currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  return [
    { label: "Settings", href: "/dashboard", icon: "⚙️" },
    { separator: true, label: "", href: "", icon: "" }
  ];
};

export const getAnalyticsMenuItems = (): NavigationItem[] => {
  return [
    { label: "Analytics", href: "/analytics-dashboard", icon: "📊" }
  ];
};
