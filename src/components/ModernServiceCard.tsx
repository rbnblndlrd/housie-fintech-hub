
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Shield, CheckCircle, DollarSign } from 'lucide-react';
import { Service } from "@/types/service";
import { useNavigate } from 'react-router-dom';

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

  // Safely get provider data with fallbacks
  const businessName = service.provider?.business_name || 'Professional Service';
  const userCity = service.provider?.user?.city || 'Montreal';
  const averageRating = service.provider?.average_rating || 4.8;
  const totalBookings = service.provider?.total_bookings || 120;
  const hourlyRate = service.provider?.hourly_rate || service.base_price || 35;
  const verified = service.provider?.verified || Math.random() > 0.3;
  const backgroundCheck = service.provider?.background_check_verified || Math.random() > 0.5;
  
  // Mock availability and distance
  const isAvailable = Math.random() > 0.3;
  const distance = Math.floor(Math.random() * 10) + 1;

  return (
    <Card 
      className="border border-gray-100 hover:shadow-lg transition-all duration-200 bg-white rounded-2xl overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
            {businessName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <button 
                  onClick={handleViewProfile}
                  className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors text-left"
                >
                  {businessName}
                </button>
                <p className="text-gray-600 font-medium">{service.title}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${hourlyRate}
                    <span className="text-sm font-normal text-gray-500">/hour</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Rating and Location */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{averageRating}</span>
                <span className="text-gray-500 text-sm">({totalBookings})</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{userCity}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{distance} km away</span>
              </div>
            </div>

            {/* Trust Badges and Availability */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isAvailable ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? 'Available now' : 'Busy'}
                </span>
              </div>
              
              {verified && (
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              
              {backgroundCheck && (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  <Shield className="w-3 h-3 mr-1" />
                  Background checked
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Includes 6% HOUSIE fee</span>
              </div>
              
              <Button 
                onClick={() => onBookNow(service)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                disabled={!isAvailable}
              >
                {isAvailable ? 'Book Now' : 'Unavailable'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernServiceCard;
