import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, GripVertical } from 'lucide-react';

interface CleaningTodaysRouteProps {
  jobs: any[];
}

const CleaningTodaysRoute: React.FC<CleaningTodaysRouteProps> = ({ jobs }) => {
  const todaysJobs = jobs.slice(0, 3); // Mock today's jobs

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-green-500" />
          Today's Route
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todaysJobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No jobs scheduled for today
          </div>
        ) : (
          <>
            {todaysJobs.map((job, index) => (
              <div key={job.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{job.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {job.scheduledTime || '9:00 AM'}
                    <MapPin className="h-3 w-3" />
                    {job.address?.split(',')[0] || 'Location TBD'}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <Button size="sm" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Optimize Route with GPS
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CleaningTodaysRoute;