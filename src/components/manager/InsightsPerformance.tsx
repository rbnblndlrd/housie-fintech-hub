
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  Award, 
  Bell, 
  Calendar,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';

const InsightsPerformance: React.FC = () => {
  const navigate = useNavigate();

  const recentFeedback = [
    { type: 'review', message: 'New 5-star review from Sarah M.', time: '2 min ago', priority: 'high' },
    { type: 'achievement', message: 'Achievement unlocked: Quality Streak!', time: '1 hour ago', priority: 'high' },
    { type: 'message', message: 'Message from John D. about tomorrow\'s job', time: '15 min ago', priority: 'medium' },
    { type: 'review', message: 'Client feedback from Mike R. - Excellent work!', time: '3 hours ago', priority: 'medium' }
  ];

  const upcomingAppointments = [
    { id: 1, title: 'Kitchen Renovation Consultation', client: 'Emma Wilson', time: '9:00 AM', date: 'Today' },
    { id: 2, title: 'Plumbing Emergency Call', client: 'Mike Johnson', time: '2:00 PM', date: 'Today' },
    { id: 3, title: 'HVAC Maintenance', client: 'Sarah Connor', time: '10:00 AM', date: 'Tomorrow' }
  ];

  const achievementsProgress = [
    { name: 'Customer Champion', progress: 85, target: 100, description: '15 more 5-star reviews needed' },
    { name: 'Speed Demon', progress: 92, target: 100, description: '8 more quick completions' },
    { name: 'Reliability Master', progress: 78, target: 100, description: '22 more on-time arrivals' }
  ];

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Insights & Performance</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback */}
        <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Recent Feedback
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/social')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentFeedback.map((item, index) => (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                  item.priority === 'high' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}>
                  <div className="p-1 rounded-full bg-white">
                    {getItemIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                  {item.priority === 'high' && (
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                      New
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Latest Activity</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">4.8</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">23 reviews</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Preview */}
        <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Calendar Preview
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/calendar')}
              >
                View Calendar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{appointment.title}</h4>
                    <p className="text-xs text-gray-600">{appointment.client}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{appointment.date}</span>
                      <span>•</span>
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">This Week</span>
                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-medium">12 appointments</span>
                  <span className="text-blue-600 font-medium">85% booked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Progress */}
      <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievementsProgress.map((achievement, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-sm">{achievement.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {achievement.progress}/{achievement.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{achievement.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              View All Achievements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsPerformance;
