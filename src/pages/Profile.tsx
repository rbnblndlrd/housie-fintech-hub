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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Palette,
  Camera,
  Save,
  Edit
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);

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

            {/* Profile Navigation */}
            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <User className="h-4 w-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="provider" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Provider
                  </TabsTrigger>
                  <TabsTrigger value="business" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <Building className="h-4 w-4 mr-2" />
                    Business
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-white/50 text-white data-[state=active]:text-gray-900">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  {/* Personal Profile Tab */}
                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Profile Overview */}
                      <div className="lg:col-span-1">
                        <Card className="fintech-card">
                          <CardContent className="p-6 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                              <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                                  {userProfile.name.split(' ').map(n => n[0]).join('')}
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
                          </CardContent>
                        </Card>
                      </div>

                      {/* Personal Profile Details */}
                      <div className="lg:col-span-3 space-y-6">
                        {/* Personal Information */}
                        <Card className="fintech-card">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Personal Information
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {editing ? 'Cancel' : 'Edit'}
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-4">
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
                          </CardContent>
                        </Card>

                        {/* Personal Stats */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle>Personal Statistics</CardTitle>
                          </CardHeader>
                          <CardContent>
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
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Provider Profile Tab */}
                  <TabsContent value="provider" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Provider Avatar */}
                      <div className="lg:col-span-1">
                        <Card className="fintech-card">
                          <CardContent className="p-6 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                              <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl">
                                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                                <Camera className="h-4 w-4" />
                              </Button>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Service Provider</Badge>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Provider Details */}
                      <div className="lg:col-span-3 space-y-6">
                        {/* Provider Stats */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Briefcase className="h-5 w-5" />
                              Provider Performance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
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
                          </CardContent>
                        </Card>

                        {/* Provider Specialties */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle>Provider Specialties</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {userProfile.specialties.map((specialty) => (
                                <Badge key={specialty} variant="secondary" className="bg-green-500/20 text-green-800">
                                  {specialty}
                                </Badge>
                              ))}
                              <Button variant="outline" size="sm">
                                <span className="text-lg mr-2">+</span>
                                Add Specialty
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Business Profile Tab */}
                  <TabsContent value="business" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Business Logo */}
                      <div className="lg:col-span-1">
                        <Card className="fintech-card">
                          <CardContent className="p-6 text-center">
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
                          </CardContent>
                        </Card>
                      </div>

                      {/* Business Details */}
                      <div className="lg:col-span-3 space-y-6">
                        {/* Business Stats */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building className="h-5 w-5" />
                              Business Performance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
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
                          </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card className="fintech-card">
                          <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Business Name</label>
                                <Input placeholder="Enter business name" className="mt-1" />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Industry</label>
                                <Input placeholder="Select industry" className="mt-1" />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Business Description</label>
                              <Textarea 
                                placeholder="Describe your business..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6">
                    <Card className="fintech-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Privacy & Visibility Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuickSettingsPanel />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;