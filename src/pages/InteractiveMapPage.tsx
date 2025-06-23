
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
import { 
  ArrowLeft, 
  Shield,
  Search,
  Briefcase
} from 'lucide-react';

const InteractiveMapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { emergencyJobs, liveStats, loading, error, acceptEmergencyJob } = usePrivacyEmergencyJobs();
  
  // Role-based dashboard navigation
  const dashboardPath = currentRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard';
  
  // Role-based page titles and branding
  const pageTitle = currentRole === 'provider' ? 'Find Work Opportunities' : 'Find Services';
  const pageSubtitle = currentRole === 'provider' 
    ? 'Discover jobs, manage territory, and grow your business'
    : 'Connect with trusted service providers in Montreal';

  const handlePostJob = () => {
    // Navigate to job posting flow
    console.log('Opening job posting flow...');
    // TODO: Implement job posting modal or navigation
  };

  const handleAcceptJob = async (jobId: string) => {
    const success = await acceptEmergencyJob(jobId);
    if (success) {
      console.log('Job accepted successfully');
    }
  };

  const handleProviderMessage = (providerId: string) => {
    console.log('Opening message to provider:', providerId);
    // TODO: Implement messaging functionality
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
              
              {/* Role Indicator Badge */}
              <Badge 
                variant={currentRole === 'provider' ? 'default' : 'secondary'}
                className="text-sm py-2 px-4"
              >
                {currentRole === 'provider' ? '🔧 Provider Mode' : '🏠 Customer Mode'}
              </Badge>
            </div>

            {/* Privacy Notice Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-800">Privacy-First Location System</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    {currentRole === 'provider' 
                      ? 'Your location is anonymized • Job details revealed upon acceptance • Territory data aggregated for privacy'
                      : 'Provider locations are anonymized • Service areas shown as coverage zones • Privacy protected throughout booking process'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Map Section */}
            <div className="lg:col-span-2">
              <Card className="fintech-card h-[600px] relative">
                <CardContent className="p-0 h-full">
                  <PrivacyInteractiveJobsMap />
                  
                  {/* Shared Features Overlay */}
                  <SharedMapFeatures
                    currentRole={currentRole}
                    emergencyNotifications={emergencyJobs.length}
                    liveStats={liveStats}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Role-Based Side Panel */}
            <div className="space-y-6">
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
