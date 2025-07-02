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
  Building, 
  Star, 
  Briefcase, 
  Users, 
  Shield, 
  Camera, 
  Save, 
  Edit,
  MapPin,
  Navigation
} from 'lucide-react';

interface BusinessProfileSectionProps {
  editing: boolean;
  setEditing: (editing: boolean) => void;
}

const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({ editing, setEditing }) => {
  const [businessPrivacy, setBusinessPrivacy] = useState({
    showOnMap: true,
    confidentialityRadius: 5,
    serviceRadius: 30,
    directoryListing: true,
    showContactInfo: true,
    teamVisibility: false
  });

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Overview & Stats Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Business Logo Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 text-center border">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-orange-500 text-white text-2xl">
                    <Building className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Business Profile</Badge>
              
              {/* Banner Upload Button */}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Camera className="h-4 w-4 mr-2" />
                Upload Banner
              </Button>
            </div>
          </div>

          {/* Business Statistics */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="fintech-metric-card p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-sm opacity-70">Business Rating</div>
                </div>
                <div className="fintech-metric-card p-4 text-center">
                  <Briefcase className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">89</div>
                  <div className="text-sm opacity-70">Business Jobs</div>
                </div>
                <div className="fintech-metric-card p-4 text-center">
                  <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm opacity-70">Team Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Privacy Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Business Privacy Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Show Business Location on Map</h4>
                <p className="text-sm text-gray-600">Display your business location publicly for customers</p>
              </div>
              <Switch
                checked={businessPrivacy.showOnMap}
                onCheckedChange={(checked) => 
                  setBusinessPrivacy({ ...businessPrivacy, showOnMap: checked })
                }
              />
            </div>

            {businessPrivacy.showOnMap && (
              <div className="space-y-4 ml-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <Label className="text-base font-medium">
                    Business Privacy Zone: {businessPrivacy.confidentialityRadius} km
                  </Label>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[businessPrivacy.confidentialityRadius]}
                    onValueChange={([value]) => 
                      setBusinessPrivacy({ ...businessPrivacy, confidentialityRadius: value })
                    }
                    min={1}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 km (Exact)</span>
                    <span>15 km (Private)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <Label className="text-base font-medium">
                    Business Service Area: {businessPrivacy.serviceRadius} km
                  </Label>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[businessPrivacy.serviceRadius]}
                    onValueChange={([value]) => 
                      setBusinessPrivacy({ ...businessPrivacy, serviceRadius: value })
                    }
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10 km (Local)</span>
                    <span>100 km (Regional)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Business Directory Listing</h4>
                <p className="text-sm text-gray-600">Include your business in public directory searches</p>
              </div>
              <Switch
                checked={businessPrivacy.directoryListing}
                onCheckedChange={(checked) => 
                  setBusinessPrivacy({ ...businessPrivacy, directoryListing: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Business Contact Information</h4>
                <p className="text-sm text-gray-600">Show business phone and email to potential customers</p>
              </div>
              <Switch
                checked={businessPrivacy.showContactInfo}
                onCheckedChange={(checked) => 
                  setBusinessPrivacy({ ...businessPrivacy, showContactInfo: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Team Member Visibility</h4>
                <p className="text-sm text-gray-600">Display team member profiles on your business page</p>
              </div>
              <Switch
                checked={businessPrivacy.teamVisibility}
                onCheckedChange={(checked) => 
                  setBusinessPrivacy({ ...businessPrivacy, teamVisibility: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
              <Edit className="h-4 w-4 mr-2" />
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Business Name</label>
                <Input 
                  placeholder="Enter business name" 
                  className="mt-1"
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Industry</label>
                <Input 
                  placeholder="Select industry" 
                  className="mt-1"
                  disabled={!editing}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Business Description</label>
              <Textarea 
                placeholder="Describe your business..."
                className="mt-1"
                rows={3}
                disabled={!editing}
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

export default BusinessProfileSection;