
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Phone, Mail, Image } from 'lucide-react';
import BusinessInfoSection from '@/components/provider/BusinessInfoSection';
import ServicesSection from '@/components/provider/ServicesSection';
import ContactInfoSection from '@/components/provider/ContactInfoSection';
import AvailabilitySection from '@/components/provider/AvailabilitySection';

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
}

const ProviderProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProviderProfile();
      fetchUserProfile();
    }
  }, [user]);

  const fetchProviderProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProviderProfile(data);
    } catch (error) {
      console.error('Error fetching provider profile:', error);
      toast({
        title: "Error",
        description: "Failed to load provider profile",
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

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProviderProfile = async () => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('provider_profiles')
        .insert({
          user_id: user?.id,
          business_name: '',
          description: '',
          years_experience: 0,
          hourly_rate: 0,
          service_radius_km: 10,
          cra_compliant: false,
          verified: false,
          insurance_verified: false,
        })
        .select()
        .single();

      if (error) throw error;

      setProviderProfile(data);
      toast({
        title: "Success",
        description: "Provider profile created successfully",
      });
    } catch (error) {
      console.error('Error creating provider profile:', error);
      toast({
        title: "Error",
        description: "Failed to create provider profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="fintech-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Become a Service Provider
              </CardTitle>
              <CardDescription className="text-gray-600">
                Create your provider profile to start offering services on HOUSIE
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={createProviderProfile}
                disabled={saving}
                className="fintech-button-primary"
              >
                {saving ? 'Creating Profile...' : 'Create Provider Profile'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Profile</h1>
          <p className="text-gray-600">Manage your business information and services</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="fintech-card">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile?.profile_image} />
                <AvatarFallback className="bg-gray-100 text-gray-700">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  {providerProfile.business_name || userProfile?.full_name}
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
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
