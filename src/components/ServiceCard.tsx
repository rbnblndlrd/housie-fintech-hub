
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, DollarSign, MapPin } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category: string;
  subcategory: string;
  active: boolean;
  provider: {
    id: string;
    business_name: string;
    hourly_rate: number;
    service_radius_km: number;
    average_rating: number;
    total_bookings: number;
    verified: boolean;
    user: {
      full_name: string;
      city: string;
      province: string;
    };
  };
}

interface ServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookNow }) => {
  return (
    <Card className="bg-white dark:bg-dark-secondary shadow-lg hover:shadow-xl transition-shadow border dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
            {service.provider.business_name.split(' ').map(n => n[0]).join('')}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-1">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{service.provider.business_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={service.provider.verified ? 'default' : 'secondary'}
                  className={service.provider.verified ? 'bg-green-500' : 'bg-gray-500'}
                >
                  {service.provider.verified ? 'Vérifié' : 'Non vérifié'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-black dark:text-white">{service.provider.average_rating.toFixed(1)}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">({service.provider.total_bookings} avis)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium text-black dark:text-white">
                  {service.pricing_type === 'hourly' 
                    ? `${service.provider.hourly_rate || service.base_price}$/heure`
                    : `${service.base_price}$`
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {service.provider.user.city}, {service.provider.user.province}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Tarification réelle + 6% frais HOUSIE</span>
              </div>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 px-6"
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
