
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedUserProfile } from '@/types/userProfile';

export const useUnifiedProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UnifiedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 useUnifiedProfile: User changed:', { 
      hasUser: !!user, 
      userId: user?.id,
      email: user?.email 
    });
    
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
      setProfile(null);
      setError(null);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      console.log('❌ useUnifiedProfile: No user available');
      setLoading(false);
      return;
    }

    console.log('🔄 useUnifiedProfile: Loading profile for user:', user.id);
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ useUnifiedProfile: Database error:', fetchError);
        throw fetchError;
      }

      if (!data) {
        console.log('📝 useUnifiedProfile: No profile found, creating default profile');
        // Create a default profile if none exists
        const defaultProfile = {
          user_id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || user.email || 'User',
          can_provide_services: false,
          can_book_services: true,
          active_role: 'customer' as const,
          profile_type: 'individual' as const,
          achievement_badges: []
        };

        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (createError) {
          console.error('❌ useUnifiedProfile: Error creating profile:', createError);
          throw createError;
        }

        console.log('✅ useUnifiedProfile: Created new profile:', newProfile);
        setProfile(newProfile as UnifiedUserProfile);
        return;
      }

      // Cast the data with proper type assertions
      const typedProfile: UnifiedUserProfile = {
        ...data,
        active_role: (data.active_role as "customer" | "provider") ?? 'customer',
        profile_type: (data.profile_type as "individual" | "business") ?? 'individual',
        achievement_badges: (data.achievement_badges as any[]) ?? []
      };

      console.log('✅ useUnifiedProfile: Profile loaded successfully:', {
        id: typedProfile.id,
        username: typedProfile.username,
        active_role: typedProfile.active_role,
        can_provide_services: typedProfile.can_provide_services
      });

      setProfile(typedProfile);
    } catch (error: any) {
      console.error('❌ useUnifiedProfile: Error loading profile:', error);
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
        active_role: (data.active_role as "customer" | "provider") ?? 'customer',
        profile_type: (data.profile_type as "individual" | "business") ?? 'individual',
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

      const result = await updateProfile(updates);
      console.log('✅ Provider mode enabled via useUnifiedProfile');
      return result;
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
