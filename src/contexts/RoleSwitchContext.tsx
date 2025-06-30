
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
      console.log('🔄 Waiting for AuthProvider to finish loading...');
      return;
    }

    if (user && !isInitializedRef.current) {
      console.log('🔄 Loading user capabilities for:', user.email);
      isInitializedRef.current = true;
      loadUserCapabilities();
    } else if (!user) {
      console.log('🔄 No user, resetting to defaults');
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
      console.log('🔄 Fetching user profile from database...');
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !profile) {
        console.log('⚠️ No profile found or error, creating default profile...');
        await createDefaultProfile();
        return;
      }

      console.log('✅ Profile loaded successfully:', { 
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
        console.log('✅ PROVIDER MODE AVAILABLE');
      } else {
        setCanSwitchToProvider(false);
        console.log('⚠️ Provider mode NOT available');
      }
      
      setAvailableRoles(roles);
      
    } catch (error) {
      console.error('❌ Error in loadUserCapabilities:', error);
      resetToDefaults();
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!user) return;

    try {
      console.log('🔧 Creating default profile for user:', user.id);
      
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          active_role: 'customer',
          can_provide_services: false,
          can_book_services: true
        });

      if (insertError) {
        console.error('❌ Error creating profile:', insertError);
      } else {
        console.log('✅ Default profile created');
      }

      setCurrentRole('customer');
      setAvailableRoles(['customer']);
      setCanSwitchToProvider(false);
    } catch (error) {
      console.error('❌ Error creating default profile:', error);
      resetToDefaults();
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: 'customer' | 'provider') => {
    if (!user || !availableRoles.includes(newRole)) {
      throw new Error(`Cannot switch to role: ${newRole}`);
    }

    console.log('🔄 Switching role from', currentRole, 'to', newRole);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ active_role: newRole })
        .eq('user_id', user.id);

      if (error) throw error;

      setCurrentRole(newRole);
      console.log('✅ Role switched successfully to:', newRole);
    } catch (error) {
      console.error('❌ Error switching role:', error);
      throw error;
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 FORCE REFRESH: Reloading user capabilities...');
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
