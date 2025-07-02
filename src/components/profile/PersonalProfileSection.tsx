import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Star, 
  Award, 
  Users, 
  Shield, 
  Camera, 
  Save, 
  Edit,
  MapPin,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface PersonalProfileSectionProps {
  userProfile: any;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  currentRole: string;
  onRoleToggle: () => void;
}

const PersonalProfileSection: React.FC<PersonalProfileSectionProps> = ({
  userProfile,
  editing,
  setEditing,
  currentRole,
  onRoleToggle
}) => {
  const [personalPrivacy, setPersonalPrivacy] = useState({
    showOnMap: true,
    confidentialityRadius: 10,
    showContactInfo: true
  });

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Overview & Stats Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                    {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
                {userProfile.isVerified && (
                  <Badge className="bg-green-100 text-green-800 mb-2">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified User
                  </Badge>
                )}
              </div>

              {/* Role Toggle */}
              <div className="mt-6 p-4 bg-white/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Account Type</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-sm ${currentRole === 'customer' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                    Customer
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onRoleToggle}
                    className="p-1 h-auto"
                  >
                    {currentRole === 'customer' ? (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ToggleRight className="h-6 w-6 text-blue-600" />
                    )}
                  </Button>
                  <span className={`text-sm ${currentRole === 'provider' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                    Provider
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Statistics */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Personal Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="fintech-metric-card p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userProfile.rating}</div>
                  <div className="text-sm opacity-70">Personal Rating</div>
                </div>
                <div className="fintech-metric-card p-4 text-center">
                  <Award className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userProfile.completedJobs}</div>
                  <div className="text-sm opacity-70">Jobs Completed</div>
                </div>
                <div className="fintech-metric-card p-4 text-center">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-sm opacity-70">Network Connections</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Privacy Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Personal Privacy Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Show Personal Location on Map</h4>
                <p className="text-sm text-gray-600">Display your general location when browsing as a customer</p>
              </div>
              <Switch
                checked={personalPrivacy.showOnMap}
                onCheckedChange={(checked) => 
                  setPersonalPrivacy({ ...personalPrivacy, showOnMap: checked })
                }
              />
            </div>

            {personalPrivacy.showOnMap && (
              <div className="space-y-4 ml-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <Label className="text-base font-medium">
                    Personal Privacy Zone: {personalPrivacy.confidentialityRadius} km
                  </Label>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[personalPrivacy.confidentialityRadius]}
                    onValueChange={([value]) => 
                      setPersonalPrivacy({ ...personalPrivacy, confidentialityRadius: value })
                    }
                    min={1}
                    max={25}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 km (Precise)</span>
                    <span>25 km (Very Private)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Show Contact Information</h4>
                <p className="text-sm text-gray-600">Allow other users to see your contact details</p>
              </div>
              <Switch
                checked={personalPrivacy.showContactInfo}
                onCheckedChange={(checked) => 
                  setPersonalPrivacy({ ...personalPrivacy, showContactInfo: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
              <Edit className="h-4 w-4 mr-2" />
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  value={userProfile.name}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  value={userProfile.email}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input 
                  value={userProfile.phone}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input 
                  value={userProfile.location}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea 
                placeholder="Tell us about yourself..."
                disabled={!editing}
                className="mt-1"
                rows={3}
              />
            </div>
            {editing && (
              <Button className="fintech-button-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalProfileSection;