import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClipPreference {
  id: string;
  clip_id: string;
  order_index: number;
  is_favorited: boolean;
}

export const useClipPreferences = () => {
  const [favorites, setFavorites] = useState<ClipPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_clip_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorited', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading clip preferences:', error);
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Error in loadPreferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (clipId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existing = favorites.find(f => f.clip_id === clipId);
      
      if (existing) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_clip_preferences')
          .delete()
          .eq('user_id', user.id)
          .eq('clip_id', clipId);

        if (error) throw error;

        setFavorites(prev => prev.filter(f => f.clip_id !== clipId));
        
        toast({
          title: "⭐️ Clip Unfavorited",
          description: "Removed from custom cylinder",
        });
      } else {
        // Add to favorites
        const newOrderIndex = Math.max(...favorites.map(f => f.order_index), -1) + 1;
        
        const { data, error } = await supabase
          .from('user_clip_preferences')
          .insert({
            user_id: user.id,
            clip_id: clipId,
            order_index: newOrderIndex,
            is_favorited: true
          })
          .select()
          .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned');

        setFavorites(prev => [...prev, data]);
        
        toast({
          title: "⭐️ Clip Favorited",
          description: "Added to custom cylinder",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update clip preference",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (clipId: string, newOrderIndex: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_clip_preferences')
        .update({ order_index: newOrderIndex })
        .eq('user_id', user.id)
        .eq('clip_id', clipId);

      if (error) throw error;

      // Update local state
      setFavorites(prev => 
        prev.map(f => 
          f.clip_id === clipId 
            ? { ...f, order_index: newOrderIndex }
            : f
        ).sort((a, b) => a.order_index - b.order_index)
      );
    } catch (error) {
      console.error('Error updating clip order:', error);
    }
  };

  const isFavorited = (clipId: string) => {
    return favorites.some(f => f.clip_id === clipId);
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    updateOrder,
    isFavorited,
    refreshPreferences: loadPreferences
  };
};