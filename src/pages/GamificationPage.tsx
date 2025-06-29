
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import GamificationAnalytics from '@/components/gamification/GamificationAnalytics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon, Trophy, Star, Crown, TrendingUp, BarChart3 } from 'lucide-react';

const GamificationPage: React.FC = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();

  console.log('🎮 GamificationPage render:', { hasUser: !!user, currentRole });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="fintech-card max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <GamepadIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Join the Loyalty Program!</h2>
            <p className="text-gray-600 mb-4">
              Sign in to access achievements, loyalty points, and exclusive rewards.
            </p>
            <Button className="fintech-button-primary">
              Sign In to Start Earning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">
            Loyalty & Rewards Analytics
          </h1>
        </div>
        <p className="text-gray-600">
          {currentRole === 'provider' 
            ? 'Track your performance, territory control, and earnings growth through comprehensive analytics.'
            : 'Monitor your loyalty points, achievements, and rewards progress with detailed insights.'
          }
        </p>
      </div>

      {/* Role-specific info banner */}
      <Card className="fintech-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {currentRole === 'provider' ? (
              <>
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-purple-600" />
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">Provider Performance Dashboard</h3>
                  <p className="text-sm text-purple-600">
                    Territory analytics • Earnings trends • Performance metrics • Competitive rankings
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-blue-600" />
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Customer Loyalty Dashboard</h3>
                  <p className="text-sm text-blue-600">
                    Points tracking • Tier progression • Achievement analytics • Reward optimization
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Dashboard */}
      <GamificationAnalytics />
    </div>
  );
};

export default GamificationPage;
