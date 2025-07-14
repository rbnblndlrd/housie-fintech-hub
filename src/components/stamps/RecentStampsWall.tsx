import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserStamps, UserStamp } from '@/utils/stampEngine';
import { useAuth } from '@/contexts/AuthContext';
import { Users, TrendingUp } from 'lucide-react';

interface RecentStampsWallProps {
  limit?: number;
  showUserInfo?: boolean;
}

const RecentStampsWall = ({ limit = 10, showUserInfo = false }: RecentStampsWallProps) => {
  const { user } = useAuth();
  const [recentStamps, setRecentStamps] = useState<UserStamp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRecentStamps();
    }
  }, [user?.id]);

  const loadRecentStamps = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const stamps = await getUserStamps(user.id);
      setRecentStamps(stamps.slice(0, limit));
    } catch (error) {
      console.error('Error loading recent stamps:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card className="fintech-metric-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Stamps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentStamps.length === 0) {
    return (
      <Card className="fintech-metric-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Stamps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm opacity-70">
              Complete jobs to start earning stamps!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-metric-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Stamps</span>
          </div>
          <Badge variant="secondary">{recentStamps.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentStamps.map((userStamp) => {
            const stamp = userStamp.stamp;
            if (!stamp) return null;

            return (
              <div 
                key={userStamp.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="text-2xl shrink-0">{stamp.icon}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{stamp.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {stamp.category}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-70 truncate">
                    {stamp.flavorText}
                  </p>
                  {showUserInfo && userStamp.contextData?.trigger_type && (
                    <p className="text-xs opacity-60 mt-1">
                      Trigger: {userStamp.contextData.trigger_type}
                    </p>
                  )}
                </div>
                
                <div className="text-right shrink-0">
                  <div className="text-xs opacity-60">
                    {formatTimeAgo(userStamp.earnedAt)}
                  </div>
                  {userStamp.contextData?.distance_km && (
                    <div className="text-xs opacity-50">
                      {userStamp.contextData.distance_km}km
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {recentStamps.length >= limit && (
          <div className="text-center pt-3 border-t mt-3">
            <span className="text-xs opacity-60">
              Showing {limit} most recent stamps
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentStampsWall;