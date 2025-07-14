import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CanonPreferences {
  echo_visibility: 'public' | 'local' | 'hidden';
  location_sharing_enabled: boolean;
  voice_style: 'professional' | 'warm' | 'sassy' | 'softspoken' | 'default';
  sassiness_intensity: number;
  show_canon_badge_on_profile: boolean;
  stamp_visibility: 'all' | 'canon_only' | 'private';
  manual_stamp_review_enabled: boolean;
  canon_event_history_visible: boolean;
}

const defaultPreferences: CanonPreferences = {
  echo_visibility: 'local',
  location_sharing_enabled: true,
  voice_style: 'default',
  sassiness_intensity: 2,
  show_canon_badge_on_profile: true,
  stamp_visibility: 'all',
  manual_stamp_review_enabled: false,
  canon_event_history_visible: true,
};

export const useCanonPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<CanonPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_canon_preferences', {
        p_user_id: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setPreferences(data[0] as CanonPreferences);
      } else {
        setPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Error fetching canon preferences:', error);
      toast({
        title: "Error loading preferences",
        description: "Failed to load your Canon preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<CanonPreferences>) => {
    if (!user) return;

    try {
      setSaving(true);
      const updatedPreferences = { ...preferences, ...newPreferences };

      const { error } = await supabase
        .from('canon_user_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPreferences,
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      toast({
        title: "Preferences saved",
        description: "Your Canon preferences have been updated",
      });
    } catch (error) {
      console.error('Error updating canon preferences:', error);
      toast({
        title: "Error saving preferences",
        description: "Failed to save your Canon preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
    refreshPreferences: fetchPreferences,
  };
};