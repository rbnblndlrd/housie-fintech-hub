
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Crown, Gem } from 'lucide-react';

interface LoyaltyPointsWidgetProps {
  loyaltyPoints: {
    total_points: number;
    available_points: number;
    lifetime_earned: number;
    tier_level: string;
    tier_benefits: any;
  } | null;
  onSpendPoints?: (amount: number) => void;
}

const LoyaltyPointsWidget: React.FC<LoyaltyPointsWidgetProps> = ({ 
  loyaltyPoints, 
  onSpendPoints 
}) => {
  if (!loyaltyPoints) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-4 text-center">
          <div className="text-gray-500 text-sm">No loyalty points data</div>
        </CardContent>
      </Card>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return <Star className="h-4 w-4 text-orange-600" />;
      case 'silver': return <Star className="h-4 w-4 text-gray-600" />;
      case 'gold': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'platinum': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'diamond': return <Gem className="h-4 w-4 text-blue-600" />;
      default: return <Star className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextTierThreshold = (currentTier: string) => {
    const thresholds = {
      bronze: 1000,
      silver: 2500,
      gold: 5000,
      platinum: 10000,
      diamond: Infinity
    };
    return thresholds[currentTier.toLowerCase() as keyof typeof thresholds] || 1000;
  };

  const nextTierThreshold = getNextTierThreshold(loyaltyPoints.tier_level);
  const progressPercentage = nextTierThreshold === Infinity ? 100 : 
    Math.min((loyaltyPoints.total_points / nextTierThreshold) * 100, 100);

  return (
    <Card className="fintech-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="h-5 w-5 text-blue-600" />
          Loyalty Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTierIcon(loyaltyPoints.tier_level)}
            <Badge className={getTierColor(loyaltyPoints.tier_level)}>
              {loyaltyPoints.tier_level.toUpperCase()} TIER
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {loyaltyPoints.available_points.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Available Points</div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTierThreshold !== Infinity && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next tier</span>
              <span>{loyaltyPoints.total_points} / {nextTierThreshold}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-lg font-semibold">
              {loyaltyPoints.total_points.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {loyaltyPoints.lifetime_earned.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Lifetime Earned</div>
          </div>
        </div>

        {/* Tier Benefits */}
        {loyaltyPoints.tier_benefits && Object.keys(loyaltyPoints.tier_benefits).length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800 mb-2">Tier Benefits</div>
            <ul className="text-xs text-blue-600 space-y-1">
              {Object.entries(loyaltyPoints.tier_benefits).map(([key, value]) => (
                <li key={key}>• {key}: {String(value)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        {onSpendPoints && loyaltyPoints.available_points > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSpendPoints(100)}
              disabled={loyaltyPoints.available_points < 100}
            >
              Spend 100
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSpendPoints(500)}
              disabled={loyaltyPoints.available_points < 500}
            >
              Spend 500
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsWidget;
