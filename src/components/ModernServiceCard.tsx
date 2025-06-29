
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Shield, Award, CheckCircle } from 'lucide-react';
import { Service } from '@/types/service';

interface ModernServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
  onHoverProvider?: (providerId: string | null) => void;
}

const ModernServiceCard: React.FC<ModernServiceCardProps> = ({ 
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

  const getVerificationBadges = () => {
    const badges = [];
    
    if (service.provider.verified) {
      badges.push(
        <Badge key="verified" className="bg-green-100 text-green-800 hover:bg-green-200">
          <Shield className="w-3 h-3 mr-1" />
          Vérifié
        </Badge>
      );
    }
    
    if (service.provider.background_check_verified) {
      badges.push(
        <Badge key="background" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Vérification antécédents
        </Badge>
      );
    }

    if (service.provider.ccq_verified) {
      badges.push(
        <Badge key="ccq" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
          CCQ
        </Badge>
      );
    }

    if (service.provider.rbq_verified) {
      badges.push(
        <Badge key="rbq" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
          RBQ
        </Badge>
      );
    }

    return badges;
  };

  return (
    <Card 
      className="fintech-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {(service.provider.business_name || service.provider.user.full_name)
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {service.provider.business_name || service.provider.user.full_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {service.provider.user.city}, {service.provider.user.province}
                </p>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-800 mb-2">{service.title}</h4>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {getVerificationBadges()}
            </div>
          </div>
          
          <div className="text-right ml-4">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium text-gray-900">
                {service.provider.average_rating || 'N/A'}
              </span>
              <span className="text-sm text-gray-500">
                ({service.provider.total_bookings || 0} avis)
              </span>
            </div>
            
            <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Rayon: {service.provider.service_radius_km || 25}km</span>
            </div>
            
            <div className="flex items-center gap-1 mb-4 text-sm text-green-600">
              <Clock className="w-4 h-4" />
              <span>Disponible aujourd'hui</span>
            </div>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">
                ${service.base_price}
                <span className="text-sm font-normal text-gray-600">
                  /{service.pricing_type === 'hourly' ? 'heure' : 'service'}
                </span>
              </p>
            </div>
            
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(service);
              }}
              className="w-full fintech-button-primary"
            >
              Réserver maintenant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernServiceCard;
