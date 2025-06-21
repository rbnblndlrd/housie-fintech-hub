
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FraudCheckRequest {
  action_type: 'registration' | 'booking' | 'payment' | 'messaging' | 'login';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
  metadata?: Record<string, any>;
}

interface FraudResult {
  risk_score: number;
  action: 'allow' | 'review' | 'block' | 'require_verification';
  risk_factors: {
    user_behavior: number;
    device_risk: number;
    ip_risk: number;
    payment_risk: number;
    content_risk: number;
    velocity_risk: number;
  };
  reasons: string[];
  session_id: string;
}

export const useFraudDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const performFraudCheck = async (request: FraudCheckRequest): Promise<FraudResult | null> => {
    setIsLoading(true);
    try {
      console.log('Performing fraud check:', request);
      
      const { data, error } = await supabase.functions.invoke('fraud-detection', {
        body: request,
      });

      if (error) {
        console.error('Fraud detection error:', error);
        toast({
          title: "Fraud Check Error",
          description: "Failed to perform fraud check",
          variant: "destructive",
        });
        return null;
      }

      console.log('Fraud check result:', data);
      return data as FraudResult;
    } catch (error) {
      console.error('Fraud detection error:', error);
      toast({
        title: "Fraud Check Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserBlocked = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_user_blocked', {
        user_uuid: userId
      });

      if (error) {
        console.error('Error checking user block status:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking user block status:', error);
      return false;
    }
  };

  const getUserRiskLevel = async (userId: string): Promise<string> => {
    try {
      const { data, error } = await supabase.rpc('get_user_risk_level', {
        user_uuid: userId
      });

      if (error) {
        console.error('Error getting user risk level:', error);
        return 'unknown';
      }

      return data || 'unknown';
    } catch (error) {
      console.error('Error getting user risk level:', error);
      return 'unknown';
    }
  };

  return {
    performFraudCheck,
    checkUserBlocked,
    getUserRiskLevel,
    isLoading
  };
};
