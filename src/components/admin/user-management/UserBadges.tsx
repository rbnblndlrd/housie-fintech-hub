
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

interface User {
  can_provide?: boolean;
  subscription_tier?: string;
  provider_profile?: {
    verified?: boolean;
  };
}

export const getTypeBadge = (user: User) => {
  if (user.can_provide) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
        Prestataire
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
      Client
    </Badge>
  );
};

export const getStatusBadge = (user: User) => {
  if (user.can_provide) {
    if (user.provider_profile?.verified) {
      return (
        <Badge className="bg-green-600 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          Vérifié
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          En attente
        </Badge>
      );
    }
  }
  return (
    <Badge className="bg-green-600 text-white">
      <CheckCircle className="h-3 w-3 mr-1" />
      Actif
    </Badge>
  );
};

export const getSubscriptionBadge = (tier?: string) => {
  switch (tier) {
    case 'premium':
      return <Badge className="bg-gold-600 text-white text-xs">Premium</Badge>;
    case 'pro':
      return <Badge className="bg-blue-600 text-white text-xs">Pro</Badge>;
    case 'starter':
      return <Badge className="bg-green-600 text-white text-xs">Starter</Badge>;
    case 'free':
    default:
      return <Badge variant="outline" className="text-xs">Free</Badge>;
  }
};
