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
  Shield, 
  MapPin,
  Eye,
  EyeOff,
  Save,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessTabProps {
  profile: UnifiedUserProfile;
}

const BusinessTab: React.FC<BusinessTabProps> = ({ profile }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [businessPrivacyZone, setBusinessPrivacyZone] = useState(500);
  const [showServiceArea, setShowServiceArea] = useState(true);
  const [allowBusinessContact, setAllowBusinessContact] = useState(true);

  const handleSave = () => {
    toast({
      title: "Business Settings Updated",
      description: "Your professional settings have been updated successfully.",
    });
    setIsEditing(false);
  };

  // Show message if user is not a provider
  if (!profile.can_provide_services) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Business Profile Not Available</h3>
            <p className="text-muted-foreground mb-4">
              You need to become a service provider to access business settings.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Become a Provider
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Information Card */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Service Provider
              {profile.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
            </CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
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
              <Label>Service Radius</Label>
              <Input
                value={`${profile.service_radius_km || 25} km`}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label>Professional Description</Label>
            <Input
              value={profile.description || ''}
              placeholder="Describe your professional services"
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Privacy Zone Card */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Business Privacy Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Privacy Protection for Business</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Control how precisely your business location is shown to potential customers
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Privacy Zone Radius: {businessPrivacyZone}m</Label>
              <div className="mt-2">
                <Slider
                  value={[businessPrivacyZone]}
                  onValueChange={(value) => setBusinessPrivacyZone(value[0])}
                  max={2000}
                  min={100}
                  step={50}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Your exact location will be hidden within this radius
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-red-50/50 rounded">
                <span className="text-red-600 font-medium">100m</span>
                <p className="text-red-600">Precise</p>
              </div>
              <div className="text-center p-2 bg-yellow-50/50 rounded">
                <span className="text-yellow-600 font-medium">500m</span>
                <p className="text-yellow-600">Balanced</p>
              </div>
              <div className="text-center p-2 bg-green-50/50 rounded">
                <span className="text-green-600 font-medium">1000m+</span>
                <p className="text-green-600">Private</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Area Visibility Card */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Area Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Show Service Area</p>
                <p className="text-sm text-muted-foreground">Display your service coverage area on map</p>
              </div>
            </div>
            <Switch
              checked={showServiceArea}
              onCheckedChange={setShowServiceArea}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Business Contact Access</p>
                <p className="text-sm text-muted-foreground">Allow customers to contact business directly</p>
              </div>
            </div>
            <Switch
              checked={allowBusinessContact}
              onCheckedChange={setAllowBusinessContact}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Verifications Card */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Professional Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <span className="text-sm">Background Check</span>
              <Badge variant={profile.background_check_verified ? "default" : "secondary"}>
                {profile.background_check_verified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <span className="text-sm">Professional License</span>
              <Badge variant={profile.professional_license_verified ? "default" : "secondary"}>
                {profile.professional_license_verified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Remove since they're now in the card */}
    </div>
  );
};

export default BusinessTab;