import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Shield, Award, CheckCircle, ExternalLink } from 'lucide-react';
import { Service } from '@/types/service';

interface ProviderCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
  onHoverProvider?: (providerId: string | null) => void;
  distance?: string;
  credScore?: number;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  service, 
  onBookNow,
  onHoverProvider,
  distance,
  credScore = 85
}) => {
  // Guard against null provider
  if (!service.provider) {
    console.warn('Service missing provider data:', service);
    return null;
  }

  const handleMouseEnter = () => {
    if (onHoverProvider && service.provider) {
      onHoverProvider(service.provider.id);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverProvider) {
      onHoverProvider(null);
    }
  };

  const getCredibilityIndicators = () => {
    const indicators = [];
    
    if (service.provider?.verified) {
      indicators.push(
        <Badge key="verified" className="bg-green-100 text-green-800 hover:bg-green-200">
          <Shield className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    
    if (service.provider?.average_rating && service.provider.average_rating >= 4.8) {
      indicators.push(
        <Badge key="toprated" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Award className="w-3 h-3 mr-1" />
          Top Rated
        </Badge>
      );
    }

    if (service.provider?.total_bookings && service.provider.total_bookings >= 50) {
      indicators.push(
        <Badge key="repeat" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Repeat Provider
        </Badge>
      );
    }

    if (service.provider?.background_check_verified) {
      indicators.push(
        <Badge key="background" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Background Check
        </Badge>
      );
    }

    if (service.provider?.ccq_verified) {
      indicators.push(
        <Badge key="ccq" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
          CCQ
        </Badge>
      );
    }

    if (service.provider?.rbq_verified) {
      indicators.push(
        <Badge key="rbq" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
          RBQ
        </Badge>
      );
    }

    return indicators;
  };

  const getCredScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-blue-600 bg-blue-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const providerName = service.provider.business_name || service.provider.user?.full_name || 'Provider';
  const providerLocation = service.provider.user ? 
    `${service.provider.user.city || 'Unknown City'}, ${service.provider.user.province || 'QC'}` : 
    'Location not available';

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open provider profile in new tab/modal
    window.open(`/provider/${service.provider.id}`, '_blank');
  };

  return (
    <Card 
      className="fintech-card hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer border-l-4 border-l-blue-500"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Provider Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {providerName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-xl">
                    {providerName}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewProfile}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{providerLocation}</span>
                  </div>
                  {distance && (
                    <div className="flex items-center gap-1 text-green-600">
                      <span>📍 {distance}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Service Info */}
            <h4 className="font-medium text-gray-800 mb-2 text-lg">{service.title}</h4>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
            
            {/* Credibility Indicators */}
            <div className="flex flex-wrap gap-2 mb-4">
              {getCredibilityIndicators()}
            </div>
          </div>
          
          {/* Right Side Info */}
          <div className="text-right ml-6 space-y-3">
            {/* Rating & Reviews */}
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900 text-lg">
                {service.provider.average_rating || 'N/A'}
              </span>
              <span className="text-sm text-gray-500">
                ({service.provider.total_bookings || 0})
              </span>
            </div>

            {/* Cred Score */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getCredScoreColor(credScore)}`}>
              <Award className="w-3 h-3" />
              <span>Cred: {credScore}</span>
            </div>
            
            {/* Service Radius */}
            <div className="flex items-center gap-1 justify-end text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Radius: {service.provider.service_radius_km || 25}km</span>
            </div>
            
            {/* Availability */}
            <div className="flex items-center gap-1 justify-end text-sm text-green-600">
              <Clock className="w-4 h-4" />
              <span>Available today</span>
            </div>
            
            {/* Pricing */}
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">
                ${service.provider.hourly_rate || service.base_price || 0}
                <span className="text-sm font-normal text-gray-600">
                  /{service.pricing_type === 'hourly' ? 'hr' : 'service'}
                </span>
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onBookNow(service);
                }}
                className="w-full fintech-button-primary text-sm font-semibold"
              >
                Book Now
              </Button>
              <Button 
                variant="outline"
                onClick={handleViewProfile}
                className="w-full text-sm border-gray-300 hover:border-gray-400"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;