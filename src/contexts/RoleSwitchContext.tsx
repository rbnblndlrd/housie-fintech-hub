
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
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (authLoading) {
      console.log('🔄 RoleSwitch: Waiting for AuthProvider to finish loading...');
      return;
    }

    if (user && !isInitializedRef.current) {
      console.log('🔄 RoleSwitch: Loading user capabilities for:', user.email);
      isInitializedRef.current = true;
      loadUserCapabilities();
    } else if (!user) {
      console.log('🔄 RoleSwitch: No user, resetting to defaults');
      resetToDefaults();
    }
  }, [user, authLoading]);

  const resetToDefaults = () => {
    setCurrentRole('customer');
    setAvailableRoles(['customer']);
    setCanSwitchToProvider(false);
    setIsLoading(false);
  };

  const loadUserCapabilities = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      console.log('🔄 RoleSwitch: Fetching user profile from user_profiles table...');
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ RoleSwitch: Error fetching profile:', error);
        resetToDefaults();
        return;
      }

      if (!profile) {
        console.log('⚠️ RoleSwitch: No profile found, using defaults');
        resetToDefaults();
        return;
      }

      console.log('✅ RoleSwitch: Profile loaded successfully:', { 
        activeRole: profile.active_role,
        canProvideServices: profile.can_provide_services,
        canBookServices: profile.can_book_services
      });
      
      const activeRole = profile.active_role === 'provider' ? 'provider' : 'customer';
      setCurrentRole(activeRole);
      
      const roles = ['customer'];
      const hasProviderCapability = profile.can_provide_services === true;
      
      if (hasProviderCapability) {
        roles.push('provider');
        setCanSwitchToProvider(true);
        console.log('✅ RoleSwitch: PROVIDER MODE AVAILABLE');
      } else {
        setCanSwitchToProvider(false);
        console.log('⚠️ RoleSwitch: Provider mode NOT available');
      }
      
      setAvailableRoles(roles);
      
    } catch (error) {
      console.error('❌ RoleSwitch: Error in loadUserCapabilities:', error);
      resetToDefaults();
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: 'customer' | 'provider') => {
    if (!user || !availableRoles.includes(newRole)) {
      throw new Error(`Cannot switch to role: ${newRole}`);
    }

    console.log('🔄 RoleSwitch: Switching role from', currentRole, 'to', newRole);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ active_role: newRole })
        .eq('user_id', user.id);

      if (error) throw error;

      setCurrentRole(newRole);
      console.log('✅ RoleSwitch: Role switched successfully to:', newRole);
      console.log('🎭 RoleSwitch: Current role state is now:', newRole);
      
      // Force a re-render by updating the context
      setTimeout(() => {
        console.log('🔄 RoleSwitch: Verifying role after switch:', currentRole);
      }, 100);
      
    } catch (error) {
      console.error('❌ RoleSwitch: Error switching role:', error);
      throw error;
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 RoleSwitch: FORCE REFRESH - Reloading user capabilities...');
    isInitializedRef.current = false;
    await loadUserCapabilities();
  };

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
