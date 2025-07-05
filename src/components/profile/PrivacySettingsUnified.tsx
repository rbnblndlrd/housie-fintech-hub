import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Shield, Eye, MapPin, Phone, Mail, Briefcase, Users } from 'lucide-react';

interface PrivacySettingsUnifiedProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
}

const PrivacySettingsUnified: React.FC<PrivacySettingsUnifiedProps> = ({
  profile,
  selectedRole,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState([50]);
  const [showLocation, setShowLocation] = useState(profile.show_location ?? true);
  const [showContactInfo, setShowContactInfo] = useState(profile.show_contact_info ?? true);
  const [emergencyAccess, setEmergencyAccess] = useState(false);

  const getPrivacyContextTitle = () => {
    switch (selectedRole) {
      case 'personal':
        return 'Personal Privacy Zone';
      case 'provider':
        return 'Provider Privacy Zone';
      case 'customer':
        return 'Customer Privacy Zone';
      case 'crew':
        return 'Crew Privacy Zone';
      case 'collective':
        return 'Collective Privacy Zone';
      default:
        return 'Privacy Settings';
    }
  };

  const getPrivacyDescription = () => {
    switch (selectedRole) {
      case 'personal':
        return 'Control what personal information is visible to others';
      case 'provider':
        return 'Manage your visibility as a service provider';
      case 'customer':
        return 'Control your privacy when booking services';
      case 'crew':
        return 'Set privacy levels for crew operations';
      case 'collective':
        return 'Manage collective group privacy settings';
      default:
        return 'Manage your privacy settings';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{getPrivacyContextTitle()}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getPrivacyDescription()}
                  </p>
                </div>
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 px-6 pb-6 space-y-6">
            {/* Privacy Level Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Privacy Level</Label>
                <span className="text-xs text-muted-foreground">
                  {privacyLevel[0] < 30 ? 'Open' : privacyLevel[0] < 70 ? 'Balanced' : 'Private'}
                </span>
              </div>
              <Slider
                value={privacyLevel}
                onValueChange={setPrivacyLevel}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Public</span>
                <span>Private</span>
              </div>
            </div>

            {/* Location Visibility */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Show Location</Label>
                  <p className="text-xs text-muted-foreground">
                    Display approximate location to others
                  </p>
                </div>
              </div>
              <Switch
                checked={showLocation}
                onCheckedChange={setShowLocation}
              />
            </div>

            {/* Contact Info Visibility */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Show Contact Info</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow others to see your contact details
                  </p>
                </div>
              </div>
              <Switch
                checked={showContactInfo}
                onCheckedChange={setShowContactInfo}
              />
            </div>

            {/* Emergency Access */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Emergency Access</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow emergency contact access
                  </p>
                </div>
              </div>
              <Switch
                checked={emergencyAccess}
                onCheckedChange={setEmergencyAccess}
              />
            </div>

            {/* Context-specific settings */}
            {selectedRole === 'provider' && (
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Show Rates</Label>
                      <p className="text-xs text-muted-foreground">
                        Display pricing to potential customers
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            )}

            {selectedRole === 'crew' && (
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Crew Visibility</Label>
                      <p className="text-xs text-muted-foreground">
                        Show crew member details to clients
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default PrivacySettingsUnified;