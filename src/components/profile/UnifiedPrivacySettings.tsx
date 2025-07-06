import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Eye, 
  Lock, 
  Users,
  Zap,
  Crown,
  Settings
} from 'lucide-react';

interface UnifiedPrivacySettingsProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
}

interface PrivacySettingsState {
  personal: {
    showLocation: boolean;
    showContact: boolean;
    locationRadius: number[];
    profileVisibility: boolean;
  };
  provider: {
    showLocation: boolean;
    showContact: boolean;
    locationRadius: number[];
    profileVisibility: boolean;
    showServiceArea: boolean;
  };
  collective: {
    showLocation: boolean;
    showContact: boolean;
    locationRadius: number[];
    profileVisibility: boolean;
    showGroupInfo: boolean;
  };
  crew: {
    showLocation: boolean;
    showContact: boolean;
    locationRadius: number[];
    profileVisibility: boolean;
    showCrewInfo: boolean;
  };
}

const UnifiedPrivacySettings: React.FC<UnifiedPrivacySettingsProps> = ({
  profile,
  selectedRole,
}) => {
  // Mock privacy settings state - would come from database
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsState>({
    personal: {
      showLocation: true,
      showContact: false,
      locationRadius: [10000], // meters
      profileVisibility: true
    },
    provider: {
      showLocation: true,
      showContact: true,
      locationRadius: [25000], // meters
      profileVisibility: true,
      showServiceArea: true
    },
    collective: {
      showLocation: false,
      showContact: false,
      locationRadius: [5000], // meters
      profileVisibility: false,
      showGroupInfo: true
    },
    crew: {
      showLocation: true,
      showContact: true,
      locationRadius: [50000], // meters
      profileVisibility: true,
      showCrewInfo: true
    }
  });

  const getPrivacyZoneName = (): string => {
    switch (selectedRole) {
      case 'personal': return 'Personal Privacy Zone';
      case 'provider': return 'Provider Privacy Zone';
      case 'collective': return 'Collective Privacy Zone';
      case 'crew': return 'Crew Privacy Zone';
      default: return 'Privacy Zone';
    }
  };

  const getPrivacyDescription = (): string => {
    switch (selectedRole) {
      case 'personal': return 'Controls how your personal information is shared';
      case 'provider': return 'Professional visibility settings for service providers';
      case 'collective': return 'Group privacy settings for collective bookings';
      case 'crew': return 'Team privacy settings and crew visibility controls';
      default: return 'Privacy settings';
    }
  };

  const getLocationDescription = (): string => {
    switch (selectedRole) {
      case 'personal': return 'Personal location sharing';
      case 'provider': return 'Service area visibility';
      case 'collective': return 'Group meeting locations';
      case 'crew': return 'Crew operational area';
      default: return 'Location sharing';
    }
  };

  const currentSettings = privacySettings[selectedRole];
  const radiusKm = Math.round(currentSettings.locationRadius[0] / 1000);

  const updateSetting = (key: string, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [key]: value
      }
    }));
  };

  const getRoleIcon = () => {
    switch (selectedRole) {
      case 'personal': return '👤';
      case 'provider': return '🔧';
      case 'collective': return '👥';
      case 'crew': return '⚡';
      default: return '🔒';
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/10 h-full">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          {getPrivacyZoneName()}
          <span className="text-lg ml-auto" role="img" aria-label={selectedRole}>
            {getRoleIcon()}
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{getPrivacyDescription()}</p>
      </CardHeader>
      
      <CardContent className="space-y-6 flex-1">
        {/* Privacy Context Indicator */}
        <div className="p-3 bg-muted/20 rounded-lg border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Context: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            These settings apply specifically to your {selectedRole} profile and activities
          </p>
        </div>

        {/* Location Privacy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">{getLocationDescription()}</Label>
            </div>
            <Switch
              checked={currentSettings.showLocation}
              onCheckedChange={(checked) => updateSetting('showLocation', checked)}
            />
          </div>
          
          {currentSettings.showLocation && (
            <div className="ml-6 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">
                    {selectedRole === 'provider' ? 'Service Radius' : 'Privacy Radius'}
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    {radiusKm} km
                  </Badge>
                </div>
                <Slider
                  value={currentSettings.locationRadius}
                  onValueChange={(value) => updateSetting('locationRadius', value)}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 km</span>
                  <span>100 km</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Contact Information</Label>
          </div>
          <Switch
            checked={currentSettings.showContact}
            onCheckedChange={(checked) => updateSetting('showContact', checked)}
          />
        </div>

        {/* Profile Visibility */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Profile Visibility</Label>
          </div>
          <Switch
            checked={currentSettings.profileVisibility}
            onCheckedChange={(checked) => updateSetting('profileVisibility', checked)}
          />
        </div>

        {/* Role-specific Settings */}
        {selectedRole === 'provider' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium">Show Service Area</Label>
            </div>
            <Switch
              checked={(currentSettings as any).showServiceArea || false}
              onCheckedChange={(checked) => updateSetting('showServiceArea', checked)}
            />
          </div>
        )}

        {selectedRole === 'collective' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <Label className="text-sm font-medium">Show Group Information</Label>
            </div>
            <Switch
              checked={(currentSettings as any).showGroupInfo || false}
              onCheckedChange={(checked) => updateSetting('showGroupInfo', checked)}
            />
          </div>
        )}

        {selectedRole === 'crew' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-600" />
                <Label className="text-sm font-medium">Show Crew Information</Label>
              </div>
              <Switch
                checked={(currentSettings as any).showCrewInfo || false}
                onCheckedChange={(checked) => updateSetting('showCrewInfo', checked)}
              />
            </div>
            
            {/* Crew Permission Level */}
            <div className="p-3 bg-orange-50/50 rounded-lg border border-orange-200/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Permission Level</span>
                </div>
                <Badge className="bg-orange-500 hover:bg-orange-600">
                  Leader
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                As crew leader, you have full control over crew privacy settings and member permissions.
              </p>
            </div>
          </>
        )}

        {/* Privacy Summary */}
        <div className="p-4 bg-muted/10 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Privacy Level</span>
            <Badge 
              variant={currentSettings.showLocation && currentSettings.showContact ? "destructive" : "secondary"}
              className="text-xs"
            >
              {currentSettings.showLocation && currentSettings.showContact ? 'Open' : 
               currentSettings.showLocation || currentSettings.showContact ? 'Moderate' : 'Private'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Location: {currentSettings.showLocation ? `Visible within ${radiusKm}km` : 'Hidden'}</p>
            <p>• Contact: {currentSettings.showContact ? 'Visible to connections' : 'Private'}</p>
            <p>• Profile: {currentSettings.profileVisibility ? 'Public' : 'Private'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedPrivacySettings;