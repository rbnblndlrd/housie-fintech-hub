import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Briefcase, 
  MapPin,
  Save,
  Settings,
  CheckCircle,
  Crown,
  Phone,
  Mail,
  Clock,
  Wrench,
  Sparkles,
  Home,
  Trees,
  Heart,
  Zap,
  Music,
  Truck,
  Trophy
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import ProfileTabNavigation, { ProfileTab } from './ProfileTabNavigation';

interface ProviderTabProps {
  profile: UnifiedUserProfile;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const ProviderTab: React.FC<ProviderTabProps> = ({ profile, activeTab, onTabChange }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [serviceArea, setServiceArea] = useState([25]); // 5km to 50km range
  const [allowDirectContact, setAllowDirectContact] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);


  const handleSave = () => {
    toast({
      title: "Provider Settings Updated",
      description: "Your professional settings have been updated successfully.",
    });
    setIsEditing(false);
  };

  const getServiceAreaText = (value: number) => {
    if (value <= 10) return `${value}km - Local`;
    if (value <= 30) return `${value}km - Regional`;
    return value >= 50 ? 'Montreal Wide' : `${value}km - Extended`;
  };

  return (
    <div className="space-y-6">
      {/* Professional Settings */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Settings
            {profile.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
            <div>
              <p className="font-medium text-green-800">Provider Status</p>
              <p className="text-sm text-green-600">
                {profile.verified ? 'Verified Professional' : 'Pending Verification'}
              </p>
            </div>
            <Badge variant={profile.verified ? "default" : "secondary"}>
              {profile.verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={profile.business_name || ''}
                placeholder="Enter business name"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label>Hourly Rate</Label>
              <Input
                value={`$${profile.hourly_rate || 45}/hr`}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label>Specialties</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Cleaning Services
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Personal Wellness
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Tech Repair
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Show Availability</p>
                  <p className="text-sm text-muted-foreground">Display work schedule</p>
                </div>
              </div>
              <Switch
                checked={showAvailability}
                onCheckedChange={setShowAvailability}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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

      {/* Service Area Slider */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Area
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Coverage: {getServiceAreaText(serviceArea[0])}
              </Label>
              <div className="mt-2">
                <Slider
                  value={serviceArea}
                  onValueChange={setServiceArea}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5km Local</span>
                <span>25km Regional</span>
                <span>50km+ Montreal</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-blue-50/50 rounded">
                <span className="text-blue-600 font-medium">5-10km</span>
                <p className="text-blue-600">Local</p>
              </div>
              <div className="text-center p-2 bg-green-50/50 rounded">
                <span className="text-green-600 font-medium">15-30km</span>
                <p className="text-green-600">Regional</p>
              </div>
              <div className="text-center p-2 bg-purple-50/50 rounded">
                <span className="text-purple-600 font-medium">35km+</span>
                <p className="text-purple-600">Montreal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Professional Contact Options */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Professional Contact Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Direct Contact</p>
                <p className="text-sm text-muted-foreground">Allow customers to contact directly</p>
              </div>
            </div>
            <Switch
              checked={allowDirectContact}
              onCheckedChange={setAllowDirectContact}
              disabled={!isEditing}
            />
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Business Email</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.full_name ? `${profile.full_name.toLowerCase().replace(' ', '.')}@business.com` : 'Not set'}
            </p>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Business Phone</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.phone || 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderTab;