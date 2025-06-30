import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
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
  const user = useUser();
  const [currentRole, setCurrentRole] = useState<'customer' | 'provider'>('customer');
  const [availableRoles, setAvailableRoles] = useState<string[]>(['customer']);
  const [canSwitchToProvider, setCanSwitchToProvider] = useState(false);

  console.log('🔄 RoleSwitchProvider render:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    currentRole, 
    availableRoles,
    canSwitchToProvider 
  });

  useEffect(() => {
    if (user) {
      console.log('🔄 Loading user capabilities for:', user.email);
      loadUserCapabilities();
    } else {
      console.log('🔄 No user, resetting to defaults');
      setCurrentRole('customer');
      setAvailableRoles(['customer']);
      setCanSwitchToProvider(false);
    }
  }, [user]);

  const loadUserCapabilities = async () => {
    if (!user) return;

    try {
      console.log('🔄 Fetching user profile from database...');
      
      // Clear any potential cache and force fresh data
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle null gracefully

      console.log('🔍 Raw database response:', { 
        profile, 
        error, 
        user_id: user.id,
        error_code: error?.code,
        error_message: error?.message
      });

      if (error) {
        console.error('❌ Database error:', error);
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          console.log('⚠️ No profile found, creating default profile...');
          await createDefaultProfile();
          return;
        }
        throw error;
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
      
      // Validate and set active role
      const activeRole = validateRole(profile.active_role) || 'customer';
      console.log('🎯 Setting current role to:', activeRole);
      setCurrentRole(activeRole);
      
      // Build available roles with enhanced boolean detection
      const roles = ['customer']; // Everyone can be a customer
      
      // Fix the boolean comparison issue - convert to boolean properly
      const canProvideServicesValue = profile.can_provide_services;
      
      // Multiple ways to check provider capability for robustness
      const providerCapabilityChecks = {
        direct: canProvideServicesValue,
        boolean: Boolean(canProvideServicesValue),
        explicit: canProvideServicesValue === true,
        // Remove the string comparison that was causing the error
        notFalse: canProvideServicesValue !== false && canProvideServicesValue !== null
      };
      
      console.log('🔍 Provider capability analysis:', providerCapabilityChecks);
      
      // Determine if user has provider capabilities - fix the comparison logic
      const hasProviderCapability = Boolean(canProvideServicesValue) && 
                                   canProvideServicesValue !== false &&
                                   canProvideServicesValue !== null;
      
      console.log('🎯 Final provider capability decision:', hasProviderCapability);
      
      if (hasProviderCapability) {
        roles.push('provider');
        setCanSwitchToProvider(true);
        console.log('✅ User has provider capabilities - adding provider role');
      } else {
        setCanSwitchToProvider(false);
        console.log('⚠️ User does not have provider capabilities');
      }
      
      console.log('🎯 Final roles configuration:', {
        availableRoles: roles,
        canSwitchToProvider: hasProviderCapability,
        activeRole
      });
      
      setAvailableRoles(roles);
      
      // Synchronize role preferences
      await syncRolePreferences(activeRole);
      
    } catch (error) {
      console.error('❌ Error in loadUserCapabilities:', error);
      // Set safe defaults on error
      setCurrentRole('customer');
      setAvailableRoles(['customer']);
      setCanSwitchToProvider(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!user) return;

    try {
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
    if (!user || !availableRoles.includes(newRole)) {
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

  // Force refresh function for debugging
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing user capabilities...');
    await loadUserCapabilities();
  };

  // Add force refresh to context for debugging (temporary)
  const contextValue = {
    currentRole,
    availableRoles,
    switchRole,
    canSwitchToProvider,
    forceRefresh // Now properly typed
  };

  return (
    <RoleSwitchContext.Provider value={contextValue}>
      {children}
    </RoleSwitchContext.Provider>
  );
};
