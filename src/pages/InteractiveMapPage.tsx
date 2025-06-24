
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { usePrivacyEmergencyJobs } from '@/hooks/usePrivacyEmergencyJobs';
import Header from "@/components/Header";
import PrivacyInteractiveJobsMap from "@/components/PrivacyInteractiveJobsMap";
import CustomerMapMode from "@/components/map/modes/CustomerMapMode";
import ProviderMapMode from "@/components/map/modes/ProviderMapMode";
import SharedMapFeatures from "@/components/map/modes/SharedMapFeatures";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Shield,
  Search,
  Briefcase,
  Eye,
  EyeOff
} from 'lucide-react';

const InteractiveMapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { emergencyJobs, liveStats, loading, error, acceptEmergencyJob } = usePrivacyEmergencyJobs();
  const [showHeatZones, setShowHeatZones] = useState(true);
  
  // Role-based dashboard navigation
  const dashboardPath = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';
  
  // Role-based page titles and branding
  const pageTitle = currentRole === 'provider' ? 'Find Work Opportunities' : 'Find Services';
  const pageSubtitle = currentRole === 'provider' 
    ? 'Discover jobs, manage territory, and grow your business'
    : 'Connect with trusted service providers in Montreal';

  const handlePostJob = () => {
    console.log('Opening job posting flow...');
  };

  const handleAcceptJob = async (jobId: string) => {
    const success = await acceptEmergencyJob(jobId);
    if (success) {
      console.log('Job accepted successfully');
    }
  };

  const handleProviderMessage = (providerId: string) => {
    console.log('Opening message to provider:', providerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Role-Based Header */}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  {currentRole === 'provider' ? (
                    <Briefcase className="h-8 w-8 text-green-600" />
                  ) : (
                    <Search className="h-8 w-8 text-blue-600" />
                  )}
                  {pageTitle}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>{pageSubtitle}</span>
                </div>
              </div>
              
              <Badge 
                variant={currentRole === 'provider' ? 'default' : 'secondary'}
                className="text-sm py-2 px-4"
              >
                {currentRole === 'provider' ? '🔧 Provider Mode' : '🏠 Customer Mode'}
              </Badge>
            </div>
          </div>

          {/* Privacy Notice Banner - Moved outside map */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-medium text-blue-800">Privacy-First Location System:</span>
                <span className="text-blue-600 ml-2">
                  {currentRole === 'provider' 
                    ? 'Your location is anonymized • Job details revealed upon acceptance • Territory data aggregated'
                    : 'Provider locations are anonymized • Service areas shown as coverage zones • Privacy protected throughout'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Interactive Map Section - Now truly 75% width */}
            <div className="lg:col-span-10">
              <Card className="fintech-card h-[800px] relative">
                <CardContent className="p-2 h-full">
                  <PrivacyInteractiveJobsMap showHeatZones={showHeatZones} />
                  
                  {/* Shared Features Overlay */}
                  <SharedMapFeatures
                    currentRole={currentRole}
                    emergencyNotifications={emergencyJobs.length}
                    liveStats={liveStats}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Role-Based Side Panel - Now 25% width */}
            <div className="lg:col-span-2 space-y-4">
              {/* Heat Zones Control for Providers */}
              {currentRole === 'provider' && (
                <Card className="fintech-card">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {showHeatZones ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        <span className="font-medium text-sm">Heat Zones</span>
                      </div>
                      <Switch
                        checked={showHeatZones}
                        onCheckedChange={setShowHeatZones}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      View market demand by Montreal neighborhood
                    </p>
                  </CardContent>
                </Card>
              )}

              {currentRole === 'customer' ? (
                <CustomerMapMode
                  onPostJob={handlePostJob}
                  availableProviders={liveStats.availableProviders}
                  avgResponseTime={liveStats.avgResponseTime}
                  onProviderMessage={handleProviderMessage}
                />
              ) : (
                <ProviderMapMode
                  onAcceptJob={handleAcceptJob}
                  emergencyJobs={emergencyJobs}
                  earningsPotential="$280-350"
                  territoryRank={7}
                  competitionLevel="medium"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
