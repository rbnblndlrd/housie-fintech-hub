
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  Eye, 
  EyeOff, 
  MapPin, 
  Bell, 
  CreditCard, 
  Settings,
  Lock,
  Globe,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showJobsOnMap: true,
    showRequestsOnMap: false,
    showOpportunitiesOnMap: true,
    allowDirectMessages: true,
    showContactInfo: false,
    showRatings: true,
    showCompletedJobs: true
  });

  // Comfort Zone Settings
  const [comfortZoneSettings, setComfortZoneSettings] = useState({
    backgroundCheckRequired: false,
    verifiedProvidersOnly: true,
    serviceRadius: 25,
    allowEmergencyBookings: true,
    requireDeposit: false,
    minimumRating: 4.0
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    paymentAlerts: true
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your profile settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Profile Settings
              </h1>
              <p className="text-white/90 text-shadow">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs defaultValue="privacy" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full max-w-3xl bg-white/10 backdrop-blur-md">
                <TabsTrigger value="privacy" className="text-white data-[state=active]:bg-white/20">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="comfort" className="text-white data-[state=active]:bg-white/20">
                  <Lock className="h-4 w-4 mr-2" />
                  Comfort Zone
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-white/20">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="account" className="text-white data-[state=active]:bg-white/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="privacy" className="space-y-6">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Public Visibility Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium">Public Profile</Label>
                        <p className="text-white/70 text-sm">Allow others to view your profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.publicProfile}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, publicProfile: checked }))
                        }
                      />
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Show Jobs on Map
                        </Label>
                        <p className="text-white/70 text-sm">Display your completed jobs on the public map</p>
                      </div>
                      <Switch
                        checked={privacySettings.showJobsOnMap}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, showJobsOnMap: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Show Requests on Map
                        </Label>
                        <p className="text-white/70 text-sm">Display your service requests on the public map</p>
                      </div>
                      <Switch
                        checked={privacySettings.showRequestsOnMap}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, showRequestsOnMap: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Show Opportunities on Map
                        </Label>
                        <p className="text-white/70 text-sm">Display available opportunities on the public map</p>
                      </div>
                      <Switch
                        checked={privacySettings.showOpportunitiesOnMap}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, showOpportunitiesOnMap: checked }))
                        }
                      />
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium">Show Contact Information</Label>
                        <p className="text-white/70 text-sm">Allow verified users to see your contact details</p>
                      </div>
                      <Switch
                        checked={privacySettings.showContactInfo}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, showContactInfo: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium">Show Ratings & Reviews</Label>
                        <p className="text-white/70 text-sm">Display your ratings and reviews publicly</p>
                      </div>
                      <Switch
                        checked={privacySettings.showRatings}
                        onCheckedChange={(checked) => 
                          setPrivacySettings(prev => ({ ...prev, showRatings: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comfort" className="space-y-6">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Comfort Zone (Confidentiality)
                    </CardTitle>
                    <p className="text-white/70">Configure your safety and comfort preferences</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Background Check Required
                        </Label>
                        <p className="text-white/70 text-sm">Only work with providers who have background checks</p>
                      </div>
                      <Switch
                        checked={comfortZoneSettings.backgroundCheckRequired}
                        onCheckedChange={(checked) => 
                          setComfortZoneSettings(prev => ({ ...prev, backgroundCheckRequired: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium">Verified Providers Only</Label>
                        <p className="text-white/70 text-sm">Only show verified service providers</p>
                        <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-400/30">
                          Recommended
                        </Badge>
                      </div>
                      <Switch
                        checked={comfortZoneSettings.verifiedProvidersOnly}
                        onCheckedChange={(checked) => 
                          setComfortZoneSettings(prev => ({ ...prev, verifiedProvidersOnly: checked }))
                        }
                      />
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="space-y-2">
                      <Label className="text-white font-medium">Service Radius (km)</Label>
                      <Input
                        type="number"
                        value={comfortZoneSettings.serviceRadius}
                        onChange={(e) => 
                          setComfortZoneSettings(prev => ({ ...prev, serviceRadius: Number(e.target.value) }))
                        }
                        className="bg-white/10 border-white/20 text-white"
                        min="1"
                        max="100"
                      />
                      <p className="text-white/70 text-sm">Maximum distance for service providers</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-medium">Minimum Provider Rating</Label>
                      <Input
                        type="number"
                        value={comfortZoneSettings.minimumRating}
                        onChange={(e) => 
                          setComfortZoneSettings(prev => ({ ...prev, minimumRating: Number(e.target.value) }))
                        }
                        className="bg-white/10 border-white/20 text-white"
                        min="1"
                        max="5"
                        step="0.1"
                      />
                      <p className="text-white/70 text-sm">Only show providers with this rating or higher</p>
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Allow Emergency Bookings
                        </Label>
                        <p className="text-white/70 text-sm">Accept urgent service requests outside normal hours</p>
                      </div>
                      <Switch
                        checked={comfortZoneSettings.allowEmergencyBookings}
                        onCheckedChange={(checked) => 
                          setComfortZoneSettings(prev => ({ ...prev, allowEmergencyBookings: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-white font-medium">Require Deposit</Label>
                        <p className="text-white/70 text-sm">Require upfront payment before service starts</p>
                      </div>
                      <Switch
                        checked={comfortZoneSettings.requireDeposit}
                        onCheckedChange={(checked) => 
                          setComfortZoneSettings(prev => ({ ...prev, requireDeposit: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">First Name</Label>
                        <Input className="bg-white/10 border-white/20 text-white" defaultValue="Lamarre" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Last Name</Label>
                        <Input className="bg-white/10 border-white/20 text-white" defaultValue="" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email</Label>
                      <Input className="bg-white/10 border-white/20 text-white" defaultValue={user?.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Phone</Label>
                      <Input className="bg-white/10 border-white/20 text-white" placeholder="Enter phone number" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">City</Label>
                        <Input className="bg-white/10 border-white/20 text-white" defaultValue="Montreal" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Province</Label>
                        <Input className="bg-white/10 border-white/20 text-white" defaultValue="QC" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries({
                      emailNotifications: "Email Notifications",
                      smsNotifications: "SMS Notifications", 
                      pushNotifications: "Push Notifications",
                      marketingEmails: "Marketing Emails",
                      bookingReminders: "Booking Reminders",
                      paymentAlerts: "Payment Alerts"
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-white font-medium">{label}</Label>
                        <Switch
                          checked={notificationSettings[key as keyof typeof notificationSettings]}
                          onCheckedChange={(checked) => 
                            setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-6">
              <Button 
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-8"
              >
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
