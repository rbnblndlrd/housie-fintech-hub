import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import QuickSettingsPanel from '@/components/header/QuickSettingsPanel';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Calendar,
  Settings,
  Shield,
  Award,
  Building,
  Users,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  UserCheck,
  MapPin as MapPinIcon,
  Eye,
  EyeOff,
  Navigation
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userProfile = {
    name: user.user_metadata?.full_name || 'User',
    email: user.email || '',
    phone: '+1 (555) 123-4567',
    location: 'Montreal, QC',
    joinDate: 'January 2024',
    rating: 4.8,
    completedJobs: 127,
    isVerified: true,
    specialties: ['Plumbing', 'Electrical', 'General Repairs']
  };

  const handleRoleToggle = async () => {
    const newRole = currentRole === 'customer' ? 'provider' : 'customer';
    await switchRole(newRole);
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-16 pl-[188px] pr-[188px] pb-8">
          <div className="max-w-full">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                My Profile
              </h1>
              <p className="text-white/90 text-shadow">
                Manage your account information and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <Card className="fintech-card">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="mb-4">
                      <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
                      {userProfile.isVerified && (
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified User
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{userProfile.email}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{userProfile.phone}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {userProfile.joinDate}</span>
                      </div>
                    </div>

                    {/* Role Toggle */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
                          onClick={handleRoleToggle}
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

                    <Button className="w-full mt-4 fintech-button-secondary">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Quick Settings */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuickSettingsPanel />
                  </CardContent>
                </Card>

                {/* Personal Profile Stats */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="fintech-metric-card p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-bold">{userProfile.rating}</div>
                        <div className="text-sm opacity-70">Personal Rating</div>
                      </div>

                      <div className="fintech-metric-card p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Award className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold">{userProfile.completedJobs}</div>
                        <div className="text-sm opacity-70">Personal Jobs</div>
                      </div>

                      <div className="fintech-metric-card p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Users className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">45</div>
                        <div className="text-sm opacity-70">Network Connections</div>
                      </div>
                    </div>

                    {/* Personal Specialties */}
                    <div>
                      <h4 className="font-medium mb-3">Personal Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="bg-blue-500/20 text-blue-800">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Profile */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Business Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="fintech-metric-card p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-bold">4.9</div>
                        <div className="text-sm opacity-70">Business Rating</div>
                      </div>

                      <div className="fintech-metric-card p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Briefcase className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold">89</div>
                        <div className="text-sm opacity-70">Business Jobs</div>
                      </div>

                      <div className="fintech-metric-card p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Building className="h-6 w-6 text-purple-500" />
                        </div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm opacity-70">Team Members</div>
                      </div>
                    </div>

                    {/* Business Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Business Visibility Settings</h4>
                      
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-green-600" />
                            <Label className="text-sm font-medium">Show Business on Map</Label>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-gray-600" />
                            <Label className="text-sm font-medium">Business Privacy Zone: 5 km</Label>
                          </div>
                          <Slider defaultValue={[5]} min={1} max={25} step={1} className="w-full" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-green-600" />
                            <Label className="text-sm font-medium">Business Service Range: 50 km</Label>
                          </div>
                          <Slider defaultValue={[50]} min={5} max={100} step={1} className="w-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="fintech-inner-box flex items-center justify-between p-3">
                        <div>
                          <h4 className="font-medium">Plumbing Repair Completed</h4>
                          <p className="text-sm opacity-70">Downtown Montreal • 2 days ago</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <div className="fintech-inner-box flex items-center justify-between p-3">
                        <div>
                          <h4 className="font-medium">Electrical Installation</h4>
                          <p className="text-sm opacity-70">Westmount • 1 week ago</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <div className="fintech-inner-box flex items-center justify-between p-3">
                        <div>
                          <h4 className="font-medium">Kitchen Renovation</h4>
                          <p className="text-sm opacity-70">Plateau • 2 weeks ago</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;