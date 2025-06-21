
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreamBadge } from "@/components/ui/cream-badge";
import { Star, DollarSign, MapPin, User } from 'lucide-react';
import { Service } from "@/types/service";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (onHoverProvider && service.provider?.id) {
      onHoverProvider(service.provider.id);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverProvider) {
      onHoverProvider(null);
    }
  };

  const handleViewProfile = () => {
    if (service.provider?.id) {
      navigate(`/provider/${service.provider.id}`);
    }
  };

  const handleBookNow = () => {
    onBookNow(service);
  };

  // Safely get provider data with fallbacks
  const businessName = service.provider?.business_name || 'Unknown Provider';
  const userCity = service.provider?.user?.city || 'Unknown';
  const userProvince = service.provider?.user?.province || 'Location';
  const averageRating = service.provider?.average_rating || 0;
  const totalBookings = service.provider?.total_bookings || 0;
  const hourlyRate = service.provider?.hourly_rate || service.base_price || 0;
  const serviceRadius = service.provider?.service_radius_km || 10;
  const verified = service.provider?.verified || false;

  return (
    {/* FORCE fintech-card class to ensure consistent styling */}
    <Card 
      className="fintech-card hover-lift"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
            {businessName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{service.title}</h3>
                <button 
                  onClick={handleViewProfile}
                  className="text-gray-600 dark:text-gray-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {businessName}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <CreamBadge 
                  variant={verified ? 'success' : 'neutral'}
                >
                  {verified ? 'Vérifié' : 'Non vérifié'}
                </CreamBadge>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1">
                <div className="p-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">({totalBookings} avis)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {service.pricing_type === 'hourly' 
                    ? `${hourlyRate}$/heure`
                    : `${service.base_price}$`
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="p-1 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {userCity}, {userProvince}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">
                  ({serviceRadius}km radius)
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {service.description || 'No description available'}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Tarification réelle + 6% frais HOUSIE</span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleViewProfile}
                  className="flex items-center gap-2 fintech-button-secondary"
                >
                  <User className="h-4 w-4" />
                  View Profile
                </Button>
                <Button 
                  className="fintech-button-primary"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
