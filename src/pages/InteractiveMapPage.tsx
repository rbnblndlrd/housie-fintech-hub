import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { usePrivacyEmergencyJobs } from '@/hooks/usePrivacyEmergencyJobs';
import Header from "@/components/Header";
import PrivacyInteractiveJobsMap from "@/components/PrivacyInteractiveJobsMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  AlertTriangle,
  Clock,
  DollarSign,
  MapPin,
  Zap,
  TrendingUp,
  Filter,
  CheckCircle,
  Shield
} from 'lucide-react';

const InteractiveMapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { emergencyJobs, liveStats, loading, error, acceptEmergencyJob } = usePrivacyEmergencyJobs();
  const [showEmergencyJobs, setShowEmergencyJobs] = useState(true);
  
  // Determine dashboard path based on current role
  const dashboardPath = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    const success = await acceptEmergencyJob(jobId);
    if (success) {
      console.log('Job accepted successfully');
    } else {
      console.error('Failed to accept job');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(dashboardPath)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Privacy-Protected Interactive Map
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Live Montreal service opportunities with location privacy</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showEmergencyJobs ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowEmergencyJobs(!showEmergencyJobs)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Emergency Jobs
                  {emergencyJobs.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {emergencyJobs.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Privacy Notice Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-800">Privacy-First Location System</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Provider locations are anonymized • Jobs shown as service areas • 
                    Exact addresses revealed only upon job acceptance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="fintech-card h-[600px]">
                <CardContent className="p-0 h-full">
                  <PrivacyInteractiveJobsMap />
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Emergency Jobs Panel */}
              {showEmergencyJobs && (
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Jobs
                      {emergencyJobs.length > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {emergencyJobs.length}
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Live emergency requests with privacy protection
                    </p>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-6">
                        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-gray-600">{error}</p>
                      </div>
                    ) : emergencyJobs.length === 0 ? (
                      <div className="text-center py-6">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-gray-600">No emergency jobs at the moment</p>
                        <p className="text-sm text-gray-500 mt-1">Check back later for urgent requests</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {emergencyJobs.map((job) => (
                          <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{job.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(job.priority)}`}></div>
                                  <span className="text-sm text-gray-600 capitalize">{job.priority} Priority</span>
                                  <Shield className="h-3 w-3 text-blue-500" />
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  ${job.price}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.zone} {/* Show zone instead of exact location */}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job.timePosted}
                              </div>
                            </div>
                            {currentRole === 'provider' && (
                              <Button 
                                size="sm" 
                                className="w-full mt-3"
                                onClick={() => handleAcceptJob(job.id)}
                              >
                                Accept Job
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Live Market Data */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Montreal Zones Data
                  </CardTitle>
                  <p className="text-sm text-gray-600">Real-time zone-based statistics</p>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Active Zones</span>
                        <span className="text-lg font-bold">{liveStats.activeZones}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Anonymous Providers</span>
                        <span className="text-lg font-bold">{liveStats.availableProviders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Avg. Response Time</span>
                        <span className="text-lg font-bold">{liveStats.avgResponseTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Peak Demand Zone</span>
                        <span className="text-sm font-medium">{liveStats.peakDemandZone}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Privacy Controls */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Location anonymization active</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Service area protection enabled</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Zone-based job display</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Shield className="h-4 w-4" />
                      <span>GDPR compliant mapping</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
