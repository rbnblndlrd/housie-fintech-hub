
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, AlertCircle, Play, CheckCircle } from 'lucide-react';
import { useActiveBookings } from '@/hooks/useActiveBookings';

interface CleaningActiveTicketsProps {
  jobs?: any[]; // Keep for backwards compatibility but we'll use real data
}

const CleaningActiveTickets: React.FC<CleaningActiveTicketsProps> = ({ jobs = [] }) => {
  const { bookings, loading, error, refetch } = useActiveBookings();
  
  // Filter for cleaning-related jobs or show all active bookings
  const activeJobs = bookings.filter(booking => 
    booking.service_subcategory?.toLowerCase().includes('clean') ||
    booking.title?.toLowerCase().includes('clean') ||
    booking.status === 'confirmed' ||
    booking.status === 'in_progress'
  );

  // Auto-refresh when component mounts to catch newly accepted jobs
  useEffect(() => {
    refetch();
  }, []);

  // Listen for job acceptance events
  useEffect(() => {
    const handleJobAccepted = () => {
      console.log('Job accepted event detected, refreshing active tickets');
      setTimeout(refetch, 1000); // Delay to ensure database is updated
    };

    // Listen for custom events from job acceptance
    window.addEventListener('jobAccepted', handleJobAccepted);
    
    return () => {
      window.removeEventListener('jobAccepted', handleJobAccepted);
    };
  }, [refetch]);

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            All Active Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading active tickets...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            All Active Tickets
            <Badge variant="destructive">Error</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-red-600 py-8">
            <p>Failed to load active tickets</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          All Active Tickets
          <Badge variant="secondary">{activeJobs.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeJobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No active jobs at the moment
            <div className="mt-2 text-sm text-gray-500">
              Accept jobs from the map to see them here
            </div>
          </div>
        ) : (
          activeJobs.map((job) => (
            <div key={job.id} className="fintech-inner-box p-4 hover:bg-muted/5 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{job.title}</h3>
                <div className="flex gap-2">
                  {job.status === 'confirmed' && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  )}
                  {job.status === 'in_progress' && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      <Play className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  )}
                  <Badge variant={job.priority === 'high' || job.priority === 'emergency' ? 'destructive' : 'default'}>
                    {job.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {job.scheduledTime || 'Time TBD'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.address || 'Address TBD'}
                </div>
                {job.customer_name && (
                  <div className="flex items-center gap-2 text-xs">
                    <span>Customer: {job.customer_name}</span>
                  </div>
                )}
                {job.acceptedAt && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Accepted {new Date(job.acceptedAt).toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  Parse + Schedule
                </Button>
                <Button size="sm" variant="outline">
                  GPS Route
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CleaningActiveTickets;
