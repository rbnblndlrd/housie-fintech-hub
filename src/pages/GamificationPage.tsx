
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon, Trophy, Star, Crown } from 'lucide-react';

const GamificationPage: React.FC = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="fintech-card max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <GamepadIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Join the Game!</h2>
            <p className="text-gray-600 mb-4">
              Sign in to access achievements, loyalty points, and competitive features.
            </p>
            <Button className="fintech-button-primary">
              Sign In to Play
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
          <GamepadIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">
            {currentRole === 'provider' ? 'Provider' : 'Customer'} Gamification
          </h1>
        </div>
        <p className="text-gray-600">
          {currentRole === 'provider' 
            ? 'Claim territories, earn achievements, and climb the leaderboards!'
            : 'Earn loyalty points, unlock achievements, and enjoy exclusive benefits!'
          }
        </p>
      </div>

      {/* Role-specific info banner */}
      <Card className="fintech-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {currentRole === 'provider' ? (
              <>
                <Crown className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-800">Provider Benefits</h3>
                  <p className="text-sm text-purple-600">
                    Territory control • Performance badges • Earnings leaderboards • Exclusive zones
                  </p>
                </div>
              </>
            ) : (
              <>
                <Star className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">Customer Benefits</h3>
                  <p className="text-sm text-blue-600">
                    Loyalty points • Preferred status • Review rewards • Booking discounts
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard */}
      <GamificationDashboard />
    </div>
  );
};

export default GamificationPage;
