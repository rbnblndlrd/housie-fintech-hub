
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Users, 
  Trophy, 
  Zap, 
  ArrowLeft, 
  Heart, 
  Shield, 
  Crown 
} from 'lucide-react';

interface CommunityRewardsPageProps {
  onClose: () => void;
}

export const CommunityRewardsPage: React.FC<CommunityRewardsPageProps> = ({
  onClose
}) => {
  const benefits = [
    {
      icon: Users,
      title: 'Network Connections',
      description: 'Build trusted relationships with quality providers',
      color: 'bg-blue-500'
    },
    {
      icon: Crown,
      title: 'Priority Booking',
      description: 'Get first access to top-rated providers',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Trusted Community',
      description: 'Help maintain service quality for everyone',
      color: 'bg-green-500'
    },
    {
      icon: Trophy,
      title: 'Platform Rewards',
      description: 'Unlock exclusive benefits and discounts',
      color: 'bg-yellow-500'
    }
  ];

  const pointsBreakdown = [
    { action: 'Complete a service', points: '+2 points', icon: '✅' },
    { action: 'Write any review', points: '+1 point', icon: '⭐' },
    { action: 'Give commendations', points: '+1 each', icon: '👍' },
    { action: '5-star review with details', points: '+3 bonus', icon: '🎉' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl">Why Review on HOUSIE?</CardTitle>
              <p className="text-gray-600 mt-1">Build a stronger service community together</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* Community Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Community Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${benefit.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{benefit.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Points System */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              How You Earn Community Points
            </h3>
            <div className="space-y-3">
              {pointsBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.action}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 font-semibold">
                    {item.points}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Commitment */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-3 text-orange-800">
              Your Reviews Matter
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Every review you write helps other customers make informed decisions and helps 
              quality providers build their reputation. Together, we're creating Montreal's 
              most trusted service community.
            </p>
          </div>

          <div className="text-center">
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8"
            >
              Ready to Review!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
