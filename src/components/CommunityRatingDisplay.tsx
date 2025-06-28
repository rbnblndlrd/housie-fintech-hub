
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, Users, ThumbsUp } from 'lucide-react';
import { useCommunityRating } from '@/hooks/useCommunityRating';

interface CommunityRatingDisplayProps {
  userId: string;
  compact?: boolean;
}

const CommunityRatingDisplay: React.FC<CommunityRatingDisplayProps> = ({ 
  userId, 
  compact = false 
}) => {
  const { communityRating, loading, error } = useCommunityRating(userId);

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !communityRating) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Silver': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      default: return 'bg-gradient-to-r from-amber-600 to-amber-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return '💎';
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      default: return '🥉';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Badge className={`${getTierColor(communityRating.tier)} text-white`}>
          {getTierIcon(communityRating.tier)} {communityRating.tier}
        </Badge>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{communityRating.totalPoints} pts</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="fintech-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${getTierColor(communityRating.tier)} flex items-center justify-center text-white font-bold text-lg`}>
              {getTierIcon(communityRating.tier)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Community Rating</h3>
              <Badge className={`${getTierColor(communityRating.tier)} text-white`}>
                {communityRating.tier} Tier
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{communityRating.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Tier Progress</span>
            <span>{Math.round(communityRating.tierProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getTierColor(communityRating.tier)}`}
              style={{ width: `${Math.min(100, communityRating.tierProgress)}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900">{communityRating.networkConnections}</div>
              <div className="text-xs text-gray-600">Network</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <div>
              <div className="font-medium text-gray-900">{communityRating.totalReviews}</div>
              <div className="text-xs text-gray-600">Reviews</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-green-500" />
            <div>
              <div className="font-medium text-gray-900">{communityRating.qualityCommendations}</div>
              <div className="text-xs text-gray-600">Quality</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-purple-500" />
            <div>
              <div className="font-medium text-gray-900">
                {communityRating.reliabilityCommendations + communityRating.courtesyCommendations}
              </div>
              <div className="text-xs text-gray-600">Service</div>
            </div>
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <strong>{communityRating.tier} Benefits:</strong> {getTierBenefits(communityRating.tier)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getTierBenefits = (tier: string) => {
  switch (tier) {
    case 'Platinum': return 'Priority booking placement, premium support, exclusive opportunities';
    case 'Gold': return 'Enhanced profile visibility, priority customer support';
    case 'Silver': return 'Improved search ranking, verified badge';
    default: return 'Basic community features, path to higher tiers';
  }
};

export default CommunityRatingDisplay;
