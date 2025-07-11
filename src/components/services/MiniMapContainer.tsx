import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnifiedMapboxMap } from '@/components/UnifiedMapboxMap';
import { Service } from '@/types/service';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

interface MiniMapContainerProps {
  services: Service[];
  hoveredProviderId: string | null;
  onProviderClick?: (service: Service) => void;
  userLocation?: { lat: number; lng: number };
}

const MiniMapContainer: React.FC<MiniMapContainerProps> = ({
  services,
  hoveredProviderId,
  onProviderClick,
  userLocation
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 45.5017, lng: -73.5673 }); // Default to Montreal

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  // Convert services to providers for map display
  const providers = services
    .filter(service => service.provider?.user?.city)
    .map(service => ({
      id: service.provider.id,
      name: service.provider.business_name || service.provider.user?.full_name || 'Provider',
      lat: 45.5017 + (Math.random() - 0.5) * 0.2, // Mock coordinates based on city
      lng: -73.5673 + (Math.random() - 0.5) * 0.2,
      service: service.title,
      rating: service.provider.average_rating || 0,
      availability: 'Available',
      verified: service.provider.verified,
      hourlyRate: service.provider.hourly_rate,
      serviceData: service
    }));

  const handleProviderClick = (provider: any) => {
    if (onProviderClick && provider.serviceData) {
      onProviderClick(provider.serviceData);
    }
  };

  return (
    <Card className={`fintech-card transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : 'sticky top-4'}`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Service Radar</h3>
            <span className="text-sm text-gray-500">({providers.length} providers)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-gray-100"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className={`relative ${isExpanded ? 'h-[calc(100vh-200px)]' : 'h-80'}`}>
          <UnifiedMapboxMap
            center={mapCenter}
            zoom={11}
            providers={providers}
            hoveredProviderId={hoveredProviderId}
            onProviderClick={handleProviderClick}
          />
          
          {/* Map overlay with provider count */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {providers.length} active providers
              </span>
            </div>
          </div>

          {/* Verified providers indicator */}
          {providers.some(p => p.verified) && (
            <div className="absolute top-4 right-4 bg-green-100/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-xs font-medium text-green-800">
                  {providers.filter(p => p.verified).length} verified
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniMapContainer;