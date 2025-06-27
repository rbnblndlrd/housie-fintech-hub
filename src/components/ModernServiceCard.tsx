
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  DollarSign, 
  Shield, 
  Award,
  Clock,
  Verified
} from 'lucide-react';
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

  const handleBookNow = () => {
    // Navigate to booking form with service details
    const params = new URLSearchParams({
      service_id: service.id,
      provider: service.provider.business_name || service.provider.user.full_name,
      price: service.pricing_type === 'hourly' 
        ? service.provider.hourly_rate?.toString() || service.base_price.toString()
        : service.base_price.toString()
    });
    navigate(`/booking-form?${params.toString()}`);
  };

  const getVerificationBadge = () => {
    if (service.provider.verification_level === 'premium') {
      return (
        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
          <Award className="h-3 w-3 mr-1" />
          Premium Verified
        </Badge>
      );
    } else if (service.provider.verification_level === 'verified') {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Verified className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return null;
  };

  const getRequirementsBadges = () => {
    const badges = [];
    
    if (service.background_check_required) {
      badges.push(
        <Badge key="bg-check" variant="outline" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Background Check
        </Badge>
      );
    }
    
    if (service.ccq_rbq_required) {
      badges.push(
        <Badge key="ccq-rbq" variant="outline" className="text-xs">
          <Award className="h-3 w-3 mr-1" />
          Professional License
        </Badge>
      );
    }

    return badges;
  };

  return (
    <Card 
      className="fintech-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      onMouseEnter={() => onHoverProvider?.(service.provider.id)}
      onMouseLeave={() => onHoverProvider?.(null)}
    >
      <CardContent className="p-0">
        <div className="p-6 pb-4">
          {/* Header with provider info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {(service.provider.business_name || service.provider.user.full_name).charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                  {service.provider.business_name || service.provider.user.full_name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{service.provider.user.city}, {service.provider.user.province}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getVerificationBadge()}
              {service.provider.average_rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {service.provider.average_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({service.provider.total_bookings || 0})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service details */}
          <div className="mb-4">
            <h4 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {service.title}
            </h4>
            <p className="text-gray-700 leading-relaxed line-clamp-2">
              {service.description}
            </p>
          </div>

          {/* Service badges and requirements */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-gray-100 text-gray-700 capitalize">
              {service.category.replace('_', ' ')}
            </Badge>
            {service.subcategory && (
              <Badge variant="outline" className="capitalize">
                {service.subcategory.replace('_', ' ')}
              </Badge>
            )}
            {getRequirementsBadges()}
          </div>

          {/* Pricing and booking */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {service.pricing_type === 'hourly' 
                    ? service.provider.hourly_rate || service.base_price
                    : service.base_price}
                </span>
                <span className="text-gray-600">
                  {service.pricing_type === 'hourly' ? '/hr' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                + 6% platform fee
              </div>
            </div>

            <Button 
              onClick={handleBookNow}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-2 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernServiceCard;
