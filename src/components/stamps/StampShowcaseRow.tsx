import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { UserStamp } from '@/utils/stampEngine';
import { Sparkles, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StampShowcaseRowProps {
  userId: string;
  stamps: UserStamp[];
  showCanonGlow?: boolean;
  maxDisplay?: number;
}

const StampShowcaseRow: React.FC<StampShowcaseRowProps> = ({
  stamps,
  showCanonGlow = true,
  maxDisplay = 5
}) => {
  const displayStamps = stamps.slice(0, maxDisplay);

  if (displayStamps.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No stamps equipped</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Equipped Stamps</h3>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2">
          {displayStamps.map((userStamp, index) => {
            const stamp = userStamp.stamp;
            if (!stamp) return null;

            const isCanon = userStamp.contextData?.canonVerified || false;
            
            return (
              <TooltipProvider key={userStamp.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-shrink-0">
                      <div className={`
                        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                        ${isCanon && showCanonGlow 
                          ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                        }
                      `}>
                        {/* Stamp Icon */}
                        <div className="text-center">
                          <div className="text-3xl mb-2">
                            {stamp.icon}
                          </div>
                          <div className="text-sm font-medium text-white">
                            {stamp.name}
                          </div>
                        </div>

                        {/* Canon Badge */}
                        {isCanon && showCanonGlow && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-yellow-500 text-black font-bold px-1 py-0.5 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Canon
                            </Badge>
                          </div>
                        )}

                        {/* Glow Effect for Canon Stamps */}
                        {isCanon && showCanonGlow && (
                          <div className="absolute inset-0 rounded-lg bg-yellow-400/5 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="bg-gray-800 border-gray-600 text-white max-w-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{stamp.icon}</span>
                        <span className="font-semibold">{stamp.name}</span>
                        {isCanon && (
                          <Badge className="bg-yellow-500 text-black text-xs">Canon</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-300">
                        {stamp.flavorText || 'Achievement earned through dedication'}
                      </p>
                      
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>Category: {stamp.category}</p>
                        <p>Rarity: <span className="capitalize">{stamp.category}</span></p>
                        <p>
                          Earned: {formatDistanceToNow(new Date(userStamp.earnedAt), { addSuffix: true })}
                        </p>
                        {userStamp.contextData?.narrative && (
                          <p className="italic text-purple-300">
                            "{userStamp.contextData.narrative}"
                          </p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          
          {/* Show remaining count if there are more stamps */}
          {stamps.length > maxDisplay && (
            <div className="flex-shrink-0 flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/30">
              <div className="text-center">
                <div className="text-2xl text-gray-400 mb-2">+</div>
                <div className="text-sm text-gray-400">
                  {stamps.length - maxDisplay} more
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StampShowcaseRow;