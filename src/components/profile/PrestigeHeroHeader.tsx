import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Star, Shield, Zap } from 'lucide-react';

interface PrestigeHeroHeaderProps {
  profile: {
    full_name: string;
    username: string;
    business_name?: string;
    bio?: string;
    profile_image_url?: string;
    verified?: boolean;
    verification_level?: string;
  };
  equippedTitle?: {
    title_name: string;
    icon: string;
    flavor_text: string;
  };
  canonRatio?: number;
  totalStamps: number;
  prestigeTier: number;
}

const PrestigeHeroHeader: React.FC<PrestigeHeroHeaderProps> = ({
  profile,
  equippedTitle,
  canonRatio,
  totalStamps,
  prestigeTier
}) => {
  const getPrestigeBadgeColor = (tier: number) => {
    if (tier >= 5) return 'from-yellow-400 to-orange-600';
    if (tier >= 3) return 'from-purple-400 to-purple-600';
    if (tier >= 2) return 'from-blue-400 to-blue-600';
    return 'from-gray-400 to-gray-600';
  };

  const getCanonRatioColor = (ratio: number) => {
    if (ratio >= 80) return 'text-yellow-400';
    if (ratio >= 60) return 'text-blue-400';
    if (ratio >= 40) return 'text-green-400';
    return 'text-gray-400';
  };

  return (
    <Card className="bg-gradient-to-r from-gray-900/90 to-black/90 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Avatar with Prestige Ring */}
          <div className="relative">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getPrestigeBadgeColor(prestigeTier)} p-1 animate-pulse`}>
              <div className="w-full h-full bg-black rounded-full" />
            </div>
            <Avatar className="h-24 w-24 relative z-10 border-2 border-white/20">
              <AvatarImage src={profile.profile_image_url} />
              <AvatarFallback className="bg-gray-800 text-white text-2xl">
                {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Prestige Tier Badge */}
            <div className="absolute -bottom-2 -right-2 z-20">
              <Badge className={`bg-gradient-to-r ${getPrestigeBadgeColor(prestigeTier)} text-black font-bold px-2 py-1`}>
                P{prestigeTier}
              </Badge>
            </div>
          </div>

          {/* Name, Title, and Stats */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {profile.business_name || profile.full_name}
              </h1>
              <p className="text-xl text-gray-300">@{profile.username}</p>
              
              {/* Equipped Title */}
              {equippedTitle && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl">{equippedTitle.icon}</span>
                  <span className="text-lg font-semibold text-purple-400">
                    {equippedTitle.title_name}
                  </span>
                </div>
              )}
            </div>

            {/* Hero Stats Row */}
            <div className="flex flex-wrap gap-4">
              {/* Canon Ratio Badge */}
              {canonRatio !== undefined && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getCanonRatioColor(canonRatio)}`}>
                      {canonRatio}%
                    </div>
                    <div className="text-xs text-gray-400">Canon Ratio</div>
                  </div>
                </div>
              )}

              {/* Total Stamps */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Star className="h-5 w-5 text-yellow-400" />
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{totalStamps}</div>
                  <div className="text-xs text-gray-400">Stamps</div>
                </div>
              </div>

              {/* Verification Badge */}
              {profile.verified && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 rounded-lg backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-green-400" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-green-400">Verified</div>
                    <div className="text-xs text-gray-400">{profile.verification_level}</div>
                  </div>
                </div>
              )}

              {/* Prestige Level */}
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 rounded-lg backdrop-blur-sm">
                <Crown className="h-5 w-5 text-purple-400" />
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">Tier {prestigeTier}</div>
                  <div className="text-xs text-gray-400">Prestige</div>
                </div>
              </div>
            </div>

            {/* Bio/Description */}
            {profile.bio && (
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Annette Quote Overlay */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-600/20 rounded-full">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-300 italic">
                "Prestige {prestigeTier}, {totalStamps} Canon Stamps, {equippedTitle ? '1 equipped Title' : 'no equipped titles'}... 
                That's {canonRatio && canonRatio >= 70 ? 'history in the making' : 'a solid foundation'}."
              </p>
              <p className="text-xs text-purple-400 mt-1">— Annette, Canon Keeper</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrestigeHeroHeader;