
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
  User,
  Clock
} from 'lucide-react';
import { Service } from "@/types/service";

interface CompactServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
  onViewProfile: (providerId: string) => void;
}

const CompactServiceCard: React.FC<CompactServiceCardProps> = ({ 
  service, 
  onBookNow,
  onViewProfile
}) => {
  const getVerificationBadge = () => {
    if (service.provider.verification_level === 'professional_license') {
      return (
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
          <Award className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      );
    } else if (service.provider.verification_level === 'background_check') {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="fintech-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Provider Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {(service.provider.business_name || service.provider.user.full_name).charAt(0)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {service.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="font-medium">{service.provider.business_name || service.provider.user.full_name}</span>
                  {getVerificationBadge()}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{service.provider.user.city}, {service.provider.user.province}</span>
                </div>
              </div>
              
              {/* Rating & View Profile */}
              <div className="flex items-center gap-2 ml-2">
                {service.provider.average_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900 text-sm">
                      {service.provider.average_rating.toFixed(1)}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                  onClick={() => onViewProfile(service.provider.id)}
                  title="View Profile"
                >
                  <User className="h-4 w-4 text-blue-600" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm line-clamp-2 mb-3">
              {service.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-xs capitalize">
                {service.category.replace('_', ' ')}
              </Badge>
              {service.subcategory && (
                <Badge variant="outline" className="text-xs capitalize">
                  {service.subcategory.replace('_', ' ')}
                </Badge>
              )}
              {service.background_check_required && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-2 w-2 mr-1" />
                  BG Check
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">
                    {service.pricing_type === 'hourly' 
                      ? service.provider.hourly_rate || service.base_price
                      : service.base_price}
                  </span>
                  <span className="text-sm text-gray-600">
                    {service.pricing_type === 'hourly' ? '/hr' : ''}
                  </span>
                </div>
                <span className="text-xs text-gray-500">+ 6% fee</span>
              </div>

              <Button 
                onClick={() => onBookNow(service)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4"
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

export default CompactServiceCard;
