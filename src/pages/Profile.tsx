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
                    {/* Main Personal Profile Card */}
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
                              <Button variant="outline" size="sm">
                                <ToggleLeft className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium">Show Contact Information</h4>
                                <p className="text-sm text-gray-600">Allow other users to see your contact details</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <ToggleRight className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Provider Profile Tab */}
                  <TabsContent value="provider" className="space-y-6">
                    {/* Main Provider Profile Card */}
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
                                    {userProfile.name.split(' ').map(n => n[0]).join('')}
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

                        {/* Provider Specialties */}
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold mb-4">Provider Specialties</h3>
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
                              <Button variant="outline" size="sm">
                                <ToggleRight className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium">Show Provider Ratings</h4>
                                <p className="text-sm text-gray-600">Allow customers to see your provider ratings and reviews</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <ToggleRight className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium">Provider Profile Visibility</h4>
                                <p className="text-sm text-gray-600">Make your provider profile publicly searchable</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <ToggleRight className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Business Profile Tab */}
                  <TabsContent value="business" className="space-y-6">
                    {/* Main Business Profile Card */}
                    <Card className="fintech-card relative overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Business Profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Business Banner Background */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-orange-500/20 to-pink-500/20 opacity-30"
                          style={{
                            backgroundImage: `url('/lovable-uploads/c36ac505-ca7b-4431-ab6e-318a8be7da6e.png')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                        
                        {/* Profile Overview & Stats Container */}
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
                          {/* Business Logo Section */}
                          <div className="lg:col-span-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center border">
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
                                <div className="fintech-metric-card p-4 text-center bg-white/80">
                                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                                  <div className="text-2xl font-bold">4.9</div>
                                  <div className="text-sm opacity-70">Business Rating</div>
                                </div>
                                <div className="fintech-metric-card p-4 text-center bg-white/80">
                                  <Briefcase className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                  <div className="text-2xl font-bold">89</div>
                                  <div className="text-sm opacity-70">Business Jobs</div>
                                </div>
                                <div className="fintech-metric-card p-4 text-center bg-white/80">
                                  <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                                  <div className="text-2xl font-bold">12</div>
                                  <div className="text-sm opacity-70">Team Members</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Business Information */}
                        <div className="relative z-10 border-t pt-6">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
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
                        </div>

                        {/* Business Privacy Settings */}
                        <div className="relative z-10 border-t pt-6">
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
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
                                <Button variant="outline" size="sm">
                                  <ToggleRight className="h-4 w-4 text-blue-600" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h4 className="font-medium">Business Directory Listing</h4>
                                  <p className="text-sm text-gray-600">Include your business in public directory searches</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  <ToggleRight className="h-4 w-4 text-blue-600" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h4 className="font-medium">Business Contact Information</h4>
                                  <p className="text-sm text-gray-600">Show business phone and email to potential customers</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  <ToggleRight className="h-4 w-4 text-blue-600" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h4 className="font-medium">Team Member Visibility</h4>
                                  <p className="text-sm text-gray-600">Display team member profiles on your business page</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  <ToggleLeft className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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