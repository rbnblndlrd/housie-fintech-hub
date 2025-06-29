
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import ProfileNavigation from '@/components/ProfileNavigation';
import BusinessInfoSection from '@/components/provider/BusinessInfoSection';
import ServicesSection from '@/components/provider/ServicesSection';
import ContactInfoSection from '@/components/provider/ContactInfoSection';
import AvailabilitySection from '@/components/provider/AvailabilitySection';
import PrivacySettingsSection from '@/components/provider/PrivacySettingsSection';

interface ProviderProfile {
  id: string;
  business_name: string;
  description: string;
  years_experience: number;
  hourly_rate: number;
  service_radius_km: number;
  cra_compliant: boolean;
  verified: boolean;
  insurance_verified: boolean;
}

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  profile_image: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  show_on_map?: boolean;
  confidentiality_radius?: number;
}

const ProviderProfile = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileCreationError, setProfileCreationError] = useState<string | null>(null);

  // Redirect if role changes to customer
  useEffect(() => {
    if (currentRole === 'customer') {
      navigate('/customer-profile');
    }
  }, [currentRole, navigate]);

  useEffect(() => {
    if (user) {
      fetchProviderProfile();
      fetchUserProfile();
    }
  }, [user]);

  const fetchProviderProfile = async () => {
    try {
      console.log('🔍 Fetching provider profile for user:', user?.id);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching provider profile:', error);
        throw error;
      }

      if (data) {
        console.log('✅ Provider profile found:', data.business_name || 'Unnamed');
        setProviderProfile(data);
      } else {
        console.log('ℹ️ No provider profile found for user');
        setProviderProfile(null);
      }
    } catch (error: any) {
      console.error('❌ Error in fetchProviderProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load provider profile: " + error.message,
        variant: "destructive",
      });
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }
      
      setUserProfile(data);
    } catch (error: any) {
      console.error('❌ Error in fetchUserProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProviderProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      setProfileCreationError(null);
      
      console.log('🔄 Creating provider profile for user:', user.id);
      
      const profileData = {
        user_id: user.id,
        business_name: '',
        description: '',
        years_experience: 0,
        hourly_rate: 0,
        service_radius_km: 25,
        cra_compliant: false,
        verified: false,
        insurance_verified: false,
      };

      console.log('📤 Inserting provider profile with data:', profileData);

      const { data, error } = await supabase
        .from('provider_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ Provider profile creation failed:', {
          error: error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Provide specific error messages
        let errorMessage = "Failed to create provider profile";
        if (error.code === '23505') {
          errorMessage = "A provider profile already exists for this user";
        } else if (error.code === '42501') {
          errorMessage = "Permission denied. Please try logging out and back in";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setProfileCreationError(errorMessage);
        throw new Error(errorMessage);
      }

      if (!data) {
        const msg = "Provider profile creation returned no data";
        console.error('❌', msg);
        setProfileCreationError(msg);
        throw new Error(msg);
      }

      console.log('✅ Provider profile created successfully:', data);
      setProviderProfile(data);
      
      toast({
        title: "Success",
        description: "Provider profile created successfully! You can now complete your business information.",
      });

      // Refresh the profile to ensure we have the latest data
      setTimeout(() => {
        fetchProviderProfile();
      }, 1000);

    } catch (error: any) {
      console.error('❌ Error in createProviderProfile:', error);
      
      const errorMsg = error.message || "An unexpected error occurred";
      setProfileCreationError(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const retryProfileCreation = () => {
    setProfileCreationError(null);
    createProviderProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
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

  if (!providerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-16 p-6">
          <div className="max-w-4xl mx-auto">
            <ProfileNavigation profileType="provider" />
            <Card className="fintech-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Become a Service Provider
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Create your provider profile to start offering services on HOUSIE
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {profileCreationError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-900 mb-1">Profile Creation Failed</h4>
                        <p className="text-red-700 text-sm mb-3">{profileCreationError}</p>
                        <Button 
                          onClick={retryProfileCreation}
                          disabled={saving}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          {saving ? 'Retrying...' : 'Try Again'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={createProviderProfile}
                  disabled={saving}
                  className="fintech-button-primary"
                >
                  {saving ? 'Creating Profile...' : 'Create Provider Profile'}
                </Button>
                
                <div className="text-xs text-gray-500 mt-4">
                  <p>Having trouble? Make sure you're logged in and try refreshing the page.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      <div className="pt-16 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <ProfileNavigation profileType="provider" />
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Profile</h1>
            <p className="text-gray-600">Manage your business information and services</p>
          </div>

          {/* Profile Overview Card */}
          <Card className="fintech-card">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
                  {providerProfile.business_name ? 
                    providerProfile.business_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 
                    <User className="h-8 w-8" />
                  }
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {providerProfile.business_name || userProfile?.full_name || 'New Provider'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {providerProfile.verified ? '✅ Verified Provider' : '⏳ Pending Verification'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BusinessInfoSection 
              providerProfile={providerProfile}
              setProviderProfile={setProviderProfile}
            />
            <ContactInfoSection 
              userProfile={userProfile}
              setUserProfile={setUserProfile}
            />
            <ServicesSection 
              providerId={providerProfile.id}
            />
            <AvailabilitySection 
              providerId={providerProfile.id}
            />
            
            {/* Add Privacy Settings Section */}
            <div className="lg:col-span-2">
              <PrivacySettingsSection
                userId={user?.id || ''}
                showOnMap={userProfile?.show_on_map}
                confidentialityRadius={userProfile?.confidentiality_radius}
                onSettingsUpdate={fetchUserProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
