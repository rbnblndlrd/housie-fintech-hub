
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedUserProfile } from '@/types/userProfile';

export const useUnifiedProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UnifiedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced profile loading to prevent race conditions
  const debouncedLoadProfile = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (user && !loadingRef.current) {
        loadProfile();
      }
    }, 100);
  }, [user]);

  useEffect(() => {
    console.log('🔍 useUnifiedProfile: User changed:', { 
      hasUser: !!user, 
      userId: user?.id,
      email: user?.email,
      isCurrentlyLoading: loadingRef.current
    });
    
    if (user) {
      debouncedLoadProfile();
    } else {
      setLoading(false);
      setProfile(null);
      setError(null);
      loadingRef.current = false;
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [user, debouncedLoadProfile]);

  const loadProfile = async () => {
    if (!user || loadingRef.current) {
      console.log('❌ useUnifiedProfile: No user available or already loading');
      return;
    }

    console.log('🔄 useUnifiedProfile: Loading profile for user:', user.id);
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Check if profile exists first
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ useUnifiedProfile: Database error:', fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        console.log('📝 useUnifiedProfile: No profile found, creating default profile');
        // Create profile with minimal data to avoid serialization issues
        const profileData = {
          user_id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          can_provide_services: false,
          can_book_services: true,
          active_role: 'customer',
          profile_type: 'individual',
          achievement_badges: []
        };

        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(profileData)
          .select()
          .single();

        if (createError) {
          console.error('❌ useUnifiedProfile: Error creating profile:', createError);
          throw createError;
        }

        console.log('✅ useUnifiedProfile: Created new profile');
        
        // Clean data for serialization
        const cleanProfile: UnifiedUserProfile = {
          ...newProfile,
          active_role: (newProfile.active_role as "customer" | "provider") ?? 'customer',
          profile_type: (newProfile.profile_type as "individual" | "business") ?? 'individual',
          achievement_badges: Array.isArray(newProfile.achievement_badges) ? newProfile.achievement_badges : []
        };
        
        setProfile(cleanProfile);
        return;
      }

      // Clean existing profile data for serialization
      const cleanProfile: UnifiedUserProfile = {
        ...existingProfile,
        active_role: (existingProfile.active_role as "customer" | "provider") ?? 'customer',
        profile_type: (existingProfile.profile_type as "individual" | "business") ?? 'individual',
        achievement_badges: Array.isArray(existingProfile.achievement_badges) ? existingProfile.achievement_badges : []
      };

      console.log('✅ useUnifiedProfile: Profile loaded successfully');
      setProfile(cleanProfile);
      
    } catch (error: any) {
      console.error('❌ useUnifiedProfile: Error loading profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
      loadingRef.current = false;
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
