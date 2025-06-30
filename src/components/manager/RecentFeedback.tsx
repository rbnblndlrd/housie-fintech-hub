
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Award, Bell } from 'lucide-react';

const RecentFeedback: React.FC = () => {
  const navigate = useNavigate();

  const recentItems = [
    { type: 'review', message: 'New 5-star review from Sarah M.', time: '2 min ago', priority: 'high' },
    { type: 'achievement', message: 'Achievement unlocked: Quality Streak!', time: '1 hour ago', priority: 'high' },
    { type: 'message', message: 'Message from John D. about tomorrow\'s job', time: '15 min ago', priority: 'medium' },
    { type: 'review', message: 'Client feedback from Mike R. - Excellent work!', time: '3 hours ago', priority: 'medium' }
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
    <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>💬</span>
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
          {recentItems.map((item, index) => (
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
  );
};

export default RecentFeedback;
