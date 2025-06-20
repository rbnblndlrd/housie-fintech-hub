
import React from 'react';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Crown, Star, Zap } from 'lucide-react';

interface User {
  can_provide?: boolean;
  provider_profile?: {
    verified?: boolean;
  };
  subscription_tier?: string;
}

export const getStatusBadge = (user: User) => {
  if (user.can_provide && user.provider_profile) {
    if (user.provider_profile.verified) {
      return <CreamBadge variant="success">Prestataire Vérifié</CreamBadge>;
    } else {
      return <CreamBadge variant="warning">Prestataire En Attente</CreamBadge>;
    }
  }
  return <CreamBadge variant="info">Client</CreamBadge>;
};

export const getTypeBadge = (user: User) => {
  return user.can_provide 
    ? <CreamBadge variant="default">Prestataire</CreamBadge>
    : <CreamBadge variant="info">Client</CreamBadge>;
};

export const getSubscriptionBadge = (tier?: string) => {
  // Handle both lowercase and uppercase values from database
  const normalizedTier = tier?.toLowerCase();
  
  switch (normalizedTier) {
    case 'premium':
      return (
        <div className="flex items-center gap-1">
          <Crown className="h-3 w-3 text-yellow-600" />
          <span className="text-yellow-700 font-semibold text-xs bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-full border border-yellow-200">
            Premium
          </span>
        </div>
      );
    case 'pro':
      return (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-purple-600" />
          <span className="text-purple-700 font-semibold text-xs bg-gradient-to-r from-purple-100 to-blue-100 px-2 py-1 rounded-full border border-purple-200">
            Pro
          </span>
        </div>
      );
    case 'starter':
      return (
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-blue-600" />
          <span className="text-blue-700 font-semibold text-xs bg-gradient-to-r from-blue-100 to-cyan-100 px-2 py-1 rounded-full border border-blue-200">
            Starter
          </span>
        </div>
      );
    case 'admin':
      return (
        <div className="flex items-center gap-1">
          <Crown className="h-3 w-3 text-red-600" />
          <span className="text-red-700 font-semibold text-xs bg-gradient-to-r from-red-100 to-pink-100 px-2 py-1 rounded-full border border-red-200">
            Admin
          </span>
        </div>
      );
    case 'free':
    default:
      return (
        <span className="text-gray-600 font-semibold text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
          Free
        </span>
      );
  }
};
