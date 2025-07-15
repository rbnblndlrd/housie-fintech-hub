import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface ShowcaseSettings {
  id: string;
  user_id: string;
  room_title: string;
  room_theme: string;
  annette_intro_line?: string;
  widget_layout: Record<string, any>;
  is_public: boolean;
  featured_stamp_ids: string[];
  created_at: string;
  updated_at: string;
}

export function useShowcaseSettings(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const [settings, setSettings] = useState<ShowcaseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_showcase_settings')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setSettings(data ? {
        ...data,
        widget_layout: data.widget_layout as Record<string, any>
      } : null);
    } catch (err) {
      console.error('Error loading showcase settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load showcase settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<ShowcaseSettings>) => {
    if (!user?.id || targetUserId !== user.id) {
      throw new Error('Can only update own showcase settings');
    }

    try {
      const { data, error } = await supabase
        .from('user_showcase_settings')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        widget_layout: data.widget_layout as Record<string, any>
      };
      setSettings(transformedData);
      return transformedData;
    } catch (err) {
      console.error('Error updating showcase settings:', err);
      throw err;
    }
  };

  const updateWidgetLayout = async (layout: Record<string, any>) => {
    return updateSettings({ widget_layout: layout });
  };

  const setFeaturedStamps = async (stampIds: string[]) => {
    return updateSettings({ featured_stamp_ids: stampIds });
  };

  const togglePublicVisibility = async () => {
    const currentSettings = settings;
    if (!currentSettings) return;
    
    return updateSettings({ is_public: !currentSettings.is_public });
  };

  useEffect(() => {
    if (targetUserId) {
      loadSettings();
    }
  }, [targetUserId]);

  const refreshSettings = () => {
    if (targetUserId) {
      loadSettings();
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateWidgetLayout,
    setFeaturedStamps,
    togglePublicVisibility,
    refreshSettings
  };
}