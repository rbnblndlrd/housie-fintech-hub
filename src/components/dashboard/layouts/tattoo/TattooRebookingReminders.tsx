import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User, MessageCircle } from 'lucide-react';

interface TattooRebookingRemindersProps {
  bookings: any[];
}

const TattooRebookingReminders: React.FC<TattooRebookingRemindersProps> = ({ bookings }) => {
  const reminders = [
    {
      id: 1,
      client: 'Alex Johnson',
      lastSession: '4 weeks ago',
      nextDue: 'This week',
      project: 'Back piece (session 4 of 8)',
      urgency: 'high',
      notes: 'Healing looks great, ready for next session'
    },
    {
      id: 2,
      client: 'Taylor Swift',
      lastSession: '6 weeks ago',
      nextDue: 'Next week',
      project: 'Leg sleeve touch-ups',
      urgency: 'medium',
      notes: 'Touch-up consultation scheduled'
    },
    {
      id: 3,
      client: 'Jordan Martinez',
      lastSession: '2 months ago',
      nextDue: 'Overdue',
      project: 'Chest piece (session 2 of 3)',
      urgency: 'urgent',
      notes: 'Client missed last appointment'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-blue-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          Rebooking Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="fintech-inner-box p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{reminder.client}</span>
              </div>
              <Badge className={getUrgencyColor(reminder.urgency)}>
                {reminder.urgency}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>Last session: {reminder.lastSession}</span>
              </div>
              
              <div className="font-medium text-foreground">
                {reminder.project}
              </div>
              
              <div className="text-muted-foreground">
                <span className="font-medium">Next due:</span> {reminder.nextDue}
              </div>
              
              <div className="p-2 bg-muted/30 rounded text-xs">
                {reminder.notes}
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1">
                Schedule Session
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                Message
              </Button>
            </div>
          </div>
        ))}
        
        {reminders.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No rebooking reminders
          </div>
        )}
        
        <div className="text-center pt-2 border-t">
          <Button size="sm" variant="ghost">
            Auto-send reminder in 30 days
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooRebookingReminders;