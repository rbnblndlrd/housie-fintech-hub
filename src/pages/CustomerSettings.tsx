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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  User,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Save
} from 'lucide-react';

const CustomerSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();

  // Redirect if role changes to provider
  useEffect(() => {
    if (currentRole === 'provider') {
      navigate('/provider-settings');
    }
  }, [currentRole, navigate]);

  const [settings, setSettings] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    bio: user?.user_metadata?.bio || '',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    smsNotifications: true
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
    console.log('Saving settings:', settings);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
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
              <h1 className="text-4xl font-bold text-gray-900">Customer Settings</h1>
            </div>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="fintech-card mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={settings.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us a bit about yourself"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive booking updates via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Get instant updates on your device</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive text messages for important updates</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-gray-600">Receive promotional offers and news</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleInputChange('marketingEmails', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1">
              <Card className="fintech-card mb-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/customer-profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Public Profile
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/customer-bookings')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/customer-bookings')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Security
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/services')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Location Settings
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

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} className="px-8">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
