
import React from 'react';
import { NavigationItem } from '@/utils/navigationConfig';
import { Trophy, Star, Crown, TrendingUp, Gift, Award } from 'lucide-react';

export const getLoyaltyMenuItems = (currentRole: 'customer' | 'provider' = 'customer'): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    { label: "Overview", href: "/gamification", icon: <Star className="h-4 w-4" /> },
    { label: "Achievements", href: "/loyalty/achievements", icon: <Trophy className="h-4 w-4" /> },
    { label: "Loyalty Points", href: "/loyalty/points", icon: <Gift className="h-4 w-4" /> },
    { label: "Leaderboards", href: "/loyalty/leaderboards", icon: <Award className="h-4 w-4" /> }
  ];

  // Add provider-specific items
  if (currentRole === 'provider') {
    baseItems.push({
      label: "Territory Control",
      href: "/loyalty/territory",
      icon: <Crown className="h-4 w-4" />
    });
  }

  return baseItems;
};
