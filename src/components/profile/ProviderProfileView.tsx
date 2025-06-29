
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedUserProfile } from '@/types/userProfile';
import { MapPin, Phone, Mail, Calendar, Star, Award, Shield, CheckCircle } from 'lucide-react';

interface ProviderProfileViewProps {
  profile: UnifiedUserProfile;
}

const ProviderProfileView: React.FC<ProviderProfileViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Profile</CardTitle>
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
            <div>
              <h3 className="text-xl font-semibold">
                {profile.business_name || profile.full_name}
              </h3>
              <p className="text-gray-600">@{profile.username}</p>
              {profile.description && <p className="text-sm text-gray-700 mt-1">{profile.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.show_location && profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
            {profile.show_contact_info && profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
            {profile.show_contact_info && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.username}@housie.ca</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Provider since {new Date(profile.created_at).getFullYear()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.years_experience || 0}</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {profile.hourly_rate ? `$${profile.hourly_rate}` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Hourly Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profile.service_radius_km || 25}km</div>
              <div className="text-sm text-gray-600">Service Radius</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.total_bookings || 0}</div>
              <div className="text-sm text-gray-600">Jobs Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-2xl font-bold text-yellow-600">
                  {profile.average_rating ? profile.average_rating.toFixed(1) : '0.0'}
                </span>
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.total_reviews || 0}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.community_rating_points || 0}</div>
              <div className="text-sm text-gray-600">Community Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.shop_points || 0}</div>
              <div className="text-sm text-gray-600">Shop Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commendations */}
      <Card>
        <CardHeader>
          <CardTitle>Commendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">
                  {profile.quality_commendations || 0}
                </span>
              </div>
              <div className="text-sm text-gray-600">Quality</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">
                  {profile.reliability_commendations || 0}
                </span>
              </div>
              <div className="text-sm text-gray-600">Reliability</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">
                  {profile.courtesy_commendations || 0}
                </span>
              </div>
              <div className="text-sm text-gray-600">Courtesy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {profile.verified && (
              <Badge variant="default">Verified Provider</Badge>
            )}
            {profile.background_check_verified && (
              <Badge variant="secondary">Background Checked</Badge>
            )}
            {profile.professional_license_verified && (
              <Badge variant="outline">Licensed Professional</Badge>
            )}
            {profile.insurance_verified && (
              <Badge variant="outline">Insured</Badge>
            )}
            {profile.cra_compliant && (
              <Badge variant="outline">CRA Compliant</Badge>
            )}
            {profile.rbq_verified && (
              <Badge variant="outline">RBQ Verified</Badge>
            )}
            {profile.ccq_verified && (
              <Badge variant="outline">CCQ Verified</Badge>
            )}
            {!profile.verified && !profile.background_check_verified && !profile.professional_license_verified && (
              <Badge variant="destructive">Pending Verification</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderProfileView;
