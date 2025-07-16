import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Calendar, FileText } from 'lucide-react';

interface TattooUpcomingAppointmentsProps {
  jobs: any[];
}

const TattooUpcomingAppointments: React.FC<TattooUpcomingAppointmentsProps> = ({ jobs }) => {
  const appointments = jobs.slice(0, 4); // Mock upcoming appointments

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {appointments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 w-full">
              No upcoming appointments
            </div>
          ) : (
            appointments.map((appointment, index) => (
              <div key={appointment.id} className="flex-shrink-0 w-64 fintech-inner-box p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    {index === 0 ? 'Next' : `Day ${index + 1}`}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {appointment.scheduledTime || '2:00 PM'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{appointment.customer || 'Client Name'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{appointment.title || 'Tattoo Session'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">3-4 hours est.</span>
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="w-full mt-3">
                  View Prep Sheet
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooUpcomingAppointments;