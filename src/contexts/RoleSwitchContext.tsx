
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
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('active_role, can_provide_services, can_book_services, profile_type')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading user capabilities:', error);
        return;
      }

      if (profile) {
        setCurrentRole(profile.active_role || 'customer');
        
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
