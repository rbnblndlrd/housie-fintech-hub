import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Eye, 
  EyeOff, 
  Save, 
  Shield, 
  Target,
  Trophy,
  Star,
  Users,
  BarChart3,
  Award,
  Crown,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProfileTabNavigation, { ProfileTab } from './ProfileTabNavigation';
import PrivacyMiniMap from './PrivacyMiniMap';

interface PersonalTabProps {
  profile: UnifiedUserProfile;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const PersonalTab: React.FC<PersonalTabProps> = ({ profile, activeTab, onTabChange }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.full_name || '');
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [comfortZone, setComfortZone] = useState([3]);

  // Stats from profile
  const stats = {
    totalJobs: profile.total_bookings || 127,
    networkConnections: profile.network_connections_count || 45,
    averageRating: profile.average_rating || 4.8,
    qualityCommendations: profile.quality_commendations || 23,
    reliabilityCommendations: profile.reliability_commendations || 18,
    courtesyCommendations: profile.courtesy_commendations || 31
  };

  // Mock milestones and recognition data
  const milestones = [
    { name: 'First Service', completed: true, date: 'Jan 2024' },
    { name: '10 Jobs Completed', completed: true, date: 'Mar 2024' },
    { name: '50 Jobs Completed', completed: true, date: 'Jun 2024' },
    { name: '100 Jobs Completed', completed: true, date: 'Nov 2024' },
    { name: '200 Jobs Target', completed: false, progress: 63 }
  ];

  const achievements = [
    { name: 'Trusted Member', icon: Shield, color: 'text-blue-600' },
    { name: 'Quality Expert', icon: Star, color: 'text-yellow-600' },
    { name: 'Reliable Pro', icon: Award, color: 'text-green-600' },
    { name: 'Community Favorite', icon: Heart, color: 'text-red-600' }
  ];

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your personal information has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Identity Section */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Identity
          </CardTitle>
          {/* Tab Navigation inside the card */}
          <div className="mt-4">
            <ProfileTabNavigation
              activeTab={activeTab}
              onTabChange={onTabChange}
              profile={profile}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.profile_image_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {(profile.full_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{profile.full_name || 'User'}</h3>
              <p className="text-muted-foreground">{profile.username}</p>
              <Badge variant="secondary" className="mt-1">
                Personal Account
              </Badge>
            </div>
            {isEditing && (
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayName" className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-3 w-3" />
                Display Name (Public)
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Zoé C."
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                <EyeOff className="h-3 w-3" />
                Full Name (Private)
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Zoé Crevisse"
                disabled={!isEditing}
              />
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="w-full"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Zone Mini-Map */}
      <PrivacyMiniMap 
        isEditing={isEditing}
        onPrivacyZoneChange={(radius) => {
          // Handle privacy zone changes here
          console.log('Privacy zone changed to:', radius + 'km');
        }}
        initialRadius={3}
      />

      {/* Milestones Section */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
                <div className={`w-3 h-3 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-muted'}`} />
                <div className="flex-1">
                  <p className="font-medium">{milestone.name}</p>
                  {milestone.completed && milestone.date && (
                    <p className="text-xs text-muted-foreground">Completed {milestone.date}</p>
                  )}
                  {!milestone.completed && milestone.progress && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{milestone.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recognition Section */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <IconComponent className={`h-5 w-5 ${achievement.color}`} />
                  <span className="text-sm font-medium">{achievement.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats Section */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
              <p className="text-sm text-muted-foreground">Jobs</p>
            </div>
            <div className="text-center p-3 bg-green-50/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.networkConnections}</div>
              <p className="text-sm text-muted-foreground">Connections</p>
            </div>
            <div className="text-center p-3 bg-yellow-50/50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{stats.averageRating}</span>
              </div>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalTab;