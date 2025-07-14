import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFusionTitles } from '@/hooks/useFusionTitles';
import { Crown, Lock, Zap, Star, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const rarityColors = {
  rare: 'from-blue-500/20 to-purple-500/20',
  legendary: 'from-purple-500/20 to-orange-500/20',
  mythic: 'from-orange-500/20 to-red-500/20'
};

const rarityTextColors = {
  rare: 'text-blue-400',
  legendary: 'text-purple-400',
  mythic: 'text-orange-400'
};

export function FusionTitleTracker() {
  const { 
    fusionTitles, 
    userFusionTitles, 
    eligibility, 
    loading, 
    error,
    equipFusionTitle,
    unequipFusionTitle,
    getEquippedTitle,
    getEligibilityForTitle
  } = useFusionTitles();

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Fusion Title Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load fusion titles: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const equippedTitle = getEquippedTitle();

  const handleEquipToggle = async (titleId: string) => {
    const isCurrentlyEquipped = equippedTitle?.title_id === titleId;
    
    try {
      if (isCurrentlyEquipped) {
        await unequipFusionTitle(titleId);
        toast.success('Fusion title unequipped');
      } else {
        await equipFusionTitle(titleId);
        toast.success('Fusion title equipped');
      }
    } catch (err) {
      toast.error('Failed to update fusion title');
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Fusion Title Tracker
          <Badge variant="secondary" className="ml-auto">
            {userFusionTitles.length}/{fusionTitles.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fusionTitles.map((title) => {
          const userTitle = userFusionTitles.find(ut => ut.title_id === title.id);
          const titleEligibility = getEligibilityForTitle(title.id);
          const isUnlocked = !!userTitle;
          const isEquipped = equippedTitle?.title_id === title.id;
          const isEligible = titleEligibility?.eligible || false;

          return (
            <div 
              key={title.id} 
              className={`
                p-4 rounded-lg border transition-all duration-300
                ${isUnlocked 
                  ? `bg-gradient-to-r ${rarityColors[title.rarity as keyof typeof rarityColors]} border-primary/30` 
                  : 'bg-muted/20 border-muted/30'
                }
                ${isEquipped ? 'ring-2 ring-primary/50 shadow-lg' : ''}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{title.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {title.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${rarityTextColors[title.rarity as keyof typeof rarityTextColors]}`}
                      >
                        {title.rarity}
                      </Badge>
                      {isEquipped && (
                        <Badge variant="default" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Equipped
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{title.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                  {isUnlocked && (
                    <Button
                      size="sm"
                      variant={isEquipped ? "default" : "outline"}
                      onClick={() => handleEquipToggle(title.id)}
                      className="min-w-[80px]"
                    >
                      {isEquipped ? (
                        <>
                          <Star className="h-3 w-3 mr-1" />
                          Equipped
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3 mr-1" />
                          Equip
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4" />
                  <span className={titleEligibility?.current_prestige >= title.required_prestige_tier ? 'text-green-400' : 'text-muted-foreground'}>
                    Prestige Tier {title.required_prestige_tier}
                  </span>
                  {titleEligibility && (
                    <span className="text-xs text-muted-foreground">
                      ({titleEligibility.current_prestige}/{title.required_prestige_tier})
                    </span>
                  )}
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">Required Stamps</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {title.required_stamps.map((stampId) => {
                      const isMissing = titleEligibility?.missing_stamps.includes(stampId);
                      return (
                        <Badge 
                          key={stampId} 
                          variant={isMissing ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {stampId.replace('-', ' ')}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Bar */}
                {!isUnlocked && titleEligibility && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>
                        {title.required_stamps.length - titleEligibility.missing_stamps.length}/
                        {title.required_stamps.length + (titleEligibility.current_prestige >= title.required_prestige_tier ? 1 : 0)}
                      </span>
                    </div>
                    <Progress 
                      value={
                        ((title.required_stamps.length - titleEligibility.missing_stamps.length) + 
                         (titleEligibility.current_prestige >= title.required_prestige_tier ? 1 : 0)) / 
                        (title.required_stamps.length + 1) * 100
                      }
                      className="h-2"
                    />
                  </div>
                )}

                {/* Flavor Lines */}
                {isUnlocked && title.flavor_lines.length > 0 && (
                  <div className="mt-3 p-2 bg-primary/5 rounded border-l-2 border-primary/30">
                    <p className="text-sm italic text-primary/80">
                      "{title.flavor_lines[0]}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {fusionTitles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No fusion titles available yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}