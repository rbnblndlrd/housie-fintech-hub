
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Star, MapPin, DollarSign } from 'lucide-react';
import CommunityRatingDisplay from './CommunityRatingDisplay';

interface ProviderProfileHeaderProps {
  provider: {
    id: string;
    business_name: string;
    user: {
      id: string;
      full_name: string;
      city: string;
      province: string;
    };
    verified: boolean;
    verification_level: string;
    average_rating: number;
    total_bookings: number;
    hourly_rate: number;
    service_radius_km: number;
    description?: string;
  };
}

const ProviderProfileHeader: React.FC<ProviderProfileHeaderProps> = ({ provider }) => {
  return (
    <div className="space-y-6">
      <Card className="fintech-card">
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg">
              {provider.business_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PB'}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.business_name}</h1>
                  <p className="text-lg text-gray-600 font-medium">{provider.user.full_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <CreamBadge variant={provider.verified ? 'success' : 'neutral'}>
                    {provider.verified ? 'Verified' : 'Unverified'}
                  </CreamBadge>
                  {provider.verification_level !== 'basic' && (
                    <CreamBadge variant="default">
                      {provider.verification_level === 'background_check' ? 'Background Check' : 'Professional License'}
                    </CreamBadge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{provider.average_rating.toFixed(1)}</span>
                  <span className="text-gray-500">({provider.total_bookings} bookings)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{provider.hourly_rate}$/hour</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-600">{provider.user.city}, {provider.user.province}</span>
                  <span className="text-gray-400 text-sm">({provider.service_radius_km}km radius)</span>
                </div>
              </div>

              {provider.description && (
                <p className="text-gray-700 leading-relaxed">{provider.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Rating Display */}
      <CommunityRatingDisplay userId={provider.user.id} />
    </div>
  );
};

export default ProviderProfileHeader;
