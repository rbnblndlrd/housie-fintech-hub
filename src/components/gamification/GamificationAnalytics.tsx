
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Star, TrendingUp, Target } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

interface GamificationAnalyticsProps {
  userId?: string;
}

const GamificationAnalytics: React.FC<GamificationAnalyticsProps> = ({ userId }) => {
  const { achievements, loyaltyPoints, territoryClaims, leaderboards, loading } = useGamification(userId);

  // Mock data for charts - in production this would come from the database
  const pointsOverTime = [
    { month: 'Jan', points: 120 },
    { month: 'Feb', points: 180 },
    { month: 'Mar', points: 250 },
    { month: 'Apr', points: 320 },
    { month: 'May', points: 450 },
    { month: 'Jun', points: loyaltyPoints?.total_points || 500 }
  ];

  const achievementDistribution = [
    { name: 'Bronze', value: achievements.filter(a => a.achievement_tier === 'bronze').length, color: '#CD7F32' },
    { name: 'Silver', value: achievements.filter(a => a.achievement_tier === 'silver').length, color: '#C0C0C0' },
    { name: 'Gold', value: achievements.filter(a => a.achievement_tier === 'gold').length, color: '#FFD700' },
    { name: 'Platinum', value: achievements.filter(a => a.achievement_tier === 'platinum').length, color: '#E5E4E2' },
    { name: 'Diamond', value: achievements.filter(a => a.achievement_tier === 'diamond').length, color: '#B9F2FF' }
  ];

  const nextTierProgress = loyaltyPoints ? {
    current: loyaltyPoints.total_points,
    target: getNextTierThreshold(loyaltyPoints.tier_level),
    percentage: Math.min((loyaltyPoints.total_points / getNextTierThreshold(loyaltyPoints.tier_level)) * 100, 100)
  } : null;

  function getNextTierThreshold(currentTier: string) {
    const thresholds = {
      bronze: 1000,
      silver: 2500,
      gold: 5000,
      platinum: 10000,
      diamond: Infinity
    };
    return thresholds[currentTier.toLowerCase() as keyof typeof thresholds] || 1000;
  }

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="fintech-card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loyaltyPoints?.total_points?.toLocaleString() || '0'}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-purple-600">{achievements.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Tier</p>
                <p className="text-2xl font-bold text-green-600 capitalize">
                  {loyaltyPoints?.tier_level || 'Bronze'}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Territories</p>
                <p className="text-2xl font-bold text-orange-600">{territoryClaims.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points Over Time */}
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Points Earned Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pointsOverTime}>
                <defs>
                  <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#pointsGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Achievement Distribution */}
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Achievement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={achievementDistribution.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {achievementDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {achievementDistribution.filter(item => item.value > 0).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      {nextTierProgress && nextTierProgress.target !== Infinity && (
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Progress to Next Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Current: {loyaltyPoints?.tier_level.toUpperCase()}</span>
                <span>{nextTierProgress.current} / {nextTierProgress.target} points</span>
              </div>
              <Progress value={nextTierProgress.percentage} className="h-3" />
              <p className="text-sm text-gray-600">
                {nextTierProgress.target - nextTierProgress.current} points needed for next tier
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GamificationAnalytics;
