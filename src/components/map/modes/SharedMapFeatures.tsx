
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Clock, Users } from 'lucide-react';

interface SharedMapFeaturesProps {
  currentRole: 'customer' | 'provider';
  emergencyNotifications: number;
  liveStats: {
    activeZones: number;
    availableProviders: number;
    avgResponseTime: string;
  };
}

const SharedMapFeatures: React.FC<SharedMapFeaturesProps> = ({
  currentRole,
  emergencyNotifications,
  liveStats
}) => {
  return (
    <>
      {/* Privacy Notice - Always Visible */}
      <div className="absolute top-4 left-4 z-20">
        <Card className="fintech-card max-w-xs">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-1">
              <Shield className="h-4 w-4" />
              Privacy Protected
            </div>
            <p className="text-xs text-blue-600">
              {currentRole === 'customer' 
                ? 'Provider locations are anonymized for your privacy and theirs.'
                : 'Your location and client details are kept private until job acceptance.'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Notifications */}
      {emergencyNotifications > 0 && (
        <div className="absolute top-4 right-20 z-20">
          <Card className="fintech-card border-red-200 bg-red-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {emergencyNotifications} Emergency {emergencyNotifications === 1 ? 'Job' : 'Jobs'}
                </span>
                <Badge variant="destructive" className="ml-2">
                  NEW
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Statistics - Bottom Left */}
      <div className="absolute bottom-20 left-4 z-10">
        <Card className="fintech-card">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-3">Montreal Live Stats</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">
                    {currentRole === 'customer' ? 'Available Providers' : 'Active Providers'}
                  </span>
                </div>
                <span className="text-sm font-medium">{liveStats.availableProviders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Avg Response</span>
                </div>
                <span className="text-sm font-medium text-green-600">{liveStats.avgResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Active Zones</span>
                </div>
                <span className="text-sm font-medium">{liveStats.activeZones}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SharedMapFeatures;
