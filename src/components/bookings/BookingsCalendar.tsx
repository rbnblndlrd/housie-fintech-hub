import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer, Views, Event } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, MapPin, CheckCircle, Edit, Zap } from 'lucide-react';
import JobParser from '@/components/shared/JobParser';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface BookingEvent extends Event {
  id: string;
  priority: string;
  status: string;
  location: string;
  provider?: string;
  total_amount?: number;
  serviceName: string;
  booking: any;
  start?: Date;
  end?: Date;
  resource?: {
    color: string;
    status: string;
  };
}

interface BookingsCalendarProps {
  bookings: any[];
  loading: boolean;
  onBookingUpdate?: () => void;
}

const BookingsCalendar: React.FC<BookingsCalendarProps> = ({ 
  bookings, 
  loading, 
  onBookingUpdate 
}) => {
  const [view, setView] = useState<string>(Views.WEEK);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'emergency': return 'hsl(var(--destructive))';
      case 'high': return 'hsl(var(--warning))';
      case 'medium': return 'hsl(var(--primary))';
      case 'low': return 'hsl(var(--muted))';
      default: return 'hsl(var(--secondary))';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'hsl(var(--success))';
      case 'pending': return 'hsl(var(--warning))';
      case 'completed': return 'hsl(var(--primary))';
      case 'in_progress': return 'hsl(var(--accent))';
      default: return 'hsl(var(--muted))';
    }
  };

  const events: BookingEvent[] = useMemo(() => {
    const filteredBookings = showCompleted ? bookings : bookings.filter(b => b.status !== 'completed');
    
    return filteredBookings.map(booking => {
      const startDate = moment(`${booking.date} ${booking.time}`, 'YYYY-MM-DD HH:mm').toDate();
      const endDate = moment(startDate).add(booking.duration_hours || 2, 'hours').toDate();
      
      return {
        id: booking.id,
        title: booking.serviceName,
        start: startDate,
        end: endDate,
        priority: booking.priority || 'medium',
        status: booking.status,
        location: booking.location,
        provider: booking.provider,
        total_amount: booking.total_amount,
        serviceName: booking.serviceName,
        booking: booking,
        resource: {
          color: getPriorityColor(booking.priority || 'medium'),
          status: booking.status
        }
      };
    });
  }, [bookings, showCompleted]);

  const handleSelectEvent = useCallback((event: BookingEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleEventDrop = useCallback(async ({ event, start, end }: any) => {
    try {
      const newDate = moment(start).format('YYYY-MM-DD');
      const newTime = moment(start).format('HH:mm');
      
      const { error } = await supabase
        .from('bookings')
        .update({
          scheduled_date: newDate,
          scheduled_time: newTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id);

      if (error) {
        toast.error('Failed to reschedule booking');
        return;
      }

      toast.success('Booking rescheduled successfully');
      onBookingUpdate?.();
    } catch (error) {
      toast.error('Failed to reschedule booking');
    }
  }, [onBookingUpdate]);

  const eventStyleGetter = useCallback((event: BookingEvent) => {
    return {
      style: {
        backgroundColor: event.resource?.color || getPriorityColor(event.priority),
        border: `2px solid ${getStatusColor(event.status)}`,
        borderRadius: '6px',
        color: 'white',
        fontSize: '12px',
        padding: '2px 4px'
      }
    };
  }, []);

  const CustomEvent = ({ event }: { event: BookingEvent }) => (
    <div className="text-xs">
      <div className="font-semibold truncate">{event.serviceName}</div>
      <div className="opacity-80 truncate">{event.location}</div>
    </div>
  );

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">Loading calendar...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="fintech-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              Calendar View
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show Completed</span>
                <Switch
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={view === Views.WEEK ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView(Views.WEEK)}
                >
                  Week
                </Button>
                <Button
                  variant={view === Views.MONTH ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView(Views.MONTH)}
                >
                  Month
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[600px] bg-background rounded-lg">
            <style>{`
              .rbc-calendar {
                background: transparent;
                color: hsl(var(--foreground));
              }
              .rbc-header {
                background: hsl(var(--muted));
                color: hsl(var(--foreground));
                border-bottom: 1px solid hsl(var(--border));
                padding: 8px;
                font-weight: 600;
              }
              .rbc-time-view .rbc-time-gutter {
                background: hsl(var(--muted));
                border-right: 1px solid hsl(var(--border));
              }
              .rbc-time-slot {
                border-top: 1px solid hsl(var(--border));
              }
              .rbc-day-slot {
                border-left: 1px solid hsl(var(--border));
              }
              .rbc-today {
                background: hsl(var(--accent) / 0.1);
              }
              .rbc-toolbar {
                margin-bottom: 16px;
              }
              .rbc-toolbar button {
                background: hsl(var(--secondary));
                color: hsl(var(--secondary-foreground));
                border: 1px solid hsl(var(--border));
                padding: 8px 16px;
                border-radius: 6px;
                margin: 0 2px;
              }
              .rbc-toolbar button:hover {
                background: hsl(var(--secondary) / 0.8);
              }
              .rbc-toolbar button.rbc-active {
                background: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
              }
              .rbc-event {
                cursor: pointer;
              }
            `}</style>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view as any}
              onView={setView}
              onSelectEvent={handleSelectEvent}
              onEventDrop={handleEventDrop}
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent
              }}
              draggableAccessor={() => true}
              resizable={false}
              popup
              selectable
              step={30}
              timeslots={2}
              min={moment().hour(7).minute(0).toDate()}
              max={moment().hour(22).minute(0).toDate()}
            />
          </div>
          
          {/* Mobile optimization - show legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: getPriorityColor('emergency') }}></div>
              <span>Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: getPriorityColor('high') }}></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: getPriorityColor('medium') }}></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: getPriorityColor('low') }}></div>
              <span>Low Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{selectedEvent.serviceName}</h3>
                <Badge className={`${selectedEvent.priority === 'emergency' ? 'bg-red-600' : 
                  selectedEvent.priority === 'high' ? 'bg-orange-600' : 
                  selectedEvent.priority === 'medium' ? 'bg-blue-600' : 'bg-gray-600'} text-white`}>
                  {selectedEvent.priority}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedEvent.start ? moment(selectedEvent.start).format('MMMM Do, YYYY [at] h:mm A') : 'Time not set'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedEvent.location}
                </div>
                {selectedEvent.provider && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {selectedEvent.provider}
                  </div>
                )}
                {selectedEvent.total_amount && (
                  <div className="text-sm font-medium text-green-600">
                    ${selectedEvent.total_amount}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <JobParser
                  job={{
                    id: selectedEvent.id,
                    service_type: selectedEvent.serviceName,
                    customer_name: 'Customer',
                    address: selectedEvent.location,
                    priority: selectedEvent.priority,
                    status: selectedEvent.status
                  }}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingsCalendar;