
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus } from 'lucide-react';
import { useUnifiedCalendarIntegration } from '@/hooks/useUnifiedCalendarIntegration';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

const CalendarPreview: React.FC = () => {
  const navigate = useNavigate();
  const { allEvents, loading } = useUnifiedCalendarIntegration();

  // Get upcoming events for the next 7 days
  const upcomingEvents = allEvents
    .filter(event => event.date >= new Date() && event.date <= addDays(new Date(), 7))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  const getPriorityColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Events
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/calendar')}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No upcoming events</p>
            <Button size="sm" onClick={() => navigate('/calendar')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate('/calendar')}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {event.title}
                    </h4>
                    <Badge className={`text-xs ${getPriorityColor(event.status)}`}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {getDateLabel(event.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    {event.amount > 0 && (
                      <div className="font-medium text-green-600">
                        ${event.amount}
                      </div>
                    )}
                  </div>
                  {event.client && (
                    <p className="text-xs text-gray-500 mt-1">
                      Client: {event.client}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {allEvents.length > 5 && (
              <Button
                variant="ghost"
                className="w-full text-blue-600 hover:text-blue-700"
                onClick={() => navigate('/calendar')}
              >
                View {allEvents.length - 5} more events
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarPreview;
