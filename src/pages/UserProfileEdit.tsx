
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfileEdit = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: async () => {
      if (!username) throw new Error('Username is required');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_role_preferences(primary_role, secondary_roles, auto_switch_based_on_context)
        `)
        .eq('username', username)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!username
  });

  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    profession: '',
    company: '',
    website: '',
    phone: '',
    social_linkedin: '',
    social_facebook: '',
    privacy_level: 'public',
    show_contact_info: true,
    show_location: true,
    primary_role: 'customer',
    auto_switch_based_on_context: true
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        profession: profile.profession || '',
        company: profile.company || '',
        website: profile.website || '',
        phone: profile.phone || '',
        social_linkedin: profile.social_linkedin || '',
        social_facebook: profile.social_facebook || '',
        privacy_level: profile.privacy_level || 'public',
        show_contact_info: profile.show_contact_info,
        show_location: profile.show_location,
        primary_role: profile.user_role_preferences?.[0]?.primary_role || 'customer',
        auto_switch_based_on_context: profile.user_role_preferences?.[0]?.auto_switch_based_on_context || true
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!profile?.user_id) throw new Error('No profile found');
      
      // Update profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.full_name,
          bio: data.bio,
          location: data.location,
          profession: data.profession,
          company: data.company,
          website: data.website,
          phone: data.phone,
          social_linkedin: data.social_linkedin,
          social_facebook: data.social_facebook,
          privacy_level: data.privacy_level,
          show_contact_info: data.show_contact_info,
          show_location: data.show_location,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', profile.user_id);

      if (profileError) throw profileError;

      // Update role preferences
      const { error: roleError } = await supabase
        .from('user_role_preferences')
        .upsert({
          user_id: profile.user_id,
          primary_role: data.primary_role,
          auto_switch_based_on_context: data.auto_switch_based_on_context,
          updated_at: new Date().toISOString()
        });

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
      navigate(`/profile/${username}`);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Check if user owns this profile
  const isOwnProfile = user?.id === profile?.user_id;

  if (!isOwnProfile) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
          <div className="container mx-auto px-4 py-8">
            <Card className="fintech-card text-center py-16">
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">You can only edit your own profile.</p>
                <Button onClick={() => navigate(`/profile/${username}`)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 font-medium">Loading profile...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/profile/${username}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </div>
            
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="h-4 w-4" />
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo */}
            <div className="lg:col-span-1">
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={profile?.profile_image_url} alt={formData.full_name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {formData.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="flex items-center gap-2 mx-auto">
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Photo upload coming soon</p>
                </CardContent>
              </Card>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Province"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      placeholder="Your job title or profession"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Company or organization"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="social_linkedin">LinkedIn</Label>
                    <Input
                      id="social_linkedin"
                      value={formData.social_linkedin}
                      onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Platform Role Settings */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Platform Role Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primary_role">Primary Role</Label>
                    <Select value={formData.primary_role} onValueChange={(value) => handleInputChange('primary_role', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="provider">Service Provider</SelectItem>
                        <SelectItem value="fleet_manager">Fleet Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto_switch">Auto-switch based on context</Label>
                      <p className="text-sm text-gray-600">Automatically adapt interface based on your activity</p>
                    </div>
                    <Switch
                      id="auto_switch"
                      checked={formData.auto_switch_based_on_context}
                      onCheckedChange={(checked) => handleInputChange('auto_switch_based_on_context', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="privacy_level">Profile Visibility</Label>
                    <Select value={formData.privacy_level} onValueChange={(value) => handleInputChange('privacy_level', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can view</SelectItem>
                        <SelectItem value="connections">Connections Only</SelectItem>
                        <SelectItem value="private">Private - Only me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_contact_info">Show Contact Information</Label>
                    <Switch
                      id="show_contact_info"
                      checked={formData.show_contact_info}
                      onCheckedChange={(checked) => handleInputChange('show_contact_info', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_location">Show Location</Label>
                    <Switch
                      id="show_location"
                      checked={formData.show_location}
                      onCheckedChange={(checked) => handleInputChange('show_location', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileEdit;
