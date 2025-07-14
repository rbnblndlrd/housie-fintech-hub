import React from 'react';
import { AnchorCard } from './AnchorCard';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TodaysRouteAnchor: React.FC = () => {
  // Mock data for today's jobs
  const todaysJobs = [
    { id: 1, location: "Rue Saint-Denis", time: "9:00 AM", status: "next", priority: "high" },
    { id: 2, location: "Avenue du Parc", time: "11:30 AM", status: "scheduled", priority: "medium" },
    { id: 3, location: "Boulevard Saint-Laurent", time: "2:00 PM", status: "scheduled", priority: "low" },
  ];

  return (
    <AnchorCard title="Today's Route" icon={Navigation}>
      <div className="space-y-2 h-full overflow-y-auto">
        {todaysJobs.map((job) => (
          <div 
            key={job.id} 
            className={`p-2 rounded-lg border transition-all duration-200 ${
              job.status === 'next' 
                ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' 
                : 'bg-muted/30 border-border/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className={`h-3 w-3 ${
                  job.status === 'next' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className="text-xs font-medium truncate">{job.location}</span>
              </div>
              <Badge 
                variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'default' : 'secondary'}
                className="text-xs py-0 px-1"
              >
                {job.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{job.time}</span>
              {job.status === 'next' && (
                <Badge variant="default" className="text-xs py-0 px-1 ml-auto">
                  Next
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </AnchorCard>
  );
};