
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Route, 
  Clock, 
  User, 
  Navigation, 
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

interface JobLocation {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number;
  assignee: string;
  client: string;
  status: 'pending' | 'assigned' | 'in-route' | 'completed';
}

const GPSJobAnalyzer = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedJobs, setSelectedJobs] = useState<JobLocation[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<JobLocation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Get ticket from navigation state if available
  const incomingTicket = location.state?.ticket;

  const [availableJobs] = useState<JobLocation[]>([
    {
      id: '1',
      title: 'Emergency Plumbing Repair',
      address: '123 Rue Sainte-Catherine, Montreal',
      lat: 45.5017,
      lng: -73.5673,
      priority: 'high',
      estimatedDuration: 120,
      assignee: 'Marc Dubois',
      client: 'Marie Tremblay',
      status: 'pending'
    },
    {
      id: '2',
      title: 'HVAC Maintenance',
      address: '456 Rue Sherbrooke, Westmount',
      lat: 45.4848,
      lng: -73.5915,
      priority: 'medium',
      estimatedDuration: 90,
      assignee: 'Sophie Lavoie',
      client: 'Jean Martin',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Electrical Safety Check',
      address: '789 Rue Mont-Royal, Plateau',
      lat: 45.5276,
      lng: -73.5946,
      priority: 'medium',
      estimatedDuration: 60,
      assignee: 'Pierre Gagnon',
      client: 'Claire Dubois',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Kitchen Renovation Consultation',
      address: '321 Rue Wellington, Verdun',
      lat: 45.4580,
      lng: -73.5673,
      priority: 'low',
      estimatedDuration: 45,
      assignee: 'Luc Bouchard',
      client: 'Nathalie Roy',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    // If a ticket was passed from Kanban, auto-select it
    if (incomingTicket) {
      const matchingJob = availableJobs.find(job => job.title === incomingTicket.title);
      if (matchingJob && !selectedJobs.find(job => job.id === matchingJob.id)) {
        setSelectedJobs(prev => [...prev, matchingJob]);
      }
    }
  }, [incomingTicket, availableJobs]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleJobSelect = (job: JobLocation) => {
    if (selectedJobs.find(selected => selected.id === job.id)) {
      setSelectedJobs(prev => prev.filter(selected => selected.id !== job.id));
    } else {
      setSelectedJobs(prev => [...prev, job]);
    }
  };

  const handleOptimizeRoute = async () => {
    if (selectedJobs.length < 2) return;
    
    setIsOptimizing(true);
    // Simulate route optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple optimization: sort by priority then by distance approximation
    const optimized = [...selectedJobs].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return a.lat - b.lat; // Simple distance approximation
    });
    
    setOptimizedRoute(optimized);
    setIsOptimizing(false);
  };

  const handleDispatchRoute = () => {
    if (optimizedRoute.length === 0) return;
    
    console.log('Dispatching optimized route:', optimizedRoute);
    // Here you would dispatch the route to the assigned workers
    alert('Route dispatched successfully!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalDuration = selectedJobs.reduce((total, job) => total + job.estimatedDuration, 0);
  const highPriorityCount = selectedJobs.filter(job => job.priority === 'high').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GPS Job Analyzer</h1>
              <p className="text-gray-600">Route optimization and job dispatching</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/manager')}>
                Back to Manager
              </Button>
              <Button variant="outline" onClick={() => navigate('/kanban')}>
                Back to Kanban
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedJobs.length}</div>
                <div className="text-sm text-gray-600">Selected Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(totalDuration / 60)}h</div>
                <div className="text-sm text-gray-600">Total Duration</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{optimizedRoute.length}</div>
                <div className="text-sm text-gray-600">Route Stops</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Available Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedJobs.find(selected => selected.id === job.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleJobSelect(job)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
                          {job.priority}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{job.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{job.estimatedDuration}min</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Client: {job.client}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Route Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-green-500" />
                  Route Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Navigation className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Select jobs to optimize route</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Selected Jobs */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Selected Jobs ({selectedJobs.length})</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedJobs.map((job, index) => (
                          <div key={job.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{job.title}</div>
                              <div className="text-xs text-gray-600">{job.assignee}</div>
                            </div>
                            <Badge className={`${getPriorityColor(job.priority)} text-xs`}>
                              {job.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optimization Controls */}
                    <div className="border-t pt-4">
                      <Button
                        onClick={handleOptimizeRoute}
                        disabled={selectedJobs.length < 2 || isOptimizing}
                        className="w-full mb-3"
                      >
                        {isOptimizing ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Optimizing Route...
                          </div>
                        ) : (
                          <>
                            <Route className="h-4 w-4 mr-2" />
                            Optimize Route
                          </>
                        )}
                      </Button>

                      {optimizedRoute.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Optimized Route
                          </h4>
                          <div className="space-y-2">
                            {optimizedRoute.map((job, index) => (
                              <div key={job.id} className="flex items-center gap-2 p-2 bg-green-50 rounded border-green-200 border">
                                <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{job.title}</div>
                                  <div className="text-xs text-gray-600">{job.estimatedDuration}min</div>
                                </div>
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={handleDispatchRoute}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Dispatch Route
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSJobAnalyzer;
