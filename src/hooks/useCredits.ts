
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserCredits {
  total_credits: number;
  used_credits: number;
  remaining_credits: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  price_cad: number;
  base_credits: number;
  bonus_credits: number;
  total_credits: number;
  is_popular: boolean;
  description: string;
}

export interface AIFeatureCost {
  feature_name: string;
  credit_cost: number;
  estimated_api_cost: number;
  is_free_tier: boolean;
  daily_free_limit: number;
  description: string;
}

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retry_after?: string;
  cooldown_until?: string;
  daily_used?: number;
  daily_limit?: number;
}

interface CreditConsumptionResult {
  success: boolean;
  reason?: string;
  required?: number;
  available?: number;
  credits_spent?: number;
  remaining?: number;
  is_free?: boolean;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits>({ total_credits: 0, used_credits: 0, remaining_credits: 0 });
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [features, setFeatures] = useState<AIFeatureCost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_credits', { user_uuid: user.id });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCredits(data[0]);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error('Failed to load credits');
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('is_active', true)
        .order('price_cad', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load credit packages');
    }
  };

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_feature_costs')
        .select('*')
        .eq('is_active', true)
        .order('credit_cost', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const checkRateLimit = async (featureName: string, messageLength = 0): Promise<RateLimitResult> => {
    if (!user) return { allowed: false, reason: 'User not authenticated' };

    try {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        user_uuid: user.id,
        feature_name: featureName,
        message_length: messageLength
      });

      if (error) throw error;
      return data as unknown as RateLimitResult;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return { allowed: false, reason: 'Rate limit check failed' };
    }
  };

  const consumeCredits = async (featureName: string, apiCostEstimate = 0, sessionId?: string): Promise<CreditConsumptionResult> => {
    if (!user) return { success: false, reason: 'User not authenticated' };

    try {
      const { data, error } = await supabase.rpc('consume_credits', {
        user_uuid: user.id,
        feature_name: featureName,
        api_cost_estimate: apiCostEstimate,
        session_uuid: sessionId
      });

      if (error) throw error;

      const result = data as unknown as CreditConsumptionResult;

      if (result?.success) {
        // Refresh credits after consumption
        await fetchCredits();
        
        if (!result.is_free) {
          toast.success(`${result.credits_spent} credits used. ${result.remaining} remaining.`);
        }
      }

      return result;
    } catch (error) {
      console.error('Error consuming credits:', error);
      return { success: false, reason: 'Credit consumption failed' };
    }
  };

  const addCredits = async (packageId: string) => {
    if (!user) return false;

    try {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll simulate a purchase
      const selectedPackage = packages.find(p => p.id === packageId);
      if (!selectedPackage) return false;

      const { error } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          total_credits: credits.total_credits + selectedPackage.total_credits,
          last_purchase_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchCredits();
      toast.success(`Successfully added ${selectedPackage.total_credits} credits!`);
      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      toast.error('Failed to add credits');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCredits(), fetchPackages(), fetchFeatures()]);
      setIsLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    credits,
    packages,
    features,
    isLoading,
    checkRateLimit,
    consumeCredits,
    addCredits,
    refreshCredits: fetchCredits
  };
};
