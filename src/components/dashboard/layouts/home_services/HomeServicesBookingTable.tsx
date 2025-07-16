import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface HomeServicesBookingTableProps {
  bookings: any[];
  loading?: boolean;
}

const HomeServicesBookingTable: React.FC<HomeServicesBookingTableProps> = ({ 
  bookings, 
  loading = false 
}) => {
  const mockHomeServiceBookings = [
    {
      id: '1',
      service: 'Electrical Repair',
      issue: 'Outlet not working',
      urgency: 'high',
      location: '123 Main St',
      time: '2:00 PM',
      safety_risk: true,
      tools_needed: ['Multimeter', 'Wire strippers', 'Electrical tape']
    },
    {
      id: '2', 
      service: 'Plumbing Fix',
      issue: 'Leaky faucet',
      urgency: 'medium',
      location: '456 Oak Ave',
      time: '4:30 PM',
      safety_risk: false,
      tools_needed: ['Wrench set', 'Plumber\'s putty', 'Teflon tape']
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Service Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading service requests...</div>
        ) : (
          mockHomeServiceBookings.map((booking) => (
            <div key={booking.id} className="fintech-inner-box p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{booking.service}</h3>
                  <p className="text-sm text-muted-foreground">{booking.issue}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getUrgencyColor(booking.urgency)}>
                    {booking.urgency} priority
                  </Badge>
                  {booking.safety_risk && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {booking.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {booking.location}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Required Tools:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.tools_needed.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept Job
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default HomeServicesBookingTable;