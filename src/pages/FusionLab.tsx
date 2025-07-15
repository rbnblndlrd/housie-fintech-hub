import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFusionStamps } from '@/hooks/useFusionStamps';
import { useStamps } from '@/hooks/useStamps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Zap, Crown, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FusionLab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    definitions, 
    userFusionStamps, 
    loading: fusionLoading, 
    checkFusionEligibility,
    craftFusionStamp 
  } = useFusionStamps();
  const { stamps: userStamps, loading: stampsLoading } = useStamps();
  
  const [selectedFusion, setSelectedFusion] = useState<string | null>(null);
  const [crafting, setCrafting] = useState(false);

  const loading = fusionLoading || stampsLoading;

  const handleCraftFusion = async (fusionId: string) => {
    try {
      setCrafting(true);
      const result = await craftFusionStamp(fusionId) as { voice_line?: string };
      
      toast({
        title: "Fusion Complete! 🌟",
        description: result.voice_line || "Your fusion stamp has been crafted successfully.",
      });

      setSelectedFusion(null);
    } catch (err) {
      toast({
        title: "Fusion Failed",
        description: err instanceof Error ? err.message : "Failed to craft fusion stamp",
        variant: "destructive"
      });
    } finally {
      setCrafting(false);
    }
  };

  const getUserStampNames = (stampIds: string[]) => {
    return stampIds.map(id => {
      const userStamp = userStamps.find(s => s.stamp?.id === id);
      return userStamp?.stamp?.name || id;
    });
  };

  const hasRequiredStamps = (requiredIds: string[]) => {
    const userStampIds = userStamps.map(s => s.stamp?.id).filter(Boolean);
    return requiredIds.every(id => userStampIds.includes(id));
  };

  const isAlreadyCrafted = (fusionId: string) => {
    return userFusionStamps.some(fs => fs.fusion_stamp_id === fusionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Fusion Lab
            </h1>
          </div>
          <p className="text-muted-foreground">
            Combine your earned Stamps into powerful Fusion Stamps. Channel the Canon through synthesis.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* My Fusion Stamps */}
        {userFusionStamps.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              My Fusion Stamps
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userFusionStamps.map((fusionStamp) => (
                <Card key={fusionStamp.id} className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      x{fusionStamp.definition?.canon_multiplier || 1.0}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      {fusionStamp.definition?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {fusionStamp.definition?.flavor_text}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Source Stamps:</p>
                      <div className="flex flex-wrap gap-1">
                        {getUserStampNames(fusionStamp.source_stamp_ids).map((name, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Available Fusion Recipes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Fusion Recipes
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {definitions.map((fusion) => {
              const alreadyCrafted = isAlreadyCrafted(fusion.id);
              const hasStamps = hasRequiredStamps(fusion.required_stamp_ids);
              const canCraft = hasStamps && !alreadyCrafted;

              return (
                <Card 
                  key={fusion.id} 
                  className={`relative overflow-hidden transition-all duration-300 ${
                    canCraft ? 'border-primary/50 hover:border-primary shadow-lg' :
                    alreadyCrafted ? 'border-green-500/50 bg-green-50/5' :
                    'border-border opacity-75'
                  }`}
                >
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant="outline" className="bg-background/80">
                      Tier {fusion.unlockable_at_tier}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      x{fusion.canon_multiplier}
                    </Badge>
                  </div>

                  {alreadyCrafted && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="bg-green-500 text-white">
                        Crafted
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      {fusion.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {fusion.flavor_text}
                    </p>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium mb-2">Required Stamps:</p>
                      <div className="space-y-1">
                        {fusion.required_stamp_ids.map((stampId, idx) => {
                          const hasStamp = userStamps.some(s => s.stamp?.id === stampId);
                          const stampName = userStamps.find(s => s.stamp?.id === stampId)?.stamp?.name || stampId;
                          
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${hasStamp ? 'bg-green-500' : 'bg-muted'}`} />
                              <span className={`text-sm ${hasStamp ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {stampName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleCraftFusion(fusion.id)}
                      disabled={!canCraft || crafting}
                      className="w-full"
                      variant={canCraft ? "default" : "outline"}
                    >
                      {crafting ? "Crafting..." : 
                       alreadyCrafted ? "Already Crafted" :
                       !hasStamps ? "Missing Stamps" :
                       "Craft Fusion"}
                    </Button>

                    {fusion.annette_voice_lines.length > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Annette:</p>
                        <p className="text-sm italic text-primary">
                          "{fusion.annette_voice_lines[0]}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}