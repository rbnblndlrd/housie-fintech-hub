
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
      
      // Get user profile data with detailed logging
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 Database query result:', { 
        profile, 
        error, 
        user_id: user.id,
        error_code: error?.code 
      });

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('⚠️ No profile found, creating default profile...');
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

        console.log('✅ Profile and role preferences created:', newProfile);
        setCurrentRole('customer');
        setAvailableRoles(['customer']);
        setCanSwitchToProvider(false);
        return;
      }

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading user capabilities:', error);
        return;
      }

      if (profile) {
        console.log('✅ Profile loaded successfully:', { 
          activeRole: profile.active_role,
          canProvideServices: profile.can_provide_services,
          canBookServices: profile.can_book_services,
          profileId: profile.id,
          fullProfile: profile
        });
        
        // Validate data consistency
        if (profile.active_role && !['customer', 'provider'].includes(profile.active_role)) {
          console.warn('⚠️ Invalid active_role detected:', profile.active_role, 'defaulting to customer');
          profile.active_role = 'customer';
        }
        
        // Use user_profiles.active_role as the single source of truth
        const activeRole = (profile.active_role as 'customer' | 'provider') || 'customer';
        console.log('🎯 Setting current role to:', activeRole);
        setCurrentRole(activeRole);
        
        // Build available roles based on capabilities
        const roles = ['customer']; // Everyone can be a customer
        
        // Check if user can provide services
        const hasProviderCapability = Boolean(profile.can_provide_services);
        console.log('🔍 Provider capability check:', {
          can_provide_services: profile.can_provide_services,
          hasProviderCapability,
          typeof_can_provide_services: typeof profile.can_provide_services
        });
        
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
        
        // Ensure role preferences are synchronized (defensive programming)
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
      }
    } catch (error) {
      console.error('❌ Error in loadUserCapabilities:', error);
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

  return (
    <RoleSwitchContext.Provider value={{
      currentRole,
      availableRoles,
      switchRole,
      canSwitchToProvider
    }}>
      {children}
    </RoleSwitchContext.Provider>
  );
};
