
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Zap, Users, Heart, Award } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: {
    achievement_type: string;
    achievement_name: string;
    achievement_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    points_awarded: number;
    unlocked_at: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, size = 'md' }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'speed': return <Zap className="h-4 w-4" />;
      case 'quality': return <Star className="h-4 w-4" />;
      case 'consistency': return <Trophy className="h-4 w-4" />;
      case 'volume': return <Users className="h-4 w-4" />;
      case 'customer_service': return <Heart className="h-4 w-4" />;
      case 'loyalty': return <Award className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (size === 'sm') {
    return (
      <Badge className={`${getTierColor(achievement.achievement_tier)} gap-1`}>
        {getIcon(achievement.achievement_type)}
        {achievement.achievement_name}
      </Badge>
    );
  }

  return (
    <Card className="fintech-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${getTierColor(achievement.achievement_tier)}`}>
            {getIcon(achievement.achievement_type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{achievement.achievement_name}</h4>
              <Badge variant="secondary" className="text-xs">
                {achievement.achievement_tier}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>+{achievement.points_awarded} points</span>
              <span>{formatDate(achievement.unlocked_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadge;
