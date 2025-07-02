import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Briefcase, 
  Star, 
  Award, 
  Users, 
  Shield, 
  Camera,
  MapPin,
  Navigation
} from 'lucide-react';

interface ProviderProfileSectionProps {
  userProfile: any;
}

const ProviderProfileSection: React.FC<ProviderProfileSectionProps> = ({ userProfile }) => {
  const [providerPrivacy, setProviderPrivacy] = useState({
    showOnMap: true,
    confidentialityRadius: 15,
    serviceRadius: 20,
    showRatings: true,
    profileVisibility: true
  });

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Provider Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Overview & Stats Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Provider Avatar */}
          <div className="lg:col-span-1">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl">
                    {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Service Provider</Badge>
            </div>
          </div>

          {/* Provider Statistics */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Provider Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="fintech-metric-card p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-sm opacity-70">Provider Rating</div>
                </div>
                <div className="fintech-metric-card p-4 text-center">
                  <Award className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm opacity-70">Provider Jobs</div>
                </div>
                <div className="fintech-metric-card p-4 text-center">
                  <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">78</div>
                  <div className="text-sm opacity-70">Provider Network</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Privacy Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Provider Privacy Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Show Provider Location on Map</h4>
                <p className="text-sm text-gray-600">Display your service location when providing services</p>
              </div>
              <Switch
                checked={providerPrivacy.showOnMap}
                onCheckedChange={(checked) => 
                  setProviderPrivacy({ ...providerPrivacy, showOnMap: checked })
                }
              />
            </div>

            {providerPrivacy.showOnMap && (
              <div className="space-y-4 ml-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <Label className="text-base font-medium">
                    Provider Privacy Zone: {providerPrivacy.confidentialityRadius} km
                  </Label>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[providerPrivacy.confidentialityRadius]}
                    onValueChange={([value]) => 
                      setProviderPrivacy({ ...providerPrivacy, confidentialityRadius: value })
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

                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <Label className="text-base font-medium">
                    Service Range: {providerPrivacy.serviceRadius} km
                  </Label>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[providerPrivacy.serviceRadius]}
                    onValueChange={([value]) => 
                      setProviderPrivacy({ ...providerPrivacy, serviceRadius: value })
                    }
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 km (Local)</span>
                    <span>50 km (Extended)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Show Provider Ratings</h4>
                <p className="text-sm text-gray-600">Allow customers to see your provider ratings and reviews</p>
              </div>
              <Switch
                checked={providerPrivacy.showRatings}
                onCheckedChange={(checked) => 
                  setProviderPrivacy({ ...providerPrivacy, showRatings: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Provider Profile Visibility</h4>
                <p className="text-sm text-gray-600">Make your provider profile publicly searchable</p>
              </div>
              <Switch
                checked={providerPrivacy.profileVisibility}
                onCheckedChange={(checked) => 
                  setProviderPrivacy({ ...providerPrivacy, profileVisibility: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Provider Specialties */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Provider Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.specialties.map((specialty: string) => (
              <Badge key={specialty} variant="secondary" className="bg-green-500/20 text-green-800">
                {specialty}
              </Badge>
            ))}
            <Button variant="outline" size="sm">
              <span className="text-lg mr-2">+</span>
              Add Specialty
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderProfileSection;