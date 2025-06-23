
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
  { label: "Dashboard", href: "/customer-dashboard", icon: "📊" },
  { label: "Find Services", href: "/services", icon: "🔍" },
  { label: "My Bookings", href: "/customer-bookings", icon: "📅" },
  { label: "Us vs Them", href: "/competitive-advantage", icon: "⚔️" }
];

export const providerNav: NavigationItem[] = [
  { label: "HOUSIE", href: "/dashboard", icon: "🏠" },
  { label: "Dashboard", href: "/provider-dashboard", icon: "📊" },
  { label: "Calendar", href: "/provider-bookings", icon: "📅" },
  { label: "AI Assistant", href: "/notifications", icon: "🤖" },
  { label: "Profile", href: "/provider-profile", icon: "👤" }
];

export const getNavigationItems = (user: any): NavigationItem[] => {
  if (!user) return visitorNav;
  
  // Check if user has provider capabilities or role
  // For now, we'll default to customer navigation for most users
  // This can be expanded later with proper role detection from user metadata or database
  const userRole = user.user_metadata?.user_role || 'customer';
  const canProvide = user.user_metadata?.can_provide || false;
  
  // If user is explicitly a provider or can provide services, show provider nav
  if (userRole === 'provider' || canProvide) {
    return providerNav;
  }
  
  // Default to customer navigation for authenticated users
  return customerNav;
};

export const getUserDropdownItems = (user: any, currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  if (!user) return [];

  // Dynamic dashboard link based on current role
  const dashboardHref = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';

  // Dynamic profile link based on current role
  const profileHref = currentRole === 'provider' ? '/provider-profile' : '/customer-profile';

  // Dynamic settings link based on current role
  const settingsHref = currentRole === 'provider' ? '/provider-settings' : '/customer-settings';

  return [
    { label: "Dashboard", href: dashboardHref, icon: "📊" },
    { label: "Profile", href: profileHref, icon: "👤" },
    { label: "Settings", href: settingsHref, icon: "⚙️" },
    { label: "Payment Methods", href: "/provider-profile", icon: "💳" },
    { label: "Analytics", href: "/analytics-dashboard", icon: "📊" },
    { label: "Verification Status", href: "/provider-profile", icon: "✅" },
    { label: "Performance Reports", href: "/booking-history", icon: "📈" },
    { separator: true, label: "", href: "", icon: "" },
    { label: "Sign Out", href: "", icon: "🚪", action: "logout" }
  ];
};
