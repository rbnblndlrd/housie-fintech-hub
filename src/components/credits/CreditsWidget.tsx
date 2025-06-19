
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Plus, TrendingUp, Clock, Zap } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import CreditPurchaseDialog from './CreditPurchaseDialog';

interface CreditsWidgetProps {
  compact?: boolean;
}

const CreditsWidget: React.FC<CreditsWidgetProps> = ({ compact = false }) => {
  const { credits, isLoading, features } = useCredits();
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  const usagePercentage = credits.total_credits > 0 
    ? Math.min((credits.used_credits / credits.total_credits) * 100, 100)
    : 0;

  const isLowCredits = credits.remaining_credits < 10;
  const isOutOfCredits = credits.remaining_credits === 0;

  if (isLoading) {
    return (
      <Card className="fintech-chart-container">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse bg-gray-200 rounded-full h-10 w-10"></div>
            <div className="space-y-1 flex-1">
              <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="animate-pulse bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <Coins className={`h-5 w-5 ${isLowCredits ? 'text-orange-500' : 'text-green-500'}`} />
          <span className={`font-semibold ${isLowCredits ? 'text-orange-600' : 'text-gray-700'}`}>
            {credits.remaining_credits}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPurchaseDialog(true)}
            className="h-7 px-2"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <CreditPurchaseDialog 
          open={showPurchaseDialog} 
          onOpenChange={setShowPurchaseDialog} 
        />
      </>
    );
  }

  return (
    <>
      <Card className="fintech-chart-container">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${isLowCredits ? 'bg-orange-100' : 'bg-green-100'}`}>
                  <Coins className={`h-6 w-6 ${isLowCredits ? 'text-orange-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Credits</h3>
                  <p className="text-sm text-gray-600">
                    {credits.remaining_credits} of {credits.total_credits} remaining
                  </p>
                </div>
              </div>
              
              <Badge 
                variant={isOutOfCredits ? 'destructive' : isLowCredits ? 'default' : 'default'}
                className={
                  isOutOfCredits 
                    ? '' 
                    : isLowCredits 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                }
              >
                {isOutOfCredits ? 'Empty' : isLowCredits ? 'Low' : 'Active'}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usage</span>
                <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={usagePercentage} 
                className={`h-2 ${isLowCredits ? 'bg-orange-200' : 'bg-green-200'}`}
              />
            </div>

            {isLowCredits && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    {isOutOfCredits ? 'Credits depleted!' : 'Running low on credits'}
                  </span>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  {isOutOfCredits 
                    ? 'Purchase credits to continue using premium AI features.'
                    : 'Consider purchasing more credits to avoid interruption.'
                  }
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              {features.slice(0, 4).map((feature) => (
                <div key={feature.feature_name} className="flex justify-between">
                  <span className="text-gray-600 truncate">
                    {feature.description?.split(' ')[0] || feature.feature_name}:
                  </span>
                  <span className="font-medium">
                    {feature.is_free_tier ? 'Free' : `${feature.credit_cost}c`}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => setShowPurchaseDialog(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Purchase Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreditPurchaseDialog 
        open={showPurchaseDialog} 
        onOpenChange={setShowPurchaseDialog} 
      />
    </>
  );
};

export default CreditsWidget;
