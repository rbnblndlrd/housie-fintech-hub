
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from 'lucide-react';

interface ProviderHoverInfoProps {
  provider: {
    id: string;
    name: string;
    service: string;
    rating: number;
    reviewCount?: number;
    serviceRadius: number;
    hourlyRate?: number;
    distance?: string;
  };
  position: { x: number; y: number };
  onViewProfile: () => void;
  onBookNow: () => void;
}

const ProviderHoverInfo: React.FC<ProviderHoverInfoProps> = ({
  provider,
  position,
  onViewProfile,
  onBookNow
}) => {
  return (
    <div 
      className="absolute z-50 pointer-events-none"
      style={{ 
        left: position.x + 10, 
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <Card className="fintech-card shadow-lg border-2 border-blue-200 pointer-events-auto max-w-xs">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{provider.name}</h3>
              <p className="text-xs text-gray-600">{provider.service}</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="font-medium">{provider.rating}</span>
                {provider.reviewCount && (
                  <span className="text-gray-500">({provider.reviewCount})</span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600">Services dans {provider.serviceRadius}km</span>
              </div>
            </div>
            
            {provider.hourlyRate && (
              <div className="text-sm font-semibold text-gray-900">
                ${provider.hourlyRate}/heure
              </div>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onViewProfile}
                className="text-xs px-2 py-1 h-auto"
              >
                Voir Profil
              </Button>
              <Button
                size="sm"
                onClick={onBookNow}
                className="text-xs px-2 py-1 h-auto fintech-button-primary"
              >
                Réserver
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderHoverInfo;
