
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Globe, 
  MessageSquare, 
  User,
  Star,
  TrendingUp,
  Shield,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Target
} from 'lucide-react';

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const quickActions = [
    {
      id: 'manager',
      title: 'Manager',
      description: 'Calendar & client coordination',
      icon: Calendar,
      onClick: () => navigate('/calendar')
    },
    {
      id: 'map',
      title: 'Interactive Map',
      description: 'GPS overlay & navigation',
      icon: Globe,
      onClick: () => navigate('/interactive-map')
    },
    {
      id: 'network',
      title: 'Feedback & Social',
      description: 'Network links & reviews',
      icon: MessageSquare,
      onClick: () => navigate('/social')
    },
    {
      id: 'profile',
      title: 'Profile & Settings',
      description: 'Profile updates & settings',
      icon: User,
      onClick: () => navigate('/profile')
    }
  ];

  const stats = {
    rating: 4.8,
    links: 47,
    achievements: 'Quality Pro',
    totalJobs: currentRole === 'provider' ? 156 : 23,
    earnings: currentRole === 'provider' ? '$3,450' : null,
    responseTime: currentRole === 'provider' ? '2 hours' : null,
    completionRate: currentRole === 'provider' ? '98%' : null
  };

  const performanceCards = [
    {
      title: 'Your Performance',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
              <span className="text-3xl font-bold text-gray-900">{stats.rating}</span>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              {stats.achievements}
            </Badge>
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Network Links</span>
              <span className="font-bold text-gray-900">{stats.links}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {currentRole === 'provider' ? 'Jobs Completed' : 'Services Booked'}
              </span>
              <span className="font-bold text-gray-900">{stats.totalJobs}</span>
            </div>
            {stats.earnings && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Earnings</span>
                <span className="font-bold text-green-600">{stats.earnings}</span>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  if (currentRole === 'provider') {
    performanceCards.push(
      {
        title: 'Provider Metrics',
        icon: TrendingUp,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="font-bold text-blue-900">{stats.responseTime}</div>
                <div className="text-xs text-blue-700">Avg Response</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="font-bold text-green-900">{stats.completionRate}</div>
                <div className="text-xs text-green-700">Completion Rate</div>
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="font-bold text-purple-900">Top 10%</div>
              <div className="text-xs text-purple-700">Provider Ranking</div>
            </div>
          </div>
        )
      },
      {
        title: 'Earnings Overview',
        icon: DollarSign,
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.earnings}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Jobs</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Payments</span>
                <span className="font-medium text-orange-600">$240</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next Payout</span>
                <span className="font-medium">Jan 15</span>
              </div>
            </div>
          </div>
        )
      }
    );
  } else {
    performanceCards.push(
      {
        title: 'Service Activity',
        icon: TrendingUp,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-900">5</div>
                <div className="text-xs text-blue-700">Active Bookings</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-bold text-green-900">18</div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-bold text-purple-900">$1,250</div>
              <div className="text-xs text-purple-700">Total Spent</div>
            </div>
          </div>
        )
      }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
                </h1>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {currentRole === 'provider' ? 'Service Provider' : 'Customer'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    Montreal, QC
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{stats.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-1">{stats.links}</div>
                  <p className="text-xs text-gray-500">Links</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-1">{stats.totalJobs}</div>
                  <p className="text-xs text-gray-500">{currentRole === 'provider' ? 'Jobs Done' : 'Bookings'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Single Row */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                
                return (
                  <Card 
                    key={action.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-gray-200 hover:border-gray-300"
                    onClick={action.onClick}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-gray-600 text-xs leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Performance Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {performanceCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Card key={index} className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {card.content}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
