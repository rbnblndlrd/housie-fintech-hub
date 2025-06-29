
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ProviderOnboarding from '@/components/profile/ProviderOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Briefcase, 
  Mail, 
  MapPin, 
  Star,
  Settings,
  Shield,
  Crown
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { currentRole, availableRoles, switchRole } = useRoleSwitch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [canProvideServices, setCanProvideServices] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkProviderCapability();
    }
  }, [user]);

  const checkProviderCapability = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('can_provide_services')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setCanProvideServices(data?.can_provide_services || false);
    } catch (error) {
      console.error('Error checking provider capability:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRoleSwitch = async (newRole: string) => {
    try {
      await switchRole(newRole as 'customer' | 'provider');
      toast({
        title: "Role Switched",
        description: `Switched to ${newRole} mode successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch role",
        variant: "destructive",
      });
    }
  };

  const handleProviderEnabled = () => {
    setCanProvideServices(true);
    // Refresh the page to update role context
    window.location.reload();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer':
        return <User className="h-4 w-4" />;
      case 'provider':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'customer':
        return 'Customer';
      case 'provider':
        return 'Service Provider';
      default:
        return role;
    }
  };

  const userInitials = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{user.email}</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Montreal, QC</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>4.8 Rating</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Onboarding or Role Management */}
              {!canProvideServices ? (
                <ProviderOnboarding onProviderEnabled={handleProviderEnabled} />
              ) : (
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-purple-600" />
                      Role Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Current Role
                        </label>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-base px-3 py-1">
                          {getRoleIcon(currentRole)}
                          <span className="ml-2">{getRoleLabel(currentRole)}</span>
                        </Badge>
                      </div>

                      {availableRoles.length > 1 && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Switch Role
                          </label>
                          <Select value={currentRole} onValueChange={handleRoleSwitch}>
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(currentRole)}
                                  {getRoleLabel(currentRole)}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {availableRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  <div className="flex items-center gap-2">
                                    {getRoleIcon(role)}
                                    {getRoleLabel(role)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            Switch between customer and provider modes
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/dashboard')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/calendar')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Calendar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/social')}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Network & Reviews
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Email Verified</span>
                      <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profile Complete</span>
                      <Badge className="bg-blue-100 text-blue-800">85%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Provider Mode</span>
                      <Badge className={canProvideServices ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {canProvideServices ? "✓ Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
