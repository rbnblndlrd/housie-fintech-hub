// Hook for managing user broadcast preferences
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BroadcastPreferences {
  public_echo_participation: boolean;
  show_location: boolean;
  auto_broadcast_achievements: boolean;
  // Future features - defaults for now
  canon_lock?: boolean;
  annette_voice_style?: 'default' | 'sassy' | 'classic';
  canon_badge_display?: boolean;
  live_echo_participation?: boolean;
}

export function useBroadcastPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<BroadcastPreferences>({
    public_echo_participation: true,
    show_location: true,
    auto_broadcast_achievements: false,
    canon_lock: false,
    annette_voice_style: 'default',
    canon_badge_display: true,
    live_echo_participation: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchPreferences();
    }
  }, [user?.id]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_broadcast_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching broadcast preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          public_echo_participation: data.public_echo_participation ?? true,
          show_location: data.show_location ?? true,
          auto_broadcast_achievements: data.auto_broadcast_achievements ?? false,
          // Future features with defaults
          canon_lock: false,
          annette_voice_style: 'default',
          canon_badge_display: true,
          live_echo_participation: true
        });
      }
    } catch (error) {
      console.error('Error in fetchPreferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<BroadcastPreferences>) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_broadcast_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          ...updates
        });

      if (error) {
        console.error('Error updating broadcast preferences:', error);
        return false;
      }

      setPreferences(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return false;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
}