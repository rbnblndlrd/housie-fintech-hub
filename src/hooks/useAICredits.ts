import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AICredits {
  balance: number;
  last_granted_at: string;
}

export interface AICreditLog {
  id: string;
  action: string;
  credits_used: number;
  result?: string;
  metadata: any;
  created_at: string;
}

export const useAICredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<AICredits>({ balance: 0, last_granted_at: '' });
  const [logs, setLogs] = useState<AICreditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setCredits(data);
      } else {
        // Create initial credits record if none exists
        const { data: newCredits, error: createError } = await supabase
          .from('ai_credits')
          .insert({ user_id: user.id, balance: 10 })
          .select()
          .single();
        
        if (createError) throw createError;
        setCredits(newCredits);
      }
    } catch (error) {
      console.error('Error fetching AI credits:', error);
      toast.error('Failed to load AI credits');
    }
  };

  const fetchLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_credit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching AI credit logs:', error);
    }
  };

  const checkCredits = async (amount: number = 1): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data } = await supabase.rpc('get_user_ai_credits', { 
        user_uuid: user.id 
      });
      
      return (data || 0) >= amount;
    } catch (error) {
      console.error('Error checking AI credits:', error);
      return false;
    }
  };

  const deductCredits = async (
    amount: number, 
    action: string, 
    resultText?: string, 
    metadata: any = {}
  ): Promise<{ success: boolean; new_balance?: number; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase.rpc('deduct_ai_credits', {
        user_uuid: user.id,
        amount,
        action_name: action,
        result_text: resultText,
        metadata_json: metadata
      });

      if (error) throw error;

      const deductResult = data as { 
        success: boolean; 
        new_balance?: number; 
        current_balance?: number; 
        required?: number; 
      };

      if (deductResult.success) {
        // Refresh credits after deduction
        await fetchCredits();
        await fetchLogs();
        
        toast.success(`Used ${amount} AI credit${amount > 1 ? 's' : ''}. ${deductResult.new_balance} remaining.`);
        return { success: true, new_balance: deductResult.new_balance };
      } else {
        toast.error(`Insufficient AI credits. You need ${deductResult.required} but only have ${deductResult.current_balance}.`);
        return { success: false, error: 'Insufficient credits' };
      }
    } catch (error) {
      console.error('Error deducting AI credits:', error);
      toast.error('Failed to process AI credits');
      return { success: false, error: 'Failed to process credits' };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCredits(), fetchLogs()]);
      setIsLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    credits,
    logs,
    isLoading,
    checkCredits,
    deductCredits,
    refreshCredits: fetchCredits
  };
};