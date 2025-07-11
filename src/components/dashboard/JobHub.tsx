import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  Route, 
  Play,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  customer: string;
  address: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed';
  scheduledTime?: string;
  estimatedDuration: string;
  distance?: string;
  lat?: number;
  lng?: number;
}

const JobHub = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Sample scheduled jobs
  const scheduledJobs: Job[] = [
    {
      id: '1',
      title: 'Kitchen Sink Repair',
      customer: 'Marie Dubois',
      address: '1234 Rue Saint-Denis, Montreal, QC',
      priority: 'high',
      status: 'scheduled',
      scheduledTime: '9:00 AM',
      estimatedDuration: '2 hours',
      distance: '1.2 km',
      lat: 45.5088,
      lng: -73.5878
    },
    {
      id: '2',
      title: 'Electrical Outlet Installation',
      customer: 'Jean Tremblay',
      address: '567 Av des Laurentides, Laval, QC',
      priority: 'medium',
      status: 'scheduled',
      scheduledTime: '1:00 PM',
      estimatedDuration: '1.5 hours',
      distance: '8.5 km',
      lat: 45.6066,
      lng: -73.7124
    },
    {
      id: '3',
      title: 'Bathroom Deep Clean',
      customer: 'Sophie Martin',
      address: '890 Boul Roland-Therrien, Longueuil, QC',
      priority: 'low',
      status: 'scheduled',
      scheduledTime: '3:30 PM',
      estimatedDuration: '2 hours',
      distance: '12.3 km',
      lat: 45.5316,
      lng: -73.4918
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleOptimizeRoute = async () => {
    setIsOptimizing(true);
    
    // Simulate route optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsOptimizing(false);
    toast.success('Route optimized! Jobs reordered by proximity and priority.');
  };

  const handleStartGPS = (job: Job) => {
    // Create deep link to native map apps
    const address = encodeURIComponent(job.address);
    
    // Try to detect mobile platform and open native app
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open native map apps with fallback
      const mapsUrls = [
        `https://maps.google.com/maps?q=${address}`,
        `https://maps.apple.com/?q=${address}`,
        `geo:${job.lat || 0},${job.lng || 0}?q=${address}`
      ];
      
      window.open(mapsUrls[0], '_blank');
    } else {
      // Open Google Maps in new tab for desktop
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
    }
    
    toast.success(`GPS navigation started for ${job.customer}`);
  };

  const todaysJobs = scheduledJobs.filter(job => job.status === 'scheduled');
  const completedJobs = scheduledJobs.filter(job => job.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Route Control Panel */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-blue-500" />
            Today's Route Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleOptimizeRoute}
              disabled={isOptimizing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isOptimizing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Route className="h-4 w-4" />
              )}
              {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {todaysJobs.length} jobs • Est. {todaysJobs.reduce((total, job) => total + parseFloat(job.estimatedDuration), 0)} hours
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Jobs */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Today's Schedule ({todaysJobs.length} jobs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No jobs scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="fintech-inner-box p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{job.customer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">{job.scheduledTime}</div>
                      <div className="text-xs text-gray-500">{job.estimatedDuration}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.address}</span>
                    {job.distance && (
                      <Badge variant="outline" className="text-xs">
                        {job.distance}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStartGPS(job)}
                      size="sm"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Navigation className="h-4 w-4" />
                      Start GPS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="fintech-metric-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Scheduled Today
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">{todaysJobs.length}</div>
            <p className="text-sm text-gray-600">Jobs to complete</p>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">{completedJobs.length}</div>
            <p className="text-sm text-gray-600">Jobs finished</p>
          </CardContent>
        </Card>

        <Card className="fintech-metric-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              Est. Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600 mb-1">$425</div>
            <p className="text-sm text-gray-600">Today's potential</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobHub;