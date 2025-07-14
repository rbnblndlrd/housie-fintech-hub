import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStampEvolution } from '@/hooks/useStampEvolution';
import { ArrowRight, Star, Zap } from 'lucide-react';

interface StampEvolutionDisplayProps {
  stampId: string;
  currentName: string;
  currentIcon: string;
  className?: string;
}

export function StampEvolutionDisplay({ 
  stampId, 
  currentName, 
  currentIcon, 
  className = "" 
}: StampEvolutionDisplayProps) {
  const { 
    getEvolutionProgress, 
    getDisplayName, 
    getDisplayIcon, 
    getFlavorText 
  } = useStampEvolution();

  const progress = getEvolutionProgress(stampId);
  const evolvedName = getDisplayName(stampId);
  const evolvedIcon = getDisplayIcon(stampId);
  const flavorText = getFlavorText(stampId);

  // Use evolved display if available, otherwise fallback to current
  const displayName = evolvedName || currentName;
  const displayIcon = evolvedIcon || currentIcon;

  if (!progress) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-lg">{displayIcon}</span>
        <span className="font-medium">{displayName}</span>
      </div>
    );
  }

  const { isMaxLevel, progress: progressPercent, currentCount, requiredCount, nextEvolution } = progress;

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Current State */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{displayIcon}</span>
              <div>
                <span className="font-medium">{displayName}</span>
                {evolvedName && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Evolved
                  </Badge>
                )}
              </div>
            </div>
            
            {!isMaxLevel && (
              <Badge variant="outline" className="text-xs">
                {currentCount}/{requiredCount}
              </Badge>
            )}
          </div>

          {/* Flavor Text */}
          {flavorText && (
            <p className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
              {flavorText}
            </p>
          )}

          {/* Evolution Progress */}
          {!isMaxLevel && nextEvolution && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Next Evolution:</span>
                <ArrowRight className="h-3 w-3" />
                <span className="flex items-center gap-1">
                  <span>{nextEvolution.evolved_icon}</span>
                  <span className="font-medium">{nextEvolution.evolved_name}</span>
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{Math.round(progressPercent * 100)}%</span>
                </div>
                <Progress value={progressPercent * 100} className="h-2" />
              </div>
              
              {nextEvolution.evolved_flavor_text && (
                <p className="text-xs italic text-muted-foreground/70">
                  "{nextEvolution.evolved_flavor_text}"
                </p>
              )}
            </div>
          )}

          {/* Max Level Badge */}
          {isMaxLevel && (
            <div className="flex items-center justify-center p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                <Zap className="h-3 w-3 mr-1" />
                Maximum Evolution
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}