
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedUserProfile } from '@/types/userProfile';

export const useUnifiedProfile = () => {
  const user = useUser();
  const [profile, setProfile] = useState<UnifiedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

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

      // Cast the data with proper type assertions
      const typedProfile: UnifiedUserProfile = {
        ...data,
        active_role: (data.active_role as "customer" | "provider" | "commercial") ?? 'customer',
        profile_type: (data.profile_type as "commercial" | "individual" | "business") ?? 'individual',
        achievement_badges: (data.achievement_badges as any[]) ?? []
      };

      setProfile(typedProfile);
    } catch (error: any) {
      console.error('Error loading unified profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UnifiedUserProfile>) => {
    if (!user || !profile) {
      throw new Error('No user or profile found');
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Cast the returned data with proper type assertions
      const typedProfile: UnifiedUserProfile = {
        ...data,
        active_role: (data.active_role as "customer" | "provider" | "commercial") ?? 'customer',
        profile_type: (data.profile_type as "commercial" | "individual" | "business") ?? 'individual',
        achievement_badges: (data.achievement_badges as any[]) ?? []
      };

      setProfile(typedProfile);
      return typedProfile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const enableProviderMode = async () => {
    if (!user) {
      throw new Error('No user found');
    }

    try {
      const updates = {
        can_provide_services: true,
        active_role: 'provider' as const,
        verification_level: 'basic',
        verified: false,
        background_check_verified: false,
        professional_license_verified: false,
        insurance_verified: false,
        cra_compliant: false,
        years_experience: 0,
        service_radius_km: 25,
        total_bookings: 0,
        total_reviews: 0,
        community_rating_points: 0,
        shop_points: 0,
        quality_commendations: 0,
        reliability_commendations: 0,
        courtesy_commendations: 0,
        achievement_badges: [],
        network_connections_count: 0
      };

      return await updateProfile(updates);
    } catch (error) {
      console.error('Error enabling provider mode:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    enableProviderMode
  };
};
