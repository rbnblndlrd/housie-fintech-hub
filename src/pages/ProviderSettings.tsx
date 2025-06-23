
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  CreditCard, 
  Shield,
  Clock,
  ArrowLeft
} from 'lucide-react';

const ProviderSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    businessName: '',
    description: '',
    phone: '',
    email: user?.email || '',
    notifications: {
      bookingRequests: true,
      messages: true,
      reviews: true,
      marketing: false
    },
    availability: {
      autoAccept: false,
      advanceNotice: 2,
      maxBookingsPerDay: 5
    }
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // TODO: Implement save functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/provider-dashboard')}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Provider Settings</h1>
            </div>
            <p className="text-gray-600">Manage your business profile and preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Business Information */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => setSettings({...settings, description: e.target.value})}
                    placeholder="Describe your services and experience..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Availability Settings */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Availability Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoAccept">Auto-accept bookings</Label>
                    <p className="text-sm text-gray-600">Automatically accept bookings that meet your criteria</p>
                  </div>
                  <Switch
                    id="autoAccept"
                    checked={settings.availability.autoAccept}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        availability: {...settings.availability, autoAccept: checked}
                      })
                    }
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="advanceNotice">Minimum advance notice (hours)</Label>
                    <Input
                      id="advanceNotice"
                      type="number"
                      value={settings.availability.advanceNotice}
                      onChange={(e) => setSettings({
                        ...settings,
                        availability: {...settings.availability, advanceNotice: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxBookings">Max bookings per day</Label>
                    <Input
                      id="maxBookings"
                      type="number"
                      value={settings.availability.maxBookingsPerDay}
                      onChange={(e) => setSettings({
                        ...settings,
                        availability: {...settings.availability, maxBookingsPerDay: parseInt(e.target.value)}
                      })}
                    />
                  </div>
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
              <CardContent className="space-y-4">
                {Object.entries({
                  bookingRequests: 'New booking requests',
                  messages: 'Customer messages',
                  reviews: 'New reviews and ratings',
                  marketing: 'Marketing and promotional emails'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    <Switch
                      id={key}
                      checked={settings.notifications[key as keyof typeof settings.notifications]}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings,
                          notifications: {...settings.notifications, [key]: checked}
                        })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Email Verified</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-800 font-medium">Phone Verification</span>
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Background Check</span>
                    <Button variant="outline" size="sm">Start</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">Payment Method</p>
                    <p className="text-blue-600 text-sm">Bank transfer • **** 1234</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Update Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="px-8">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettings;
