
import React, { useState } from 'react';
import { UnifiedMapboxMap } from "@/components/UnifiedMapboxMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock } from 'lucide-react';

interface Provider {
  id: number;
  name: string;
  lat: number;
  lng: number;
  service: string;
  rating: number;
  availability: string;
  serviceRadius?: number;
  verified?: boolean;
  hourlyRate?: number;
  distance?: string;
}

interface InteractiveServicesMapProps {
  providers: Provider[];
  hoveredProviderId?: string | null;
  onProviderSelect: (provider: Provider) => void;
}

const InteractiveServicesMap: React.FC<InteractiveServicesMapProps> = ({
  providers,
  hoveredProviderId,
  onProviderSelect
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const handleProviderClick = (provider: Provider) => {
    console.log('Provider clicked in InteractiveServicesMap:', provider.name);
    setSelectedProvider(provider);
  };

  const handleBookNow = () => {
    if (selectedProvider) {
      console.log('Booking provider:', selectedProvider.name);
      onProviderSelect(selectedProvider);
      setSelectedProvider(null);
    }
  };

  return (
    <div className="relative h-96 w-full">
      <UnifiedMapboxMap
        center={{ lat: 45.5017, lng: -73.5673 }}
        zoom={12}
        className="w-full h-full"
        providers={providers}
        hoveredProviderId={hoveredProviderId}
        onProviderClick={handleProviderClick}
        mode="services"
      />
      
      {selectedProvider && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="fintech-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {selectedProvider.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{selectedProvider.name}</h3>
                  <p className="text-sm text-gray-600">{selectedProvider.service}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{selectedProvider.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedProvider.distance || '2 km away'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">{selectedProvider.availability}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${selectedProvider.hourlyRate || 35}/hour
                  </p>
                  <Button 
                    onClick={handleBookNow}
                    className="mt-2 fintech-button-primary"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InteractiveServicesMap;
