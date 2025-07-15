import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface CanonThread {
  id: string;
  user_id: string;
  title: string;
  root_message: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_public: boolean;
  is_starred: boolean;
  emoji_tag?: string;
  summary?: string;
}

export interface CanonThreadEntry {
  id: string;
  thread_id: string;
  entry_id: string;
  message: string;
  source_type: 'voice_line' | 'data_pull' | 'user_prompt' | 'system';
  canon_level: 'canon' | 'non-canon' | 'inferred';
  timestamp: string;
  linked_event_id?: string;
  metadata: Record<string, any>;
}

export const useCanonThreads = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<CanonThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchThreads = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('canon_threads')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching canon threads:', error);
      toast({
        title: "Error",
        description: "Failed to load canon threads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createThread = async (
    title: string,
    rootMessage: string,
    tags: string[] = [],
    isPublic: boolean = false
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('create_canon_thread', {
        p_user_id: user.id,
        p_title: title,
        p_root_message: rootMessage,
        p_tags: tags,
        p_is_public: isPublic
      });

      if (error) throw error;
      await fetchThreads(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating canon thread:', error);
      toast({
        title: "Error",
        description: "Failed to create canon thread",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateThread = async (threadId: string, updates: Partial<CanonThread>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('canon_threads')
        .update(updates)
        .eq('id', threadId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchThreads(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating canon thread:', error);
      toast({
        title: "Error",
        description: "Failed to update canon thread",
        variant: "destructive",
      });
      return false;
    }
  };

  const searchThreads = async (query: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase.rpc('search_canon_threads', {
        p_user_id: user.id,
        p_query: query,
        p_limit: 20
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching canon threads:', error);
      toast({
        title: "Error",
        description: "Failed to search canon threads",
        variant: "destructive",
      });
      return [];
    }
  };

  const deleteThread = async (threadId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('canon_threads')
        .delete()
        .eq('id', threadId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchThreads(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting canon thread:', error);
      toast({
        title: "Error",
        description: "Failed to delete canon thread",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [user]);

  return {
    threads,
    isLoading,
    createThread,
    updateThread,
    searchThreads,
    deleteThread,
    refetch: fetchThreads
  };
};

export const useCanonThreadEntries = (threadId: string) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CanonThreadEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntries = async () => {
    if (!user || !threadId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('canon_thread_entries')
        .select('*')
        .eq('thread_id', threadId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setEntries((data || []) as CanonThreadEntry[]);
    } catch (error) {
      console.error('Error fetching thread entries:', error);
      toast({
        title: "Error",
        description: "Failed to load thread entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = async (
    entryId: string,
    message: string,
    sourceType: CanonThreadEntry['source_type'] = 'user_prompt',
    canonLevel: CanonThreadEntry['canon_level'] = 'non-canon',
    linkedEventId?: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user || !threadId) return null;

    try {
      const { data, error } = await supabase.rpc('add_canon_thread_entry', {
        p_thread_id: threadId,
        p_entry_id: entryId,
        p_message: message,
        p_source_type: sourceType,
        p_canon_level: canonLevel,
        p_linked_event_id: linkedEventId,
        p_metadata: metadata
      });

      if (error) throw error;
      await fetchEntries(); // Refresh the entries
      return data;
    } catch (error) {
      console.error('Error adding thread entry:', error);
      toast({
        title: "Error",
        description: "Failed to add thread entry",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [threadId, user]);

  return {
    entries,
    isLoading,
    addEntry,
    refetch: fetchEntries
  };
};