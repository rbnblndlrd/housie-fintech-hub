
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Save
} from 'lucide-react';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();

  // Redirect if role changes to provider
  useEffect(() => {
    if (currentRole === 'provider') {
      navigate('/provider-profile');
    }
  }, [currentRole, navigate]);

  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    bio: user?.user_metadata?.bio || '',
    profileImage: user?.user_metadata?.avatar_url || ''
  });

  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setEditing(false);
    console.log('Saving profile:', profile);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              onClick={() => navigate('/customer-dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            </div>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="fintech-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <Button
                      variant={editing ? "default" : "outline"}
                      onClick={() => setEditing(!editing)}
                    >
                      {editing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.profileImage} />
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-lg">
                        {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {editing && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      disabled={!editing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address"
                      disabled={!editing}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us a bit about yourself"
                      rows={3}
                      disabled={!editing}
                    />
                  </div>

                  {editing && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditing(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Stats & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Stats */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Total Bookings</span>
                    </div>
                    <span className="font-semibold">12</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Average Rating</span>
                    </div>
                    <span className="font-semibold">4.8</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Member Since</span>
                    </div>
                    <span className="font-semibold">Jan 2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/customer-bookings')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View My Bookings
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/customer-settings')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/services')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Book New Service
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>support@housie.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>1-800-HOUSIE</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
