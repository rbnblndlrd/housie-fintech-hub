import React from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, Users, Briefcase, Calendar } from 'lucide-react';

interface ProfileContentRendererProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
}

const ProfileContentRenderer: React.FC<ProfileContentRendererProps> = ({
  profile,
  selectedRole,
}) => {
  const getStatsForRole = () => {
    switch (selectedRole) {
      case 'personal':
        return {
          title: 'Personal Stats',
          stats: [
            { label: 'Total Jobs', value: '127', icon: <Briefcase className="h-4 w-4" /> },
            { label: 'Network Connections', value: '45', icon: <Users className="h-4 w-4" /> },
            { label: 'Average Rating', value: '4.8', icon: <Star className="h-4 w-4" /> },
          ]
        };
      case 'provider':
        return {
          title: 'Provider Performance',
          stats: [
            { label: 'Provider Jobs', value: '156', icon: <Briefcase className="h-4 w-4" /> },
            { label: 'Network Size', value: '78', icon: <Users className="h-4 w-4" /> },
            { label: 'Provider Rating', value: '4.9', icon: <Star className="h-4 w-4" /> },
          ]
        };
      case 'customer':
        return {
          title: 'Customer Activity',
          stats: [
            { label: 'Bookings Made', value: '89', icon: <Calendar className="h-4 w-4" /> },
            { label: 'Reviews Given', value: '12', icon: <Star className="h-4 w-4" /> },
            { label: 'Customer Rating', value: '4.8', icon: <Star className="h-4 w-4" /> },
          ]
        };
      case 'crew':
        return {
          title: 'Crew Performance',
          stats: [
            { label: 'Crew Jobs', value: '89', icon: <Briefcase className="h-4 w-4" /> },
            { label: 'Team Members', value: '12', icon: <Users className="h-4 w-4" /> },
            { label: 'Crew Rating', value: '4.9', icon: <Star className="h-4 w-4" /> },
          ]
        };
      case 'collective':
        return {
          title: 'Collective Stats',
          stats: [
            { label: 'Group Projects', value: '23', icon: <Briefcase className="h-4 w-4" /> },
            { label: 'Collective Members', value: '8', icon: <Users className="h-4 w-4" /> },
            { label: 'Group Rating', value: '4.7', icon: <Star className="h-4 w-4" /> },
          ]
        };
      default:
        return { title: '', stats: [] };
    }
  };

  const statsData = getStatsForRole();

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-20 w-20 ring-4 ring-primary/20">
              <AvatarImage src={profile.profile_image_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-bold text-foreground">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              
              {profile.location && (
                <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Role-specific badges */}
            <div className="flex flex-wrap justify-center gap-2">
              {profile.verified && (
                <Badge variant="default" className="text-xs">
                  ✓ Verified
                </Badge>
              )}
              {selectedRole === 'provider' && profile.verification_level && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {profile.verification_level}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats - Mobile Stacked */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">{statsData.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 gap-4">
            {statsData.stats.map((stat, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      {profile.bio && (
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileContentRenderer;