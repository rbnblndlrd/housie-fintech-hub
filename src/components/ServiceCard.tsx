
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreamBadge } from "@/components/ui/cream-badge";
import { Star, DollarSign, MapPin } from 'lucide-react';
import { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
  onHoverProvider?: (providerId: string | null) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onBookNow, 
  onHoverProvider 
}) => {
  const handleMouseEnter = () => {
    if (onHoverProvider) {
      onHoverProvider(service.provider.id);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverProvider) {
      onHoverProvider(null);
    }
  };

  return (
    <Card 
      className="fintech-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
            {service.provider.business_name.split(' ').map(n => n[0]).join('')}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{service.title}</h3>
                <p className="text-gray-600 font-medium">{service.provider.business_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <CreamBadge 
                  variant={service.provider.verified ? 'success' : 'neutral'}
                >
                  {service.provider.verified ? 'Vérifié' : 'Non vérifié'}
                </CreamBadge>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1">
                <div className="p-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">{service.provider.average_rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({service.provider.total_bookings} avis)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  {service.pricing_type === 'hourly' 
                    ? `${service.provider.hourly_rate || service.base_price}$/heure`
                    : `${service.base_price}$`
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="p-1 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-500 text-sm">
                  {service.provider.user.city}, {service.provider.user.province}
                </span>
                <span className="text-gray-400 text-xs ml-1">
                  ({service.provider.service_radius_km}km radius)
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Tarification réelle + 6% frais HOUSIE</span>
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => onBookNow(service)}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
