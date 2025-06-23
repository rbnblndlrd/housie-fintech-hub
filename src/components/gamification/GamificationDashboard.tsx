
import React from 'react';
import { useGamification } from '@/hooks/useGamification';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AchievementBadge from './AchievementBadge';
import LoyaltyPointsWidget from './LoyaltyPointsWidget';
import TerritoryMap from './TerritoryMap';
import LeaderboardWidget from './LeaderboardWidget';
import { Trophy, Star, Crown, Target } from 'lucide-react';

const GamificationDashboard: React.FC = () => {
  const { currentRole } = useRole();
  const { 
    achievements, 
    loyaltyPoints, 
    territoryClaims, 
    leaderboards, 
    loading, 
    claimTerritory,
    awardPoints 
  } = useGamification();

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading gamification data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="fintech-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>
        
        <Card className="fintech-card">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {loyaltyPoints?.available_points || 0}
            </div>
            <div className="text-sm text-gray-600">Available Points</div>
          </CardContent>
        </Card>

        {currentRole === 'provider' && (
          <>
            <Card className="fintech-card">
              <CardContent className="p-4 text-center">
                <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{territoryClaims.length}</div>
                <div className="text-sm text-gray-600">Territories</div>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {leaderboards.find(l => l.rank_position <= 10)?.rank_position || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Best Rank</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          {currentRole === 'provider' && (
            <TabsTrigger value="territory">Territory</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoyaltyPointsWidget loyaltyPoints={loyaltyPoints} />
            <LeaderboardWidget leaderboards={leaderboards} />
          </div>
          
          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.slice(0, 4).map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <Card className="fintech-card">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No achievements yet</p>
                <p className="text-sm text-gray-400">Complete bookings and provide great service to earn achievements!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <LoyaltyPointsWidget 
            loyaltyPoints={loyaltyPoints}
            onSpendPoints={(amount) => {
              console.log(`Spending ${amount} points`);
              // Implement point spending logic
            }}
          />
          
          {/* Point earning opportunities */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Ways to Earn Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">Complete a booking</span>
                  <span className="font-medium text-blue-600">+50 points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Write a detailed review</span>
                  <span className="font-medium text-green-600">+25 points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm">Refer a friend</span>
                  <span className="font-medium text-purple-600">+100 points</span>
                </div>
                {currentRole === 'provider' && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm">Claim territory</span>
                    <span className="font-medium text-orange-600">+100 points</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {currentRole === 'provider' && (
          <TabsContent value="territory" className="space-y-6">
            <TerritoryMap 
              territoryClaims={territoryClaims}
              onClaimTerritory={claimTerritory}
            />
            
            <LeaderboardWidget 
              leaderboards={leaderboards.filter(l => l.leaderboard_type === 'territory_control')}
              title="Territory Leaderboards"
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
