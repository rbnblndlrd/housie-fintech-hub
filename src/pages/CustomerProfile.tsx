
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Phone, Mail, MapPin, Settings, Heart, Clock } from 'lucide-react';
import Header from '@/components/Header';

interface CustomerProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  profile_image: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  preferred_contact_method: string;
  notification_preferences: boolean;
  service_categories: string[];
  budget_range_min: number;
  budget_range_max: number;
  accessibility_needs: string;
  special_instructions: string;
  preferred_timing: string;
}

interface DatabaseUser {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string;
  profile_image: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  preferred_contact_method: string | null;
  notification_preferences: boolean | null;
  service_categories: string[] | null;
  budget_range_min: number | null;
  budget_range_max: number | null;
  accessibility_needs: string | null;
  special_instructions: string | null;
  preferred_timing: string | null;
}

const CustomerProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchCustomerProfile();
    }
  }, [user]);

  const fetchCustomerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      // Transform database data to CustomerProfile format
      const databaseUser = data as DatabaseUser;
      const customerProfile: CustomerProfile = {
        id: databaseUser.id,
        full_name: databaseUser.full_name || '',
        phone: databaseUser.phone || '',
        email: databaseUser.email || '',
        profile_image: databaseUser.profile_image || '',
        address: databaseUser.address || '',
        city: databaseUser.city || '',
        province: databaseUser.province || '',
        postal_code: databaseUser.postal_code || '',
        preferred_contact_method: databaseUser.preferred_contact_method || 'email',
        notification_preferences: databaseUser.notification_preferences || false,
        service_categories: databaseUser.service_categories || [],
        budget_range_min: databaseUser.budget_range_min || 0,
        budget_range_max: databaseUser.budget_range_max || 0,
        accessibility_needs: databaseUser.accessibility_needs || '',
        special_instructions: databaseUser.special_instructions || '',
        preferred_timing: databaseUser.preferred_timing || 'flexible',
      };
      
      setProfile(customerProfile);
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      toast({
        title: "Error",
        description: "Failed to load customer profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile || !user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          province: profile.province,
          postal_code: profile.postal_code,
          preferred_contact_method: profile.preferred_contact_method,
          notification_preferences: profile.notification_preferences,
          budget_range_min: profile.budget_range_min,
          budget_range_max: profile.budget_range_max,
          accessibility_needs: profile.accessibility_needs,
          special_instructions: profile.special_instructions,
          preferred_timing: profile.preferred_timing,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <Header />
        <div className="pt-16 p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="fintech-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Profile Not Found</CardTitle>
                <CardDescription className="text-gray-600">
                  Unable to load your customer profile
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <Header />
      <div className="pt-16 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Profile</h1>
            <p className="text-gray-600">Manage your personal information and service preferences</p>
          </div>

          {/* Profile Overview Card */}
          <Card className="fintech-card">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.profile_image} />
                  <AvatarFallback className="bg-gray-100 text-gray-700">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {profile.full_name || 'Customer Profile'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    HOUSIE Customer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    value={profile.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input
                    value={profile.address || ''}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input
                      value={profile.city || ''}
                      onChange={(e) => setProfile({...profile, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <Input
                      value={profile.province || ''}
                      onChange={(e) => setProfile({...profile, province: e.target.value})}
                      placeholder="Province"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <Input
                    value={profile.postal_code || ''}
                    onChange={(e) => setProfile({...profile, postal_code: e.target.value})}
                    placeholder="Postal code"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Preferences */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Service Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={profile.budget_range_min || ''}
                      onChange={(e) => setProfile({...profile, budget_range_min: parseInt(e.target.value) || 0})}
                      placeholder="Min budget"
                    />
                    <Input
                      type="number"
                      value={profile.budget_range_max || ''}
                      onChange={(e) => setProfile({...profile, budget_range_max: parseInt(e.target.value) || 0})}
                      placeholder="Max budget"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Timing</label>
                  <Select
                    value={profile.preferred_timing || ''}
                    onValueChange={(value) => setProfile({...profile, preferred_timing: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                      <SelectItem value="weekend">Weekends</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Communication & Settings */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Communication & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                  <Select
                    value={profile.preferred_contact_method || ''}
                    onValueChange={(value) => setProfile({...profile, preferred_contact_method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="app">In-App Notifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <Switch
                    checked={profile.notification_preferences || false}
                    onCheckedChange={(checked) => setProfile({...profile, notification_preferences: checked})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility Needs</label>
                  <Textarea
                    value={profile.accessibility_needs || ''}
                    onChange={(e) => setProfile({...profile, accessibility_needs: e.target.value})}
                    placeholder="Describe any accessibility needs or requirements"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <Textarea
                    value={profile.special_instructions || ''}
                    onChange={(e) => setProfile({...profile, special_instructions: e.target.value})}
                    placeholder="Any special instructions for service providers"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveProfile}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
