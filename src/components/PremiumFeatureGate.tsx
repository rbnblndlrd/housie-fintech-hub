
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Lock, Crown, Zap } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface PremiumFeatureGateProps {
  feature: 'google_calendar' | 'export_import' | 'cross_platform';
  title: string;
  description: string;
  children: React.ReactNode;
  previewMode?: boolean;
}

const PremiumFeatureGate: React.FC<PremiumFeatureGateProps> = ({
  feature,
  title,
  description,
  children,
  previewMode = false
}) => {
  const { isFeatureAvailable, subscriptionData, loading } = useSubscription();

  const handleUpgrade = () => {
    // Navigate to subscription page or trigger checkout
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  const hasAccess = isFeatureAvailable(feature);

  if (hasAccess) {
    return (
      <div className="relative">
        <CreamBadge variant="success" className="absolute -top-2 -right-2 z-10">
          <Crown className="h-3 w-3 mr-1" />
          Pro
        </CreamBadge>
        {children}
      </div>
    );
  }

  return (
    <Card className="fintech-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 backdrop-blur-sm"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            {title}
          </CardTitle>
          <CreamBadge variant="warning">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </CreamBadge>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <p className="text-gray-600 mb-4">{description}</p>
        
        {previewMode && (
          <div className="mb-4 opacity-50 pointer-events-none">
            {children}
          </div>
        )}
        
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold">Débloquez les fonctionnalités Premium</h4>
              <p className="text-sm opacity-90">Synchronisation Google Calendar et plus encore</p>
            </div>
          </div>
          
          <Button
            onClick={handleUpgrade}
            className="w-full bg-white text-orange-600 hover:bg-gray-50 font-semibold"
          >
            Passer à Premium - 15$/mois
          </Button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Version gratuite: Calendrier local • Premium: + Google Calendar sync
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatureGate;
