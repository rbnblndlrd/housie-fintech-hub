
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Star, Award, Shield, Clock, DollarSign, MapPin } from 'lucide-react';

interface ProviderProfileViewProps {
  profile: UnifiedUserProfile;
}

const ProviderProfileView: React.FC<ProviderProfileViewProps> = ({ profile }) => {
  const getVerificationLevel = () => {
    if (profile.professional_license_verified) return 'Professional';
    if (profile.background_check_verified) return 'Background Checked';
    return 'Basic';
  };

  const getVerificationColor = () => {
    if (profile.professional_license_verified) return 'text-green-600';
    if (profile.background_check_verified) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Business Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{profile.business_name || profile.full_name}</span>
            <Badge variant="outline" className={getVerificationColor()}>
              <Shield className="h-3 w-3 mr-1" />
              {getVerificationLevel()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {profile.profile_image_url && (
              <img 
                src={profile.profile_image_url} 
                alt={profile.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold ml-1">{profile.average_rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-sm text-gray-600 ml-1">({profile.total_reviews} reviews)</span>
                </div>
              </div>
              {profile.description && (
                <p className="text-sm text-gray-700">{profile.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm">${profile.hourly_rate || 'N/A'}/hr</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{profile.years_experience} yrs exp</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              <span className="text-sm">{profile.service_radius_km}km radius</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-orange-500" />
              <span className="text-sm">{profile.total_bookings} jobs done</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Community Rating Points</span>
                  <span className="font-semibold">{profile.community_rating_points}</span>
                </div>
                <Progress value={Math.min((profile.community_rating_points / 100) * 100, 100)} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Shop Points</span>
                  <span className="font-semibold">{profile.shop_points}</span>
                </div>
                <Progress value={Math.min((profile.shop_points / 50) * 100, 100)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{profile.quality_commendations}</div>
                <div className="text-xs text-gray-600">Quality</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{profile.reliability_commendations}</div>
                <div className="text-xs text-gray-600">Reliability</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{profile.courtesy_commendations}</div>
                <div className="text-xs text-gray-600">Courtesy</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification & Licenses */}
      <Card>
        <CardHeader>
          <CardTitle>Verification & Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Verifications</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identity Verified</span>
                  <Badge variant={profile.verified ? "default" : "secondary"}>
                    {profile.verified ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background Check</span>
                  <Badge variant={profile.background_check_verified ? "default" : "secondary"}>
                    {profile.background_check_verified ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Insurance</span>
                  <Badge variant={profile.insurance_verified ? "default" : "secondary"}>
                    {profile.insurance_verified ? "✓" : "✗"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CRA Compliant</span>
                  <Badge variant={profile.cra_compliant ? "default" : "secondary"}>
                    {profile.cra_compliant ? "✓" : "✗"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Professional Licenses</h4>
              <div className="space-y-1">
                {profile.rbq_verified && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RBQ License</span>
                    <Badge variant="default">
                      {profile.rbq_license_number || "Verified"}
                    </Badge>
                  </div>
                )}
                {profile.ccq_verified && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CCQ License</span>
                    <Badge variant="default">
                      {profile.ccq_license_number || "Verified"}
                    </Badge>
                  </div>
                )}
                {!profile.rbq_verified && !profile.ccq_verified && (
                  <span className="text-sm text-gray-500">No professional licenses</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderProfileView;
