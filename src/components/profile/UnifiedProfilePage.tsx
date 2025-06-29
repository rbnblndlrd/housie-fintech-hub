
import React, { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RoleSwitcher from './RoleSwitcher';
import CustomerProfileView from './CustomerProfileView';
import ProviderProfileView from './ProviderProfileView';

const UnifiedProfilePage = () => {
  const user = useUser();
  const { currentRole } = useRoleSwitch();
  const [profile, setProfile] = useState<UnifiedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, currentRole]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Map the data to match UnifiedUserProfile interface, providing defaults for missing fields
      const mappedProfile: UnifiedUserProfile = {
        id: data.id,
        user_id: data.user_id,
        username: data.username,
        full_name: data.full_name,
        bio: data.bio,
        profile_image_url: data.profile_image_url,
        location: data.location,
        phone: data.phone,
        website: data.website,
        company: data.company,
        profession: data.profession,
        
        // Role capabilities (with proper type casting)
        can_provide_services: data.can_provide_services ?? false,
        can_book_services: data.can_book_services ?? true,
        active_role: (data.active_role as "customer" | "provider") ?? 'customer',
        profile_type: (data.profile_type as "individual" | "business") ?? 'individual',
        
        // Provider-specific fields (with defaults)
        business_name: data.business_name,
        description: data.description,
        years_experience: data.years_experience ?? 0,
        hourly_rate: data.hourly_rate,
        service_radius_km: data.service_radius_km ?? 25,
        verification_level: data.verification_level ?? 'basic',
        verified: data.verified ?? false,
        background_check_verified: data.background_check_verified ?? false,
        professional_license_verified: data.professional_license_verified ?? false,
        professional_license_type: data.professional_license_type,
        insurance_verified: data.insurance_verified ?? false,
        cra_compliant: data.cra_compliant ?? false,
        rbq_verified: data.rbq_verified ?? false,
        ccq_verified: data.ccq_verified ?? false,
        rbq_license_number: data.rbq_license_number,
        ccq_license_number: data.ccq_license_number,
        
        // Performance metrics (with defaults)
        total_bookings: data.total_bookings ?? 0,
        total_reviews: data.total_reviews_received ?? 0,
        total_reviews_received: data.total_reviews_received ?? 0,
        average_rating: data.average_rating ?? 0,
        response_time_hours: data.response_time_hours,
        community_rating_points: data.community_rating_points ?? 0,
        shop_points: data.shop_points ?? 0,
        quality_commendations: data.quality_commendations ?? 0,
        reliability_commendations: data.reliability_commendations ?? 0,
        courtesy_commendations: data.courtesy_commendations ?? 0,
        achievement_badges: (data.achievement_badges as any[]) ?? [],
        network_connections_count: data.network_connections_count ?? 0,
        network_points: data.network_points ?? 0,
        
        // Privacy settings (with defaults)
        privacy_level: data.privacy_level ?? 'public',
        show_location: data.show_location ?? true,
        show_contact_info: data.show_contact_info ?? true,
        is_verified: data.is_verified ?? false,
        
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setProfile(mappedProfile);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <RoleSwitcher />
      </div>

      {currentRole === 'customer' && <CustomerProfileView profile={profile} />}
      {currentRole === 'provider' && <ProviderProfileView profile={profile} />}
    </div>
  );
};

export default UnifiedProfilePage;
