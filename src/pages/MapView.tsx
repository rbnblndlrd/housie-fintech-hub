import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, MapPin, Filter, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { UnifiedMapboxMap } from '@/components/UnifiedMapboxMap';
import { montrealProviders } from '@/data/montrealProviders';
import JobParser from '@/components/shared/JobParser';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  service_type: string;
  customer_name: string;
  address: string;
  instructions?: string;
  priority: string;
  status: string;
  coordinates?: { lat: number; lng: number };
  scheduled_date?: string;
  scheduled_time?: string;
}

const MapView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [showCompleted]);

  const fetchJobs = async () => {
    if (!user) return;
    
    try {
      const statusFilter = showCompleted 
        ? ['completed']
        : ['pending', 'confirmed', 'in_progress'];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          service_id,
          customer_id,
          provider_id,
          status,
          priority,
          service_address,
          instructions,
          scheduled_date,
          scheduled_time
        `)
        .in('status', statusFilter)
        .limit(50);

      if (error) throw error;

      // Transform data and add mock coordinates for demonstration
      const transformedJobs: Job[] = data.map((booking, index) => ({
        id: booking.id,
        service_type: 'Service Request',
        customer_name: 'Customer',
        address: booking.service_address || 'Montreal, QC',
        instructions: booking.instructions,
        priority: booking.priority || 'medium',
        status: booking.status,
        scheduled_date: booking.scheduled_date,
        scheduled_time: booking.scheduled_time,
        // Mock coordinates around Montreal for demo
        coordinates: {
          lat: 45.5017 + (Math.random() - 0.5) * 0.1,
          lng: -73.5673 + (Math.random() - 0.5) * 0.1
        }
      }));

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Fallback demo data
      setJobs([
        {
          id: '1',
          service_type: 'Plumbing Repair',
          customer_name: 'Marie Dupuis',
          address: '123 Saint-Catherine St, Montreal',
          priority: 'high',
          status: 'pending',
          coordinates: { lat: 45.5088, lng: -73.5878 }
        },
        {
          id: '2',
          service_type: 'Electrical Work',
          customer_name: 'Jean Tremblay',
          address: '456 Sherbrooke St, Montreal',
          priority: 'medium',
          status: 'confirmed',
          coordinates: { lat: 45.5215, lng: -73.5791 }
        },
        {
          id: '3',
          service_type: 'Cleaning Service',
          customer_name: 'Sophie Martin',
          address: '789 Rue de la Montagne, Montreal',
          priority: 'low',
          status: 'in_progress',
          coordinates: { lat: 45.4972, lng: -73.5747 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleOptimizeRoute = () => {
    toast({
      title: "Route Optimization",
      description: "Annette is calculating the most efficient route for your jobs!",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-background z-50">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="bg-white border-slate-300 shadow-lg text-slate-800 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-lg">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">Show Completed</span>
          <Switch 
            checked={showCompleted} 
            onCheckedChange={setShowCompleted}
          />
        </div>

        <Button
          onClick={handleOptimizeRoute}
          className="bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Route className="h-4 w-4 mr-2" />
          Optimize Route
        </Button>
      </div>

      {/* Annette's Contextual Overlay */}
      <div className="absolute top-20 left-4 z-50 max-w-sm">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              Annette's Map Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-gray-700">
              🗺️ <strong>{jobs.length} jobs</strong> visible on map
            </p>
            {jobs.length >= 3 && (
              <p className="text-blue-700">
                💡 I see {jobs.filter(j => j.address.includes('Montreal')).length} jobs clustered in Montreal - want to group them for efficiency?
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleOptimizeRoute}
              className="w-full mt-2"
            >
              <Bot className="h-3 w-3 mr-1" />
              Ask Annette for Route Tips
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Selected Job Details */}
      {selectedJob && (
        <div className="absolute top-4 right-4 z-50 w-80">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{selectedJob.service_type}</CardTitle>
                <Badge className={getPriorityColor(selectedJob.priority)}>
                  {selectedJob.priority}
                </Badge>
              </div>
              <Badge className={getStatusColor(selectedJob.status)} variant="secondary">
                {selectedJob.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {selectedJob.customer_name}
                </div>
                <p className="text-sm text-gray-500 mt-1">{selectedJob.address}</p>
              </div>
              
              {selectedJob.instructions && (
                <div>
                  <span className="text-sm font-medium">Instructions:</span>
                  <p className="text-sm text-gray-600">{selectedJob.instructions}</p>
                </div>
              )}

              {selectedJob.scheduled_date && (
                <div>
                  <span className="text-sm font-medium">Scheduled:</span>
                  <p className="text-sm text-gray-600">
                    {selectedJob.scheduled_date} at {selectedJob.scheduled_time}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t space-y-2">
                <JobParser
                  job={selectedJob}
                  size="sm"
                  className="w-full"
                  onParseComplete={(analysis) => {
                    toast({
                      title: "Job Analysis Complete",
                      description: `Annette says: "${analysis.recommendations[0]}" - ${analysis.timeEstimate} estimated`,
                    });
                  }}
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedJob(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-full">
        <UnifiedMapboxMap
          center={{ lat: 45.5017, lng: -73.5673 }}
          zoom={12}
          className="w-full h-full"
          providers={montrealProviders}
          mode="interactive"
        />
      </div>

      {/* Job Markers Overlay */}
      {jobs.map((job) => (
        <div
          key={job.id}
          className="absolute z-40 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${50 + (job.coordinates?.lng || 0) * 10}%`,
            top: `${50 - (job.coordinates?.lat || 0) * 10}%`,
          }}
          onClick={() => handleJobSelect(job)}
        >
          <div className={`w-4 h-4 rounded-full ${getPriorityColor(job.priority)} border-2 border-white shadow-lg hover:scale-125 transition-transform`} />
        </div>
      ))}
    </div>
  );
};

export default MapView;