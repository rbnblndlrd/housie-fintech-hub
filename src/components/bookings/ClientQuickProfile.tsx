import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Star, Heart, AlertTriangle, RotateCcw, MapPin } from 'lucide-react';

interface ClientQuickProfileProps {
  client?: {
    name: string;
    rating: number;
    totalJobs: number;
    lastJob?: string;
    isReturning: boolean;
    cancellationRate?: number;
    preferredProvider?: boolean;
    specialNotes?: string[];
  };
}

const ClientQuickProfile: React.FC<ClientQuickProfileProps> = ({
  client = {
    name: "Sarah M.",
    rating: 4.8,
    totalJobs: 7,
    lastJob: "Nov 15, 2024",
    isReturning: true,
    cancellationRate: 5,
    preferredProvider: true,
    specialNotes: ["Prefers morning appointments", "Large dog on property"]
  }
}) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCancellationBadgeColor = (rate: number) => {
    if (rate <= 10) return 'bg-green-100 text-green-700 border-green-200';
    if (rate <= 20) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <Card className="fintech-card border-indigo-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-indigo-600" />
          Client Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Basic Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-700 font-semibold text-sm">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{client.name}</h3>
                <div className="flex items-center gap-2">
                  <Star className={`h-4 w-4 ${getRatingColor(client.rating)}`} />
                  <span className={`text-sm font-medium ${getRatingColor(client.rating)}`}>
                    {client.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({client.totalJobs} jobs)
                  </span>
                </div>
              </div>
            </div>
            
            {client.preferredProvider && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                <Heart className="h-3 w-3 mr-1" />
                Prefers You
              </Badge>
            )}
          </div>

          {/* Returning Client Alert */}
          {client.isReturning && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <RotateCcw className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">You've worked for them before!</p>
                <p className="text-xs text-green-700">
                  Last job: {client.lastJob}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Client Stats */}
        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{client.totalJobs}</div>
              <div className="text-xs text-gray-500">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-semibold text-gray-900">{client.cancellationRate}%</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCancellationBadgeColor(client.cancellationRate || 0)}`}
                >
                  {client.cancellationRate && client.cancellationRate <= 10 ? 'Low' : 
                   client.cancellationRate && client.cancellationRate <= 20 ? 'Med' : 'High'}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">Cancel Rate</div>
            </div>
          </div>
        </div>

        {/* Special Notes */}
        {client.specialNotes && client.specialNotes.length > 0 && (
          <div className="pt-3 border-t">
            <div className="text-sm font-medium text-gray-700 mb-2">Client Notes:</div>
            <div className="space-y-1">
              {client.specialNotes.map((note, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                  <span className="text-sm text-gray-600">{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-3 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              View Full History
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Location Notes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientQuickProfile;