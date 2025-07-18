import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, AlertCircle, Play, CheckCircle } from 'lucide-react';

interface CleaningActiveTicketsProps {
  jobs: any[];
}

const CleaningActiveTickets: React.FC<CleaningActiveTicketsProps> = ({ jobs }) => {
  const [allJobs, setAllJobs] = useState(jobs);
  
  // Check for new accepted jobs from map
  useEffect(() => {
    const checkForNewAcceptedJob = () => {
      const lastAcceptedJob = localStorage.getItem('lastAcceptedJob');
      if (lastAcceptedJob) {
        try {
          const jobData = JSON.parse(lastAcceptedJob);
          // Check if this job is already in our list
          const existsInList = allJobs.some(job => job.id === jobData.id);
          if (!existsInList) {
            setAllJobs(prev => [jobData, ...prev]);
            localStorage.removeItem('lastAcceptedJob'); // Clear after adding
          }
        } catch (error) {
          console.error('Error parsing accepted job data:', error);
        }
      }
    };
    
    checkForNewAcceptedJob();
    
    // Check periodically for new jobs
    const interval = setInterval(checkForNewAcceptedJob, 1000);
    return () => clearInterval(interval);
  }, [allJobs]);
  
  // Update jobs when props change
  useEffect(() => {
    setAllJobs(jobs);
  }, [jobs]);
  
  const cleaningJobs = allJobs.filter(job => 
    job.service_subcategory?.toLowerCase().includes('clean') ||
    job.title?.toLowerCase().includes('clean') ||
    job.status === 'confirmed' // Include confirmed jobs from map
  );

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          All Active Tickets
          <Badge variant="secondary">{cleaningJobs.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cleaningJobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No active cleaning jobs at the moment
          </div>
        ) : (
          cleaningJobs.map((job) => (
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
                  <Badge variant={job.priority === 'high' ? 'destructive' : 'default'}>
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