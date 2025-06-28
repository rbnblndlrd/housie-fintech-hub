
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, TrendingUp, Star } from 'lucide-react';

interface ShopPointsWidgetProps {
  communityPoints: number;
  shopPoints: number;
  compact?: boolean;
}

const ShopPointsWidget: React.FC<ShopPointsWidgetProps> = ({ 
  communityPoints, 
  shopPoints, 
  compact = false 
}) => {
  const getTierInfo = (points: number) => {
    if (points >= 500) return { 
      tier: 'Elite', 
      rate: '1.5x', 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      nextTier: null,
      nextTierPoints: null
    };
    if (points >= 100) return { 
      tier: 'Premium', 
      rate: '1.25x', 
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      nextTier: 'Elite',
      nextTierPoints: 500 - points
    };
    if (points >= 50) return { 
      tier: 'Established', 
      rate: '1.0x', 
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      nextTier: 'Premium',
      nextTierPoints: 100 - points
    };
    if (points >= 10) return { 
      tier: 'Growing', 
      rate: '0.75x', 
      color: 'bg-gradient-to-r from-green-400 to-green-600',
      nextTier: 'Established',
      nextTierPoints: 50 - points
    };
    return { 
      tier: 'New', 
      rate: '0.5x', 
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      nextTier: 'Growing',
      nextTierPoints: 10 - points
    };
  };

  const tierInfo = getTierInfo(communityPoints);

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-purple-600" />
          <span className="font-medium text-purple-900">{shopPoints} Shop Points</span>
        </div>
        <Badge className={`${tierInfo.color} text-white text-xs`}>
          {tierInfo.tier} ({tierInfo.rate})
        </Badge>
      </div>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5 text-purple-600" />
          Shop Points Economy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Points Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{communityPoints}</div>
            <div className="text-sm text-gray-600">Community Points</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{shopPoints}</div>
            <div className="text-sm text-gray-600">Shop Points</div>
          </div>
        </div>

        {/* Tier Badge */}
        <div className="text-center">
          <Badge className={`${tierInfo.color} text-white px-4 py-2`}>
            {tierInfo.tier} Tier - {tierInfo.rate} Conversion Rate
          </Badge>
        </div>

        {/* Next Tier Progress */}
        {tierInfo.nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {tierInfo.nextTier}</span>
              <span>{tierInfo.nextTierPoints} points needed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.max(0, Math.min(100, ((communityPoints % 100) / 100) * 100))}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Conversion Formula */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="font-medium mb-1">Conversion Rates:</div>
          <div>New (0-9): 0.5x • Growing (10-49): 0.75x</div>
          <div>Established (50-99): 1.0x • Premium (100-499): 1.25x</div>
          <div>Elite (500+): 1.5x</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopPointsWidget;
