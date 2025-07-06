import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Eye, 
  EyeOff, 
  Save, 
  Shield, 
  MapPin,
  Phone,
  Mail,
  BarChart3,
  Network,
  Star,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalTabProps {
  profile: UnifiedUserProfile;
}

const PersonalTab: React.FC<PersonalTabProps> = ({ profile }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.full_name || '');
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [showLocationInfo, setShowLocationInfo] = useState(profile.show_location ?? true);
  const [showContactInfo, setShowContactInfo] = useState(profile.show_contact_info ?? true);

  // Mock stats - in real app would come from database
  const stats = {
    totalJobs: profile.total_bookings || 127,
    networkConnections: profile.network_connections_count || 45,
    averageRating: profile.average_rating || 4.8,
    qualityCommendations: profile.quality_commendations || 23,
    reliabilityCommendations: profile.reliability_commendations || 18,
    courtesyCommendations: profile.courtesy_commendations || 31
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your personal information has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
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
                {profile.profile_type === 'business' ? 'Business Profile' : 'Individual Profile'}
              </Badge>
            </div>
            {isEditing && (
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            )}
          </div>

          {/* Display Name System */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Display Name Privacy</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Control how your name appears to others before and after booking confirmation
                </p>
              </div>
            </div>
            
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

      {/* Performance Stats Card */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Personal Performance Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
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

          {/* Commendations Mini-Graph */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Commendations Received</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Quality</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${(stats.qualityCommendations / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{stats.qualityCommendations}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reliability</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(stats.reliabilityCommendations / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{stats.reliabilityCommendations}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Courtesy</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500"
                      style={{ width: `${(stats.courtesyCommendations / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{stats.courtesyCommendations}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings Card */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Personal Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Location Sharing</p>
                <p className="text-sm text-muted-foreground">Allow others to see your general location</p>
              </div>
            </div>
            <Switch
              checked={showLocationInfo}
              onCheckedChange={setShowLocationInfo}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Contact Information</p>
                <p className="text-sm text-muted-foreground">Show phone number after booking confirmation</p>
              </div>
            </div>
            <Switch
              checked={showContactInfo}
              onCheckedChange={setShowContactInfo}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalTab;