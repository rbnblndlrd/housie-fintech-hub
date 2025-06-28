
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type NavigationPreference = 'google_maps' | 'housie_navigation' | 'system_default';

export const useNavigationPreference = () => {
  const { user } = useAuth();
  const [navigationPreference, setNavigationPreference] = useState<NavigationPreference>('google_maps');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNavigationPreference();
    }
  }, [user]);

  const loadNavigationPreference = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('provider_settings')
        .select('navigation_preference')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading navigation preference:', error);
        return;
      }

      if (data?.navigation_preference) {
        setNavigationPreference(data.navigation_preference as NavigationPreference);
      }
    } catch (error) {
      console.error('Error loading navigation preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNavigationPreference = async (preference: NavigationPreference) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('provider_settings')
        .upsert({
          user_id: user.id,
          navigation_preference: preference,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setNavigationPreference(preference);
      return true;
    } catch (error) {
      console.error('Error updating navigation preference:', error);
      return false;
    }
  };

  return {
    navigationPreference,
    updateNavigationPreference,
    loading
  };
};
