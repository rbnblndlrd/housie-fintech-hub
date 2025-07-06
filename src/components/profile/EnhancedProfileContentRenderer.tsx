import React from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Shield,
  Crown
} from 'lucide-react';

interface EnhancedProfileContentRendererProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
}

const EnhancedProfileContentRenderer: React.FC<EnhancedProfileContentRendererProps> = ({
  profile,
  selectedRole,
}) => {
  const getStatsForRole = () => {
    switch (selectedRole) {
      case 'personal':
        return {
          title: 'Personal Performance',
          subtitle: 'Your personal activity across all roles',
          stats: [
            { 
              label: 'Jobs Completed', 
              value: '127', 
              icon: <Briefcase className="h-4 w-4" />,
              trend: '+12 this month',
              color: 'text-blue-600'
            },
            { 
              label: 'Network Connections', 
              value: '45', 
              icon: <Users className="h-4 w-4" />,
              trend: '+3 new',
              color: 'text-green-600'
            },
            { 
              label: 'Overall Rating', 
              value: '4.8 ⭐', 
              icon: <Star className="h-4 w-4" />,
              trend: 'Excellent',
              color: 'text-yellow-600'
            },
          ]
        };
      case 'provider':
        return {
          title: 'Provider Excellence',
          subtitle: 'Professional service performance metrics',
          stats: [
            { 
              label: 'Provider Jobs', 
              value: '156', 
              icon: <Briefcase className="h-4 w-4" />,
              trend: '+18 this month',
              color: 'text-blue-600'
            },
            { 
              label: 'Provider Network', 
              value: '78', 
              icon: <Users className="h-4 w-4" />,
              trend: 'Top 5%',
              color: 'text-green-600'
            },
            { 
              label: 'Provider Rating', 
              value: '4.9 ⭐', 
              icon: <Star className="h-4 w-4" />,
              trend: 'Elite Status',
              color: 'text-yellow-600'
            },
          ]
        };
      case 'collective':
        return {
          title: 'Collective Impact',
          subtitle: 'Group booking and community engagement',
          stats: [
            { 
              label: 'Group Bookings', 
              value: '12', 
              icon: <Calendar className="h-4 w-4" />,
              trend: '+2 active',
              color: 'text-purple-600'
            },
            { 
              label: 'Members', 
              value: '8', 
              icon: <Users className="h-4 w-4" />,
              trend: 'Growing',
              color: 'text-green-600'
            },
            { 
              label: 'Group Rating', 
              value: '4.7 ⭐', 
              icon: <Star className="h-4 w-4" />,
              trend: 'Strong',
              color: 'text-yellow-600'
            },
          ]
        };
      case 'crew':
        return {
          title: 'Crew Leadership',
          subtitle: 'Team management and performance',
          stats: [
            { 
              label: 'Crew Jobs', 
              value: '89', 
              icon: <Zap className="h-4 w-4" />,
              trend: '+7 this week',
              color: 'text-orange-600'
            },
            { 
              label: 'Team Members', 
              value: '12', 
              icon: <Users className="h-4 w-4" />,
              trend: 'Full roster',
              color: 'text-green-600'
            },
            { 
              label: 'Crew Rating', 
              value: '4.9 ⭐', 
              icon: <Star className="h-4 w-4" />,
              trend: 'Elite Crew',
              color: 'text-yellow-600'
            },
          ]
        };
      default:
        return { title: '', subtitle: '', stats: [] };
    }
  };

  const getPermissionBadges = () => {
    const badges = [];
    
    if (selectedRole === 'crew') {
      badges.push(
        <Badge key="leader" variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">
          <Crown className="h-3 w-3 mr-1" />
          Crew Leader
        </Badge>
      );
    }
    
    if (profile.verified) {
      badges.push(
        <Badge key="verified" variant="secondary" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    
    if (selectedRole === 'provider' && profile.verification_level) {
      badges.push(
        <Badge key="verification" variant="outline" className="text-xs capitalize">
          <Award className="h-3 w-3 mr-1" />
          {profile.verification_level}
        </Badge>
      );
    }
    
    return badges;
  };

  const statsData = getStatsForRole();

  return (
    <div className="space-y-4">
      {/* Enhanced Profile Header */}
      <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-lg">
                <AvatarImage src={profile.profile_image_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xl font-bold">
                  {profile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Role Indicator Ring */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-lg shadow-lg">
                {selectedRole === 'personal' && '👤'}
                {selectedRole === 'provider' && '🔧'}
                {selectedRole === 'collective' && '👥'}
                {selectedRole === 'crew' && '⚡'}
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              
              {profile.location && (
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Enhanced Role-specific badges */}
            <div className="flex flex-wrap justify-center gap-2">
              {getPermissionBadges()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Performance Stats */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {statsData.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{statsData.subtitle}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-3">
            {statsData.stats.map((stat, index) => (
              <div 
                key={index}
                className="group p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform`}>
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                      <p className="text-xs text-muted-foreground/70">
                        {stat.trend}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Additional Info */}
      {selectedRole === 'crew' && (
        <Card className="bg-card/80 backdrop-blur-sm border-orange-200/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              Crew Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg">
                <span className="text-sm font-medium">Permission Level</span>
                <Badge className="bg-orange-500 hover:bg-orange-600">Leader</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium">Active Crew Projects</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium">Team Performance</span>
                <span className="font-bold text-green-600">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bio Section */}
      {profile.bio && (
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              About {selectedRole === 'personal' ? 'Me' : 'This ' + selectedRole}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProfileContentRenderer;