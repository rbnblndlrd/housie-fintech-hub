
import { supabase } from '@/integrations/supabase/client';

interface FraudCheckData {
  action_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
  metadata?: Record<string, any>;
}

export const fraudService = {
  // Perform fraud check via edge function
  async performFraudCheck(data: FraudCheckData) {
    try {
      const { data: result, error } = await supabase.functions.invoke('fraud-detection', {
        body: data
      });

      if (error) {
        console.error('Fraud check error:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Fraud service error:', error);
      throw error;
    }
  },

  // Get fraud logs for a user
  async getUserFraudLogs(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('fraud_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get payment attempts for fraud analysis
  async getPaymentAttempts(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('payment_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Check if user is blocked
  async isUserBlocked(userId: string) {
    const { data, error } = await supabase.rpc('is_user_blocked', {
      user_uuid: userId
    });

    if (error) throw error;
    return data;
  },

  // Get user risk level
  async getUserRiskLevel(userId: string) {
    const { data, error } = await supabase.rpc('get_user_risk_level', {
      user_uuid: userId
    });

    if (error) throw error;
    return data;
  },

  // Get review queue items
  async getReviewQueue(status = 'pending', limit = 50) {
    const { data, error } = await supabase
      .from('review_queue')
      .select(`
        *,
        users:user_id (
          full_name,
          email
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get verification requirements
  async getVerificationRequirements(userId?: string) {
    let query = supabase
      .from('verification_required')
      .select(`
        *,
        users:user_id (
          full_name,
          email
        )
      `);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  // Block a user
  async blockUser(userId: string, reason: string, blockType: 'temporary' | 'permanent' | 'review_pending', expiresAt?: string) {
    const { data, error } = await supabase
      .from('user_blocks')
      .insert({
        user_id: userId,
        reason,
        block_type: blockType,
        expires_at: expiresAt
      });

    if (error) throw error;
    return data;
  },

  // Unblock a user
  async unblockUser(blockId: string, unblockReason?: string) {
    const { data, error } = await supabase
      .from('user_blocks')
      .update({
        is_active: false,
        unblocked_at: new Date().toISOString()
      })
      .eq('id', blockId);

    if (error) throw error;
    return data;
  }
};
