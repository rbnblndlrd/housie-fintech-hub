import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DashboardNotificationDropdownProps {
  className?: string;
}

const DashboardNotificationDropdown: React.FC<DashboardNotificationDropdownProps> = ({
  className = ""
}) => {
  // Dashboard-specific activity data (mirroring what was in Recent Activity widget)
  const dashboardActivities = [
    {
      id: '1',
      type: 'completion',
      message: 'Job completed: Kitchen repair - $180',
      time: '5m ago',
      dotColor: 'bg-green-500'
    },
    {
      id: '2', 
      type: 'booking',
      message: 'New booking: Bathroom renovation',
      time: '12m ago',
      dotColor: 'bg-blue-500'
    },
    {
      id: '3',
      type: 'payment',
      message: 'Payment received: $120.00',
      time: '25m ago',
      dotColor: 'bg-emerald-500'
    },
    {
      id: '4',
      type: 'review',
      message: 'New 5-star review from John Smith',
      time: '1h ago',
      dotColor: 'bg-yellow-500'
    }
  ];

  return (
    <Card className={`fintech-card shadow-xl border-0 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-800 text-base">Dashboard Notifications</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-80">
          <div className="space-y-2">
            {dashboardActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-white/60 rounded hover:bg-white/80 transition-colors cursor-pointer"
              >
                <div className={`w-2 h-2 ${activity.dotColor} rounded-full flex-shrink-0`}></div>
                <span className="text-sm flex-1">{activity.message}</span>
                <Badge variant="outline" className="ml-auto text-xs">{activity.time}</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DashboardNotificationDropdown;