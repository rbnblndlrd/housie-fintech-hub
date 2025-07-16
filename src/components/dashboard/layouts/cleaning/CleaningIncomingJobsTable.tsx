import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, User } from 'lucide-react';

interface CleaningIncomingJobsTableProps {
  bookings: any[];
  loading?: boolean;
}

const CleaningIncomingJobsTable: React.FC<CleaningIncomingJobsTableProps> = ({ 
  bookings, 
  loading = false 
}) => {
  const cleaningBookings = bookings.filter(booking =>
    booking.serviceName?.toLowerCase().includes('clean')
  );

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          Incoming Jobs
          <Badge variant="secondary">{cleaningBookings.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading incoming jobs...
          </div>
        ) : cleaningBookings.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No incoming cleaning jobs
          </div>
        ) : (
          <div className="space-y-3">
            {cleaningBookings.map((booking) => (
              <div key={booking.id} className="fintech-inner-box p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{booking.serviceName}</h3>
                  <Badge variant={booking.status === 'pending' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.provider || 'Customer Name'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.date} at {booking.time}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                    {booking.total_amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-green-600">${booking.total_amount}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">
                    Accept Job
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CleaningIncomingJobsTable;