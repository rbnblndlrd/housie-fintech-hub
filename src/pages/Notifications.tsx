
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Calendar, DollarSign } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      message: 'You have a new cleaning service request for tomorrow at 2 PM',
      time: '5 minutes ago',
      unread: true,
      icon: Calendar
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'Sarah Johnson sent you a message about the plumbing service',
      time: '1 hour ago',
      unread: true,
      icon: MessageSquare
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $85 for the completed lawn mowing service',
      time: '3 hours ago',
      unread: false,
      icon: DollarSign
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Consistent Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Notifications
            </h1>
            <p className="text-gray-600 text-lg">
              Restez informé de toutes vos activités
            </p>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card key={notification.id} className="fintech-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            {notification.unread && (
                              <Badge variant="default" className="bg-blue-500">New</Badge>
                            )}
                            <span className="text-sm text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
