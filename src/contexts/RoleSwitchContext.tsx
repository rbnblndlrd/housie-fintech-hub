
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
  const [currentRole, setCurrentRole] = useState<'customer' | 'provider' | 'commercial'>('customer');
  const [availableRoles, setAvailableRoles] = useState<string[]>(['customer']);
  const [canSwitchToProvider, setCanSwitchToProvider] = useState(false);
  const [canSwitchToCommercial, setCanSwitchToCommercial] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserCapabilities();
    }
  }, [user]);

  const loadUserCapabilities = async () => {
    if (!user) return;

    try {
      // Try to get from user_profiles with new unified system
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user capabilities:', error);
        return;
      }

      if (profile) {
        // Use new unified profile system with proper type casting
        const activeRole = (profile.active_role as 'customer' | 'provider' | 'commercial') || 'customer';
        setCurrentRole(activeRole);
        
        const roles = ['customer'];
        if (profile.can_provide_services) {
          roles.push('provider');
          setCanSwitchToProvider(true);
        }
        if (profile.profile_type === 'commercial') {
          roles.push('commercial');
          setCanSwitchToCommercial(true);
        }
        
        setAvailableRoles(roles);
      } else {
        // Fallback to checking users table for legacy support
        const { data: userData } = await supabase
          .from('users')
          .select('can_provide, can_seek')
          .eq('id', user.id)
          .single();

        if (userData) {
          const roles = ['customer'];
          if (userData.can_provide) {
            roles.push('provider');
            setCanSwitchToProvider(true);
          }
          setAvailableRoles(roles);
        }
      }
    } catch (error) {
      console.error('Error in loadUserCapabilities:', error);
    }
  };

  const switchRole = async (newRole: 'customer' | 'provider' | 'commercial') => {
    if (!user || !availableRoles.includes(newRole)) {
      throw new Error('Cannot switch to this role');
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ active_role: newRole })
        .eq('user_id', user.id);

      if (error) throw error;

      setCurrentRole(newRole);
    } catch (error) {
      console.error('Error switching role:', error);
      throw error;
    }
  };

  return (
    <RoleSwitchContext.Provider value={{
      currentRole,
      availableRoles,
      switchRole,
      canSwitchToProvider,
      canSwitchToCommercial
    }}>
      {children}
    </RoleSwitchContext.Provider>
  );
};
