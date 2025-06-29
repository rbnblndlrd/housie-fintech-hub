
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
  Bell,
  Star,
  TrendingUp,
  Shield,
  MapPin
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
      description: 'Calendar, pool management, and client coordination',
      icon: Calendar,
      color: 'from-blue-600 to-indigo-600',
      onClick: () => navigate('/calendar')
    },
    {
      id: 'map',
      title: 'Interactive Map',
      description: 'GPS overlay, navigation, and location management',
      icon: Globe,
      color: 'from-green-600 to-teal-600',
      onClick: () => navigate('/interactive-map')
    },
    {
      id: 'network',
      title: 'Feedback & Social',
      description: 'Network connections, reviews, and social features',
      icon: MessageSquare,
      color: 'from-purple-600 to-pink-600',
      size: 'large',
      onClick: () => navigate('/social')
    },
    {
      id: 'profile',
      title: 'Profile & Settings',
      description: 'Quick profile updates and important settings',
      icon: User,
      color: 'from-orange-600 to-red-600',
      onClick: () => navigate('/profile')
    }
  ];

  const notifications = [
    { type: 'booking', message: 'New booking request from Sarah M.', time: '5 min ago' },
    { type: 'review', message: 'You received a 5-star review!', time: '1 hour ago' },
    { type: 'payment', message: 'Payment of $120 received', time: '2 hours ago' }
  ];

  const stats = {
    rating: 4.8,
    connections: 47,
    achievements: 'Quality Pro',
    totalJobs: currentRole === 'provider' ? 156 : 23,
    earnings: currentRole === 'provider' ? '$3,450' : null
  };

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
                  <div className="font-bold text-gray-900 mb-1">{stats.connections}</div>
                  <p className="text-xs text-gray-500">Connections</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-1">{stats.totalJobs}</div>
                  <p className="text-xs text-gray-500">{currentRole === 'provider' ? 'Jobs Done' : 'Bookings'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                const isLarge = action.size === 'large';
                
                return (
                  <Card 
                    key={action.id}
                    className={`fintech-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                      isLarge ? 'md:col-span-2' : ''
                    }`}
                    onClick={action.onClick}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{action.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Notifications */}
            <Card className="fintech-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {notification.type === 'booking' ? <Calendar className="h-4 w-4" /> :
                         notification.type === 'review' ? <Star className="h-4 w-4" /> :
                         <TrendingUp className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-8 w-8 text-yellow-500 fill-current" />
                      <span className="text-3xl font-bold text-gray-900">{stats.rating}</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {stats.achievements}
                    </Badge>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Network Connections</span>
                      <span className="font-bold text-gray-900">{stats.connections}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
