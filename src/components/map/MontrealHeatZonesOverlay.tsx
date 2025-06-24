
import React, { useState } from 'react';
import { Polygon, InfoWindow } from '@react-google-maps/api';
import { MontrealHeatZone } from '@/data/montrealHeatZones';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, MapPin, DollarSign, Users, Home } from 'lucide-react';

interface MontrealHeatZonesOverlayProps {
  zones: MontrealHeatZone[];
  userRole: 'customer' | 'provider';
  onZoneSelect?: (zone: MontrealHeatZone) => void;
}

const MontrealHeatZonesOverlay: React.FC<MontrealHeatZonesOverlayProps> = ({
  zones,
  userRole,
  onZoneSelect
}) => {
  const [selectedZone, setSelectedZone] = useState<MontrealHeatZone | null>(null);

  const getDemandColor = (demandLevel: string, demandScore: number) => {
    switch (demandLevel) {
      case 'high':
        return {
          fillColor: demandScore > 90 ? '#10b981' : '#22c55e',
          strokeColor: demandScore > 90 ? '#059669' : '#16a34a'
        };
      case 'medium':
        return {
          fillColor: '#f59e0b',
          strokeColor: '#d97706'
        };
      case 'low':
        return {
          fillColor: '#6b7280',
          strokeColor: '#4b5563'
        };
      default:
        return {
          fillColor: '#9ca3af',
          strokeColor: '#6b7280'
        };
    }
  };

  const getZoneOptions = (zone: MontrealHeatZone) => {
    const colors = getDemandColor(zone.demandLevel, zone.demandScore);
    return {
      ...colors,
      fillOpacity: zone.demandLevel === 'high' ? 0.3 : zone.demandLevel === 'medium' ? 0.2 : 0.15,
      strokeOpacity: 0.6,
      strokeWeight: 2,
      clickable: true
    };
  };

  const handleZoneClick = (zone: MontrealHeatZone) => {
    setSelectedZone(zone);
    if (onZoneSelect) {
      onZoneSelect(zone);
    }
  };

  const getTrendingIcon = (trending: 'up' | 'down' | 'stable') => {
    switch (trending) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <>
      {zones.map(zone => (
        <Polygon
          key={zone.id}
          paths={zone.coordinates}
          onClick={() => handleZoneClick(zone)}
          options={getZoneOptions(zone)}
        />
      ))}

      {selectedZone && (
        <InfoWindow
          position={selectedZone.center}
          onCloseClick={() => setSelectedZone(null)}
        >
          <div className="p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-lg">{selectedZone.name}</h3>
              <Badge 
                variant={selectedZone.demandLevel === 'high' ? 'default' : 
                        selectedZone.demandLevel === 'medium' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {selectedZone.zoneType}
              </Badge>
            </div>

            {/* Market Overview */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">${selectedZone.avgRent}</span>
                <span className="text-gray-600">avg rent</span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{selectedZone.vacancyRate}%</span>
                <span className="text-gray-600">vacancy</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium">{selectedZone.availableProviders}</span>
                <span className="text-gray-600">providers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-lg">{selectedZone.demandScore}</span>
                <span className="text-gray-600 text-xs">demand score</span>
              </div>
            </div>

            {/* Key Services */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Top Services</h4>
              <div className="space-y-1">
                {Object.entries(selectedZone.keyServices).slice(0, 3).map(([service, data]) => (
                  <div key={service} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span className="capitalize font-medium">{service}</span>
                      {getTrendingIcon(data.trending)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{data.demand}% demand</span>
                      <span className="font-medium">${data.avgRate}/hr</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant={selectedZone.marketInsights.opportunity === 'high' ? 'default' : 
                          selectedZone.marketInsights.opportunity === 'medium' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {selectedZone.marketInsights.opportunity} opportunity
                </Badge>
                <span className="text-xs text-gray-600">
                  {selectedZone.marketInsights.profitability}% profit score
                </span>
              </div>
              <p className="text-xs text-blue-700 font-medium">
                {selectedZone.marketInsights.description}
              </p>
            </div>

            {/* Action Button */}
            {userRole === 'provider' && (
              <Button size="sm" className="w-full">
                <MapPin className="h-3 w-3 mr-1" />
                Target This Zone
              </Button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MontrealHeatZonesOverlay;
