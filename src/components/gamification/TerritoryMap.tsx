
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Crown, Zap, Calendar } from 'lucide-react';

interface TerritoryMapProps {
  territoryClaims: Array<{
    id: string;
    zone_code: string;
    zone_name?: string;
    status: 'claimed' | 'contested' | 'abandoned';
    jobs_completed_in_zone: number;
    territory_score: number;
    claimed_at: string;
  }>;
  onClaimTerritory?: (zoneCode: string) => void;
  availableZones?: Array<{
    zone_code: string;
    zone_name: string;
    demand_level: string;
    pricing_multiplier: number;
  }>;
}

const TerritoryMap: React.FC<TerritoryMapProps> = ({ 
  territoryClaims, 
  onClaimTerritory,
  availableZones = []
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'claimed': return 'bg-green-100 text-green-800 border-green-200';
      case 'contested': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'abandoned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const claimedZoneCodes = territoryClaims.map(claim => claim.zone_code);
  const unclaimedZones = availableZones.filter(zone => !claimedZoneCodes.includes(zone.zone_code));

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-purple-600" />
          Territory Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Claimed Territories */}
        {territoryClaims.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Your Territories ({territoryClaims.length})
            </h4>
            <div className="space-y-2">
              {territoryClaims.map((claim) => (
                <div key={claim.id} className="border rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{claim.zone_name || claim.zone_code}</span>
                      <Badge className={`ml-2 ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{claim.territory_score} pts</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{claim.jobs_completed_in_zone} jobs completed</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(claim.claimed_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Territories */}
        {unclaimedZones.length > 0 && onClaimTerritory && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Available Territories
            </h4>
            <div className="space-y-2">
              {unclaimedZones.slice(0, 5).map((zone) => (
                <div key={zone.zone_code} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{zone.zone_name}</span>
                      <Badge variant="outline" className="ml-2">
                        {zone.demand_level} demand
                      </Badge>
                      <Badge variant="secondary" className="ml-1">
                        {zone.pricing_multiplier}x rate
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => onClaimTerritory(zone.zone_code)}
                      className="fintech-button-primary"
                    >
                      Claim (+100 pts)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Territory Stats */}
        {territoryClaims.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {territoryClaims.length}
                </div>
                <div className="text-xs text-purple-600">Territories</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {territoryClaims.reduce((sum, claim) => sum + claim.jobs_completed_in_zone, 0)}
                </div>
                <div className="text-xs text-purple-600">Total Jobs</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {territoryClaims.reduce((sum, claim) => sum + claim.territory_score, 0)}
                </div>
                <div className="text-xs text-purple-600">Territory Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {territoryClaims.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Crown className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No territories claimed yet</p>
            <p className="text-xs">Start claiming zones to build your empire!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TerritoryMap;
