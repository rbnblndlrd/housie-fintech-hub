import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { useNavigationPreference } from '@/hooks/useNavigationPreference';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  status: string;
  priority: string;
  amount: number;
  estimated_duration: number;
}

interface JobNavigationCardProps {
  job: Job;
  onStatusUpdate?: (jobId: string, status: string) => void;
}

const JobNavigationCard: React.FC<JobNavigationCardProps> = ({
  job,
  onStatusUpdate
}) => {
  const { navigationPreference, loading } = useNavigationPreference();

  const handleNavigationStart = () => {
    onStatusUpdate?.(job.id, 'en_route');
  };

  const handleNavigationComplete = () => {
    // Navigation complete - could update to 'on_site' or keep current status
  };

  const handleStatusUpdate = (status: 'en_route' | 'on_site' | 'complete') => {
    onStatusUpdate?.(job.id, status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{job.title}</span>
          <Badge className={getPriorityColor(job.priority)}>
            {job.priority}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>${job.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{job.estimated_duration}h</span>
          </div>
        </div>

        {/* Navigation Component */}
        <UnifiedNavigation
          destination={{
            address: job.address,
            lat: job.lat,
            lng: job.lng
          }}
          jobId={job.id}
          navigationPreference={navigationPreference}
          onNavigationStart={handleNavigationStart}
          onNavigationComplete={handleNavigationComplete}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Job Status */}
        <div className="text-center text-sm">
          <Badge variant="outline" className="capitalize">
            Status: {job.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobNavigationCard;
