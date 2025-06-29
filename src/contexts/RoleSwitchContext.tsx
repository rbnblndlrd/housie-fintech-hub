
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
    currentRole, 
    availableRoles,
    canSwitchToProvider 
  });

  useEffect(() => {
    if (user) {
      console.log('🔄 Loading user capabilities for:', user.id);
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
      
      // Try to get from user_profiles with simplified system
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

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

        console.log('✅ Profile created:', newProfile);
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
        console.log('✅ Profile loaded:', { 
          activeRole: profile.active_role,
          canProvideServices: profile.can_provide_services 
        });
        
        // Use simplified profile system with only customer/provider
        const activeRole = (profile.active_role as 'customer' | 'provider') || 'customer';
        setCurrentRole(activeRole);
        
        // FIXED: Always set available roles based on capabilities, not current role
        const roles = ['customer'];
        if (profile.can_provide_services) {
          roles.push('provider');
          setCanSwitchToProvider(true);
        } else {
          setCanSwitchToProvider(false);
        }
        
        setAvailableRoles(roles);
        console.log('✅ Roles set:', { activeRole, availableRoles: roles, canProvideServices: profile.can_provide_services });
      }
    } catch (error) {
      console.error('❌ Error in loadUserCapabilities:', error);
    }
  };

  const switchRole = async (newRole: 'customer' | 'provider') => {
    if (!user || !availableRoles.includes(newRole)) {
      console.error('❌ Cannot switch to role:', newRole, 'Available roles:', availableRoles);
      throw new Error('Cannot switch to this role');
    }

    console.log('🔄 Switching role from', currentRole, 'to', newRole);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ active_role: newRole })
        .eq('user_id', user.id);

      if (error) throw error;

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
