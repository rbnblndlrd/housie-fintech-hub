
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoBackground from '@/components/common/VideoBackground';
import { ArrowLeft } from 'lucide-react';
import { 
  Bell, 
  Star, 
  Users, 
  MessageSquare, 
  StickyNote,
  Award,
  TrendingUp,
  User
} from 'lucide-react';

const Social = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState('notes');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const notifications = [
    { type: 'review', message: 'New 5-star review from Client A', time: '2 min ago', priority: 'high' },
    { type: 'message', message: 'Message from crew member John', time: '15 min ago', priority: 'medium' },
    { type: 'achievement', message: 'Achievement unlocked: Quality Streak!', time: '1 hour ago', priority: 'high' }
  ];

  const feedbackStats = {
    rating: 4.8,
    connections: 47,
    commendations: 23,
    achievement: '5 Stars Streak'
  };

  const recentReviews = [
    { client: 'Sarah M.', rating: 5, comment: 'Excellent service, very professional!', date: '2 days ago' },
    { client: 'Mike R.', rating: 5, comment: 'Quick response and great quality work.', date: '1 week ago' }
  ];

  const groups = {
    notes: [
      { id: 1, title: 'Client preferences', content: 'Remember Sarah prefers morning appointments', date: '2 days ago' },
      { id: 2, title: 'Route optimization', content: 'Best route through downtown area on Tuesdays', date: '1 week ago' }
    ],
    messages: [
      { id: 1, from: 'John D.', preview: 'Can we reschedule tomorrow\'s job?', time: '5 min ago', unread: true },
      { id: 2, from: 'Emma K.', preview: 'Thanks for the great service!', time: '2 hours ago', unread: false }
    ],
    crews: [
      { id: 1, name: 'Downtown Cleaners', members: 8, activity: 'Active discussion about new client protocols', time: '1 hour ago' },
      { id: 2, name: 'Weekend Warriors', members: 12, activity: 'Planning this weekend\'s schedule', time: '3 hours ago' }
    ],
    collectives: [
      { id: 1, name: 'Montreal Service Pros', members: 45, activity: 'Sharing tips about winter equipment', time: '2 hours ago' },
      { id: 2, name: 'Quality First Network', members: 23, activity: 'New member introductions', time: '5 hours ago' }
    ]
  };

  return (
    <div className="min-h-screen">
      <VideoBackground />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-white hover:bg-white/10 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Feedback & Social</h1>
                <p className="text-white/90 drop-shadow-lg">Stay connected with your network and track your performance</p>
              </div>
            </div>
          </div>

          {/* Latest Notifications */}
          <Card className="bg-white/95 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Latest Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${
                    notification.priority === 'high' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className={`p-2 rounded-full ${
                      notification.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {notification.type === 'review' ? <Star className="h-4 w-4" /> :
                       notification.type === 'message' ? <MessageSquare className="h-4 w-4" /> :
                       <Award className="h-4 w-4" />}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feedback Section */}
            <div className="space-y-6">
              {/* Feedback Stats */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Feedback Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                        <Star className="h-6 w-6 fill-current" />
                        <span className="text-2xl font-bold">{feedbackStats.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{feedbackStats.connections}</div>
                      <p className="text-sm text-gray-600">Network Connections</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">{feedbackStats.commendations}</div>
                      <p className="text-sm text-gray-600">Commendations</p>
                    </div>
                    <div className="text-center">
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        {feedbackStats.achievement}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">Latest Achievement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {recentReviews.map((review, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{review.client}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social/Groups Section */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeGroup} onValueChange={setActiveGroup}>
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
                    <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                    <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
                    <TabsTrigger value="crews" className="text-xs">Crews</TabsTrigger>
                    <TabsTrigger value="collectives" className="text-xs">Collectives</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="notes" className="space-y-3">
                    {groups.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-2">
                          <StickyNote className="h-4 w-4 text-yellow-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{note.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-2">{note.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="messages" className="space-y-3">
                    {groups.messages.map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg border ${
                        message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{message.from}</h4>
                              {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
                            <p className="text-xs text-gray-500 mt-2">{message.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="crews" className="space-y-3">
                    {groups.crews.map((crew) => (
                      <div key={crew.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-green-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{crew.name}</h4>
                              <Badge variant="outline" className="text-xs">{crew.members} members</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{crew.activity}</p>
                            <p className="text-xs text-gray-500 mt-2">{crew.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="collectives" className="space-y-3">
                    {groups.collectives.map((collective) => (
                      <div key={collective.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{collective.name}</h4>
                              <Badge variant="outline" className="text-xs">{collective.members} members</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{collective.activity}</p>
                            <p className="text-xs text-gray-500 mt-2">{collective.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
