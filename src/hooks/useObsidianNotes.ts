import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export type NoteTemplate = 'CanonClaim' | 'Agent' | 'Broadcast' | 'CryptoAnalysis' | 'TitleTrack' | 'Custom';

export interface ObsidianNote {
  id: string;
  title: string;
  content: string;
  template_type: NoteTemplate;
  metadata: Record<string, any>;
  tags: string[];
  file_path?: string;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export const useObsidianNotes = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['obsidian-notes', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('obsidian_notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as ObsidianNote[];
    },
    enabled: !!userId,
  });

  const createNote = useMutation({
    mutationFn: async (noteData: {
      title: string;
      content?: string;
      template_type?: NoteTemplate;
      metadata?: Record<string, any>;
      tags?: string[];
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('obsidian_notes')
        .insert({
          ...noteData,
          user_id: userId,
          content: noteData.content || '',
          template_type: noteData.template_type || 'Custom',
          metadata: noteData.metadata || {},
          tags: noteData.tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obsidian-notes'] });
      toast({
        title: "Note created",
        description: "Your new note has been created successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create note",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ObsidianNote> & { id: string }) => {
      const { data, error } = await supabase
        .from('obsidian_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obsidian-notes'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update note",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('obsidian_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obsidian-notes'] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete note",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote
  };
};