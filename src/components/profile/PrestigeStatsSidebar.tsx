import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserStamp } from '@/utils/stampEngine';
import { 
  Shield, 
  Flame, 
  Briefcase, 
  Radio, 
  Star,
  Trophy,
  MapPin,
  Calendar
} from 'lucide-react';

interface PrestigeStatsSidebarProps {
  profile: {
    full_name: string;
    average_rating?: number;
    total_reviews?: number;
    community_rating_points?: number;
    created_at: string;
  };
  canonRatio?: number;
  canonStreak: number;
  totalBroadcasts: number;
  stamps: UserStamp[];
  equippedTitle?: {
    title_name: string;
    icon: string;
  };
  showEchoFeed?: boolean;
}

const PrestigeStatsSidebar: React.FC<PrestigeStatsSidebarProps> = ({
  profile,
  canonRatio,
  canonStreak,
  totalBroadcasts,
  stamps,
  equippedTitle,
  showEchoFeed = true
}) => {
  // Calculate favorite service types from stamp categories
  const serviceTypes = stamps.reduce((acc, userStamp) => {
    if (userStamp.stamp?.category) {
      acc[userStamp.stamp.category] = (acc[userStamp.stamp.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topServiceTypes = Object.entries(serviceTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([type, count]) => ({ type, count }));

  const getCanonRatioColor = (ratio: number) => {
    if (ratio >= 80) return 'text-yellow-400';
    if (ratio >= 60) return 'text-blue-400';
    if (ratio >= 40) return 'text-green-400';
    return 'text-gray-400';
  };

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Canon Ratio Card */}
      {canonRatio !== undefined && (
        <Card className="bg-gray-900/70 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-400" />
              Canon Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getCanonRatioColor(canonRatio)}`}>
                {canonRatio}%
              </div>
              <p className="text-sm text-gray-400">Canon Ratio</p>
              <Progress 
                value={canonRatio} 
                className="mt-2 h-2" 
              />
            </div>
            
            {canonStreak > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-600/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-white">Canon Streak</span>
                </div>
                <Badge className="bg-orange-500 text-black font-bold">
                  🔥 {canonStreak}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Service Expertise */}
      {topServiceTypes.length > 0 && (
        <Card className="bg-gray-900/70 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-green-400" />
              Service Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topServiceTypes.map(({ type, count }, index) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-yellow-400' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                    }`} />
                    <span className="text-sm text-white capitalize">{type}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {count} stamps
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Stats */}
      <Card className="bg-gray-900/70 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-purple-400" />
            Profile Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.average_rating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Rating</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {profile.average_rating.toFixed(1)} ⭐
                </div>
                <div className="text-xs text-gray-400">
                  {profile.total_reviews || 0} reviews
                </div>
              </div>
            </div>
          )}

          {profile.community_rating_points && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Cred Points</span>
              </div>
              <span className="text-sm font-semibold text-blue-400">
                {profile.community_rating_points.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Member Since</span>
            </div>
            <span className="text-sm text-gray-400">{memberSince}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-300">Total Stamps</span>
            </div>
            <span className="text-sm font-semibold text-purple-400">
              {stamps.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Broadcast Activity */}
      {showEchoFeed && (
        <Card className="bg-gray-900/70 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Radio className="h-5 w-5 text-cyan-400" />
              Canon Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {totalBroadcasts}
              </div>
              <p className="text-sm text-gray-400">Canon Broadcasts</p>
              {totalBroadcasts > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Last activity: Recent
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipped Title Display */}
      {equippedTitle && (
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-400">Active Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl mb-2">{equippedTitle.icon}</div>
              <div className="text-lg font-semibold text-purple-300">
                {equippedTitle.title_name}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrestigeStatsSidebar;