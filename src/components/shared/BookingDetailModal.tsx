import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  CheckCircle,
  Save,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BookingData {
  id: string;
  service_type: string;
  customer_name: string;
  address: string;
  priority: string;
  status: string;
  scheduled_date?: string;
  scheduled_time?: string;
  instructions?: string;
  phone?: string;
  total_amount?: number;
}

interface BookingDetailModalProps {
  booking: BookingData;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedBooking: BookingData) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSave
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(booking.scheduled_date || '');
  const [scheduledTime, setScheduledTime] = useState(booking.scheduled_time || '');
  const [instructions, setInstructions] = useState(booking.instructions || '');
  const [notes, setNotes] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const onSaveToSchedule = async () => {
    if (!user) return;
    
    if (!scheduledDate || !scheduledTime) {
      toast.error('Please set both date and time for scheduling');
      return;
    }

    setIsLoading(true);
    
    try {
      // Update booking status and schedule
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'scheduled',
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          instructions: instructions,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (bookingError) throw bookingError;

      // Create calendar appointment
      const { error: calendarError } = await supabase
        .from('calendar_appointments')
        .insert({
          user_id: user.id,
          title: `${booking.service_type} - ${booking.customer_name}`,
          client_name: booking.customer_name,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          location: booking.address,
          appointment_type: 'service',
          notes: instructions || notes,
          amount: booking.total_amount || 0,
          status: 'confirmed'
        });

      if (calendarError) throw calendarError;

      toast.success('Job successfully scheduled! Added to your calendar.');
      
      // Update parent component
      if (onSave) {
        onSave({
          ...booking,
          status: 'scheduled',
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          instructions
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Schedule job error:', error);
      toast.error('Failed to schedule job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGPS = () => {
    const address = encodeURIComponent(booking.address);
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
    } else {
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
    }
    
    toast.success(`GPS navigation started for ${booking.customer_name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Job Details & Scheduling
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Job Information */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Service:</span>
                    <Badge className={getPriorityColor(booking.priority)}>
                      {booking.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-900 font-medium">{booking.service_type}</p>
                </div>

                <div>
                  <span className="font-medium">Customer:</span>
                  <p className="text-gray-600">{booking.customer_name}</p>
                  {booking.phone && (
                    <p className="text-sm text-gray-500">{booking.phone}</p>
                  )}
                </div>

                <div>
                  <span className="font-medium">Location:</span>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-gray-600 flex-1">{booking.address}</p>
                  </div>
                  <Button
                    onClick={handleStartGPS}
                    size="sm"
                    variant="outline"
                    className="mt-2 flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    Open in Maps
                  </Button>
                </div>

                {booking.total_amount && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-600">
                      ${booking.total_amount}
                    </span>
                  </div>
                )}

                <div>
                  <span className="font-medium">Current Status:</span>
                  <Badge className="ml-2" variant="outline">
                    {booking.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any special instructions or notes for this job..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scheduling */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Job
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scheduled-date">Date</Label>
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="scheduled-time">Time</Label>
                  <Input
                    id="scheduled-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>

                {(!scheduledDate || !scheduledTime) && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div className="text-sm text-amber-700">
                      Please set both date and time to schedule this job.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Private notes for your reference..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>

            {/* Annette's Tips */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-base text-purple-700">Annette's Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-purple-600 space-y-2">
                  <p>💡 Schedule during customer's preferred hours for better reviews</p>
                  <p>📱 Set GPS reminder 15 minutes before appointment</p>
                  <p>⭐ High-priority jobs often lead to bonus tips!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={onSaveToSchedule}
            disabled={isLoading || !scheduledDate || !scheduledTime}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save & Schedule
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;