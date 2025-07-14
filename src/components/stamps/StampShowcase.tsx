import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserStamp } from '@/utils/stampEngine';
import { Pin, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StampShowcaseProps {
  userStamps: UserStamp[];
  variant?: 'full' | 'compact' | 'row';
  showCategories?: boolean;
  maxDisplay?: number;
  onStampClick?: (userStamp: UserStamp) => void;
}

const StampShowcase = ({ 
  userStamps, 
  variant = 'full',
  showCategories = true,
  maxDisplay,
  onStampClick
}: StampShowcaseProps) => {
  const displayStamps = maxDisplay ? userStamps.slice(0, maxDisplay) : userStamps;
  
  const stampsByCategory = displayStamps.reduce((acc, userStamp) => {
    const category = userStamp.stamp?.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(userStamp);
    return acc;
  }, {} as Record<string, UserStamp[]>);

  const getCategoryColor = (category: string) => {
    const colors = {
      Performance: 'from-blue-600 to-cyan-600',
      Loyalty: 'from-green-600 to-emerald-600',
      Crew: 'from-purple-600 to-violet-600',
      Behavior: 'from-yellow-600 to-orange-600',
      Reputation: 'from-red-600 to-pink-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-600 to-slate-600';
  };

  const formatEarnedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const StampCard = ({ userStamp }: { userStamp: UserStamp }) => {
    const stamp = userStamp.stamp;
    if (!stamp) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "cursor-pointer transition-all duration-200",
                variant === 'row' 
                  ? "flex items-center space-x-3 p-3 rounded-lg hover:bg-background/50"
                  : "p-4"
              )}
              onClick={() => onStampClick?.(userStamp)}
            >
              {variant === 'full' ? (
                <Card className="fintech-metric-card hover:scale-105 transition-transform">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl">{stamp.icon}</div>
                      <Badge variant="secondary" className="text-xs">
                        {stamp.category}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{stamp.name}</h3>
                    <p className="text-xs opacity-70 mb-2">{stamp.flavorText}</p>
                    <div className="flex justify-between items-center text-xs opacity-60">
                      <span>Earned {formatEarnedDate(userStamp.earnedAt)}</span>
                      {userStamp.contextData?.trigger_type && (
                        <Badge variant="outline" className="text-xs">
                          {userStamp.contextData.trigger_type}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : variant === 'compact' ? (
                <div className="flex flex-col items-center text-center p-2">
                  <div className="text-3xl mb-1">{stamp.icon}</div>
                  <span className="text-xs font-medium">{stamp.name}</span>
                  <span className="text-xs opacity-60">{formatEarnedDate(userStamp.earnedAt)}</span>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <div className="text-2xl mr-3">{stamp.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{stamp.name}</span>
                      <span className="text-xs opacity-60">{formatEarnedDate(userStamp.earnedAt)}</span>
                    </div>
                    <p className="text-xs opacity-70">{stamp.flavorText}</p>
                  </div>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{stamp.icon}</span>
                <span className="font-bold">{stamp.name}</span>
              </div>
              <p className="text-sm">{stamp.flavorText}</p>
              <div className="flex items-center justify-between text-xs opacity-80">
                <span>{stamp.category}</span>
                <span>Earned {formatEarnedDate(userStamp.earnedAt)}</span>
              </div>
              {userStamp.contextData && Object.keys(userStamp.contextData).length > 0 && (
                <div className="text-xs opacity-70 border-t pt-2">
                  <strong>Context:</strong>{' '}
                  {userStamp.contextData.trigger_type || 'Achievement unlocked'}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (variant === 'row') {
    return (
      <div className="space-y-2">
        {displayStamps.map((userStamp) => (
          <StampCard key={userStamp.id} userStamp={userStamp} />
        ))}
        {maxDisplay && userStamps.length > maxDisplay && (
          <div className="text-center py-2">
            <Badge variant="outline">
              +{userStamps.length - maxDisplay} more stamps
            </Badge>
          </div>
        )}
      </div>
    );
  }

  if (!showCategories) {
    return (
      <div className={cn(
        "grid gap-4",
        variant === 'compact' 
          ? "grid-cols-3 md:grid-cols-6" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {displayStamps.map((userStamp) => (
          <StampCard key={userStamp.id} userStamp={userStamp} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(stampsByCategory).map(([category, stamps]) => (
        <div key={category}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={cn(
              "w-4 h-4 rounded bg-gradient-to-r",
              getCategoryColor(category)
            )} />
            <h3 className="font-bold text-lg">{category}</h3>
            <Badge variant="secondary">{stamps.length}</Badge>
          </div>
          
          <div className={cn(
            "grid gap-4",
            variant === 'compact' 
              ? "grid-cols-3 md:grid-cols-6" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {stamps.map((userStamp) => (
              <StampCard key={userStamp.id} userStamp={userStamp} />
            ))}
          </div>
        </div>
      ))}
      
      {displayStamps.length === 0 && (
        <Card className="fintech-metric-card">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-bold mb-2">No Stamps Yet</h3>
            <p className="text-sm opacity-70">
              Complete jobs and achieve milestones to earn your first stamps!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StampShowcase;