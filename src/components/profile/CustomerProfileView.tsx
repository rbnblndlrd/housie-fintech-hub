
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedUserProfile } from '@/types/userProfile';
import { MapPin, Phone, Mail, Calendar } from 'lucide-react';

interface CustomerProfileViewProps {
  profile: UnifiedUserProfile;
}

const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Profile</CardTitle>
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
              <h3 className="text-xl font-semibold">{profile.full_name}</h3>
              <p className="text-gray-600">@{profile.username}</p>
              {profile.bio && <p className="text-sm text-gray-700 mt-1">{profile.bio}</p>}
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
              <span className="text-sm">Member since {new Date(profile.created_at).getFullYear()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Community Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.community_rating_points}</div>
              <div className="text-sm text-gray-600">Community Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.shop_points}</div>
              <div className="text-sm text-gray-600">Shop Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.total_bookings}</div>
              <div className="text-sm text-gray-600">Services Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profile.network_connections_count}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      {(profile.is_verified || profile.background_check_verified) && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {profile.is_verified && (
                <Badge variant="default">Verified Account</Badge>
              )}
              {profile.background_check_verified && (
                <Badge variant="secondary">Background Checked</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerProfileView;
