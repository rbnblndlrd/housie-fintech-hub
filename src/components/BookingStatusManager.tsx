
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  Play, 
  Star, 
  MessageCircle,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingStatusManagerProps {
  booking: {
    id: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    scheduled_date: string;
    scheduled_time: string;
    service_address: string;
    total_amount: number;
    instructions?: string;
    customer: {
      full_name: string;
      phone?: string;
    };
    service: {
      title: string;
    };
  };
  isProvider?: boolean;
  onStatusUpdate?: () => void;
}

const BookingStatusManager: React.FC<BookingStatusManagerProps> = ({
  booking,
  isProvider = false,
  onStatusUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateBookingStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          ...(newStatus === 'completed' && { completed_at: new Date().toISOString() })
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Booking status changed to ${newStatus.replace('_', ' ')}`,
      });

      onStatusUpdate?.();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: Clock,
          label: 'Pending Review'
        };
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: CheckCircle,
          label: 'Confirmed'
        };
      case 'in_progress':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Play,
          label: 'In Progress'
        };
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: CheckCircle,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock,
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const getAvailableActions = () => {
    if (!isProvider) return [];

    switch (booking.status) {
      case 'pending':
        return [
          { action: 'confirmed', label: 'Confirm Booking', variant: 'default' as const },
          { action: 'cancelled', label: 'Decline', variant: 'destructive' as const }
        ];
      case 'confirmed':
        return [
          { action: 'in_progress', label: 'Start Job', variant: 'default' as const }
        ];
      case 'in_progress':
        return [
          { action: 'completed', label: 'Mark Complete', variant: 'default' as const }
        ];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            {booking.service.title}
          </CardTitle>
          <Badge className={`${statusConfig.color} border`}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <span>{booking.service_address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="font-medium">${booking.total_amount}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Customer: </span>
              {booking.customer.full_name}
            </div>
            {booking.customer.phone && (
              <div className="text-sm">
                <span className="font-medium">Phone: </span>
                {booking.customer.phone}
              </div>
            )}
          </div>
        </div>

        {/* Special Instructions */}
        {booking.instructions && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-1">Special Instructions:</h4>
            <p className="text-sm text-gray-700">{booking.instructions}</p>
          </div>
        )}

        {/* Status Actions */}
        {availableActions.length > 0 && (
          <div className="flex gap-2 pt-2 border-t">
            {availableActions.map((action) => (
              <Button
                key={action.action}
                variant={action.variant}
                size="sm"
                onClick={() => updateBookingStatus(action.action)}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Updating...' : action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Completed Status Actions */}
        {booking.status === 'completed' && !isProvider && (
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Leave Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Message Provider
            </Button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>
              {booking.status === 'completed' ? '100%' : 
               booking.status === 'in_progress' ? '75%' :
               booking.status === 'confirmed' ? '50%' : '25%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                booking.status === 'completed' ? 'bg-green-500 w-full' :
                booking.status === 'in_progress' ? 'bg-purple-500 w-3/4' :
                booking.status === 'confirmed' ? 'bg-blue-500 w-1/2' :
                'bg-yellow-500 w-1/4'
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingStatusManager;
