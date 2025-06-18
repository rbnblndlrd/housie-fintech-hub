
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Calendar, Crown, Zap, Star } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

const CalendarTierBanner: React.FC = () => {
  const { subscriptionData, loading } = useSubscription();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl mb-6"></div>
      </div>
    );
  }

  const handleUpgrade = () => {
    window.location.href = '/';
  };

  if (subscriptionData.subscribed) {
    return (
      <Card className="fintech-card mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Crown className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">
                  Calendrier Premium Actif
                </h3>
                <p className="text-sm text-green-700">
                  Synchronisation Google Calendar • Import/Export • Accès cross-platform
                </p>
              </div>
            </div>
            <CreamBadge variant="success">
              <Star className="h-3 w-3 mr-1" />
              {subscriptionData.subscription_tier}
            </CreamBadge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">
                Calendrier Gratuit
              </h3>
              <p className="text-sm text-amber-700">
                Calendrier local HOUSIE • Gestion des rendez-vous • Fonctionnalités de base
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreamBadge variant="neutral">
              Gratuit
            </CreamBadge>
            <Button
              onClick={handleUpgrade}
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
            >
              <Zap className="h-4 w-4 mr-1" />
              Passer à Premium
            </Button>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-xs text-amber-600 font-medium">
            🚀 Premium inclut: Google Calendar sync • Import/Export • Multi-platform • Support prioritaire
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarTierBanner;
