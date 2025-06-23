
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardWidgetProps {
  leaderboards: Array<{
    id: string;
    leaderboard_type: string;
    score: number;
    rank_position: number;
    period_start: string;
    period_end: string;
    metadata: any;
  }>;
  title?: string;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ 
  leaderboards, 
  title = "Your Rankings" 
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Award className="h-4 w-4 text-orange-500" />;
    return <Trophy className="h-4 w-4 text-gray-400" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rank <= 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const formatLeaderboardType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatScore = (score: number, type: string) => {
    if (type.includes('earnings')) {
      return `$${score.toLocaleString()}`;
    }
    if (type.includes('rating')) {
      return `${score.toFixed(1)}⭐`;
    }
    if (type.includes('time')) {
      return `${score}min`;
    }
    return score.toLocaleString();
  };

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  if (leaderboards.length === 0) {
    return (
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-500">No rankings yet</p>
          <p className="text-xs text-gray-400">Complete more bookings to appear on leaderboards!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboards.map((entry) => (
          <div key={entry.id} className="border rounded-lg p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getRankIcon(entry.rank_position)}
                <span className="font-medium">
                  {formatLeaderboardType(entry.leaderboard_type)}
                </span>
                <Badge className={getRankColor(entry.rank_position)}>
                  #{entry.rank_position}
                </Badge>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatScore(entry.score, entry.leaderboard_type)}
              </div>
            </div>
            <div className="text-xs text-gray-600">
              {formatPeriod(entry.period_start, entry.period_end)}
            </div>
            
            {/* Additional metadata */}
            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {Object.entries(entry.metadata).map(([key, value]) => (
                  <span key={key} className="mr-3">
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
