
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RoleSwitchContextType } from '@/types/userProfile';

const RoleSwitchContext = createContext<RoleSwitchContextType | undefined>(undefined);

export const useRoleSwitch = () => {
  const context = useContext(RoleSwitchContext);
  if (!context) {
    throw new Error('useRoleSwitch must be used within a RoleSwitchProvider');
  }
  return context;
};

export const RoleSwitchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [currentRole, setCurrentRole] = useState<'customer' | 'provider'>('customer');
  const [availableRoles, setAvailableRoles] = useState<string[]>(['customer']);
  const [canSwitchToProvider, setCanSwitchToProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadingRef = useRef(false);
  const isInitializedRef = useRef(false);

  console.log('🔄 RoleSwitchProvider render:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    authLoading,
    currentRole, 
    availableRoles,
    canSwitchToProvider,
    isLoading,
    loadingInProgress: loadingRef.current
  });

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current && !authLoading) {
      return;
    }

    // Wait for AuthProvider to finish loading before proceeding
    if (authLoading) {
      console.log('🔄 Waiting for AuthProvider to finish loading...');
      return;
    }

    if (user) {
      console.log('🔄 Loading user capabilities for:', user.email);
      isInitializedRef.current = true;
      loadUserCapabilities();
    } else {
      console.log('🔄 No user, resetting to defaults');
      resetToDefaults();
      isInitializedRef.current = false;
    }
  }, [user, authLoading]);

  const resetToDefaults = () => {
    setCurrentRole('customer');
    setAvailableRoles(['customer']);
    setCanSwitchToProvider(false);
    setIsLoading(false);
    loadingRef.current = false;
  };

  const loadUserCapabilities = async () => {
    if (!user || authLoading || loadingRef.current) {
      console.log('🔄 Skipping loadUserCapabilities - conditions not met:', {
        hasUser: !!user,
        authLoading,
        alreadyLoading: loadingRef.current
      });
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    
    try {
      console.log('🔄 Fetching user profile from database...');
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('🔍 Database query result:', { 
        profile, 
        error, 
        user_id: user.id,
        error_code: error?.code,
        error_message: error?.message,
        error_details: error?.details
      });

      if (error) {
        console.error('❌ Database error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        if (error.code === 'PGRST116') {
          console.log('⚠️ No profile found, creating default profile...');
          await createDefaultProfile();
          return;
        }
        
        // Don't reset everything for database errors - try to continue
        console.warn('⚠️ Database error, but continuing with defaults');
        resetToDefaults();
        return;
      }

      if (!profile) {
        console.log('⚠️ No profile found, creating default profile...');
        await createDefaultProfile();
        return;
      }

      console.log('✅ Profile loaded successfully:', { 
        activeRole: profile.active_role,
        canProvideServices: profile.can_provide_services,
        canBookServices: profile.can_book_services,
        profileId: profile.id,
        rawCanProvideServices: JSON.stringify(profile.can_provide_services),
        typeOfCanProvideServices: typeof profile.can_provide_services
      });
      
      // Validate and set active role with fallback
      const activeRole = validateRole(profile.active_role) || 'customer';
      console.log('🎯 Setting current role to:', activeRole);
      setCurrentRole(activeRole);
      
      // Build available roles - Always start with customer
      const roles = ['customer'];
      
      // Check provider capabilities with proper type handling
      const hasProviderCapability = checkProviderCapability(profile.can_provide_services);
      
      console.log('🔍 PROVIDER CAPABILITY CHECK:', {
        rawValue: profile.can_provide_services,
        valueType: typeof profile.can_provide_services,
        finalResult: hasProviderCapability
      });
      
      if (hasProviderCapability) {
        roles.push('provider');
        setCanSwitchToProvider(true);
        console.log('✅ PROVIDER MODE AVAILABLE - adding provider role');
      } else {
        setCanSwitchToProvider(false);
        console.log('⚠️ Provider mode NOT available');
      }
      
      console.log('🎯 FINAL ROLES CONFIGURATION:', {
        availableRoles: roles,
        canSwitchToProvider: hasProviderCapability,
        activeRole,
        roleCount: roles.length
      });
      
      setAvailableRoles(roles);
      
      // Synchronize role preferences
      await syncRolePreferences(activeRole);
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR in loadUserCapabilities:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        user_id: user?.id,
        user_email: user?.email
      });
      
      // Don't completely fail - set safe defaults but log the error
      console.warn('⚠️ Setting safe defaults due to error');
      resetToDefaults();
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  };

  const checkProviderCapability = (canProvideServices: any): boolean => {
    // Handle different types of truthy values
    if (typeof canProvideServices === 'boolean') {
      return canProvideServices;
    }
    if (typeof canProvideServices === 'string') {
      return canProvideServices.toLowerCase() === 'true';
    }
    // Handle null, undefined, or other falsy values
    return false;
  };

  const createDefaultProfile = async () => {
    if (!user) return;

    try {
      console.log('🔧 Creating default profile for user:', user.id);
      
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          active_role: 'customer',
          can_provide_services: false,
          can_book_services: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating profile:', insertError);
        resetToDefaults();
        return;
      }

      // Also create user_role_preferences
      const { error: roleError } = await supabase
        .from('user_role_preferences')
        .insert({
          user_id: user.id,
          primary_role: 'customer'
        });

      if (roleError) {
        console.error('⚠️ Error creating role preferences:', roleError);
      }

      console.log('✅ Default profile created:', newProfile);
      setCurrentRole('customer');
      setAvailableRoles(['customer']);
      setCanSwitchToProvider(false);
    } catch (error) {
      console.error('❌ Error creating default profile:', error);
      resetToDefaults();
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  };

  const validateRole = (role: any): 'customer' | 'provider' | null => {
    if (role === 'customer' || role === 'provider') {
      return role;
    }
    return null;
  };

  const syncRolePreferences = async (activeRole: 'customer' | 'provider') => {
    if (!user) return;

    try {
      const { error: syncError } = await supabase
        .from('user_role_preferences')
        .upsert({
          user_id: user.id,
          primary_role: activeRole
        });

      if (syncError) {
        console.warn('⚠️ Could not sync role preferences:', syncError);
      } else {
        console.log('✅ Role preferences synchronized');
      }
    } catch (syncErr) {
      console.warn('⚠️ Error syncing role preferences:', syncErr);
    }
  };

  const switchRole = async (newRole: 'customer' | 'provider') => {
    if (!user) {
      throw new Error('No user authenticated');
    }

    if (authLoading) {
      console.log('⚠️ Cannot switch role while auth is loading');
      throw new Error('Authentication is still loading. Please wait.');
    }

    if (!availableRoles.includes(newRole)) {
      console.error('❌ Cannot switch to role:', newRole, 'Available roles:', availableRoles);
      throw new Error(`Cannot switch to role: ${newRole}. Available roles: ${availableRoles.join(', ')}`);
    }

    console.log('🔄 Switching role from', currentRole, 'to', newRole);

    try {
      // Update both tables to maintain consistency
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ active_role: newRole })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('❌ Error updating user_profiles:', profileError);
        throw profileError;
      }

      const { error: preferencesError } = await supabase
        .from('user_role_preferences')
        .update({ primary_role: newRole })
        .eq('user_id', user.id);

      if (preferencesError) {
        console.error('❌ Error updating user_role_preferences:', preferencesError);
        throw preferencesError;
      }

      setCurrentRole(newRole);
      console.log('✅ Role switched successfully to:', newRole, 'Available roles remain:', availableRoles);
    } catch (error) {
      console.error('❌ Error switching role:', error);
      throw error;
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 FORCE REFRESH: Reloading user capabilities...');
    if (authLoading || loadingRef.current) {
      console.log('⚠️ Cannot refresh while auth or loading is in progress');
      throw new Error('Cannot refresh while loading. Please wait.');
    }
    
    try {
      // Reset initialization flag to allow refresh
      isInitializedRef.current = false;
      await loadUserCapabilities();
      console.log('✅ FORCE REFRESH: Complete');
    } catch (error) {
      console.error('❌ FORCE REFRESH: Failed', error);
      throw error;
    }
  };

  // Show loading state while AuthProvider is loading
  const contextValue = {
    currentRole,
    availableRoles,
    switchRole,
    canSwitchToProvider,
    forceRefresh,
    isLoading: isLoading || authLoading
  };

  return (
    <RoleSwitchContext.Provider value={contextValue}>
      {children}
    </RoleSwitchContext.Provider>
  );
};
