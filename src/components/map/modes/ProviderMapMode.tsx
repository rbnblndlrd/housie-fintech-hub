
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Clock, 
  Users,
  Award,
  MapPin
} from 'lucide-react';

interface ProviderMapModeProps {
  onAcceptJob: (jobId: string) => void;
  emergencyJobs: any[];
  earningsPotential: string;
  territoryRank: number;
  competitionLevel: string;
}

const ProviderMapMode: React.FC<ProviderMapModeProps> = ({
  onAcceptJob,
  emergencyJobs,
  earningsPotential,
  territoryRank,
  competitionLevel
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showHeatZones, setShowHeatZones] = useState(true);

  return (
    <div className="space-y-4">
      {/* Accept Jobs Floating Action */}
      <div className="fixed bottom-6 right-6 z-20">
        <Button
          size="lg"
          className="h-14 px-6 bg-green-600 hover:bg-green-700 shadow-lg"
          disabled={!isAvailable}
        >
          <Zap className="h-5 w-5 mr-2" />
          Accept Jobs
        </Button>
      </div>

      {/* Provider Status */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Target className="h-5 w-5" />
            Provider Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Available for Jobs</span>
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show Heat Zones</span>
            <Switch
              checked={showHeatZones}
              onCheckedChange={setShowHeatZones}
            />
          </div>
        </CardContent>
      </Card>

      {/* Earnings & Performance */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today's Potential</span>
              <span className="text-lg font-bold text-green-600">{earningsPotential}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Territory Rank</span>
              <Badge variant={territoryRank <= 10 ? "default" : "secondary"}>
                #{territoryRank}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Competition Level</span>
              <Badge variant={competitionLevel === 'low' ? 'default' : competitionLevel === 'medium' ? 'secondary' : 'destructive'}>
                {competitionLevel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Job Opportunities */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Emergency Jobs
            {emergencyJobs.length > 0 && (
              <Badge variant="destructive">{emergencyJobs.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emergencyJobs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No urgent jobs available right now
            </p>
          ) : (
            <div className="space-y-3">
              {emergencyJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{job.title}</h4>
                    <span className="text-sm font-bold text-green-600">{job.price}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.zone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.timePosted}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onAcceptJob(job.id)}
                  >
                    Accept Job
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Territory Management */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Territory Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">15</div>
              <div className="text-xs text-gray-500">Jobs This Week</div>
            </div>
            <div>
              <div className="text-lg font-bold">4.8★</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderMapMode;
