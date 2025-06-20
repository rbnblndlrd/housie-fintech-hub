
export interface NavigationItem {
  label: string;
  href: string;
  icon: string | React.ReactNode;
  separator?: boolean;
  action?: string;
  badge?: number;
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
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "My Bookings", href: "/booking-history", icon: "📅" },
  { label: "Account", href: "/customer-dashboard", icon: "👤" }
];

export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/dashboard", icon: "🏠" },
  { label: "Dashboard", href: "/analytics", icon: "📊" },
  { label: "My Jobs", href: "/booking-management", icon: "📅" },
  { label: "AI Assistant", href: "/notifications", icon: "🤖" },
  { label: "Profile", href: "/provider-profile", icon: "👤" }
];

export const getNavigationItems = (user: any): NavigationItem[] => {
  if (!user) return visitorNav;
  
  // For now, we'll determine user type based on available context
  // In the future, this should be based on user.role or user.user_role
  return providerNav; // Default to provider for authenticated users
};

export const getUserDropdownItems = (user: any): NavigationItem[] => {
  if (!user) return [];

  return [
    { label: "Account Settings", href: "/customer-dashboard", icon: "⚙️" },
    { label: "Provider Settings", href: "/provider-settings", icon: "🔧" },
    { label: "Payment Methods", href: "/provider-settings", icon: "💳" },
    { label: "Analytics", href: "/analytics-dashboard", icon: "📊" },
    { label: "Verification Status", href: "/provider-profile", icon: "✅" },
    { label: "Performance Reports", href: "/booking-history", icon: "📈" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Sign Out", href: "", icon: "🚪", action: "logout" }
  ];
};
