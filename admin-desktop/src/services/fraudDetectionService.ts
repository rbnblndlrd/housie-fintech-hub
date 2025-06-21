
import { getSupabaseClient } from './supabaseClient';

export interface FraudLog {
  id: string;
  user_id: string;
  risk_score: number;
  action_type: string;
  action_taken: string;
  reasons: string[];
  risk_factors: any;
  metadata: any;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
}

export interface ReviewQueueItem {
  id: string;
  user_id: string;
  fraud_session_id: string;
  risk_score: number;
  action_type: string;
  priority: string;
  status: string;
  evidence: any;
  created_at: string;
  assigned_to?: string;
  reviewed_by?: string;
  review_notes?: string;
}

export interface UserBlock {
  id: string;
  user_id: string;
  block_type: string;
  reason: string;
  blocked_at: string;
  expires_at?: string;
  is_active: boolean;
  blocked_by?: string;
  unblocked_by?: string;
  unblocked_at?: string;
  metadata: any;
}

export interface FraudStats {
  totalChecks: number;
  highRiskDetected: number;
  blockedUsers: number;
  pendingReviews: number;
  todayAlerts: number;
  weeklyTrend: number;
}

export class FraudDetectionService {
  static async loadFraudLogs(): Promise<FraudLog[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('fraud_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('❌ Error loading fraud logs:', error);
      throw error;
    }

    return data || [];
  }

  static async loadReviewQueue(): Promise<ReviewQueueItem[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('review_queue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading review queue:', error);
      throw error;
    }

    return data || [];
  }

  static async loadUserBlocks(): Promise<UserBlock[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('user_blocks')
      .select('*')
      .eq('is_active', true)
      .order('blocked_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading user blocks:', error);
      throw error;
    }

    return data || [];
  }

  static async calculateStats(fraudLogs: FraudLog[], reviewQueue: ReviewQueueItem[], userBlocks: UserBlock[]): Promise<FraudStats> {
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const todayLogs = fraudLogs.filter(log => 
      new Date(log.created_at).toDateString() === today
    );

    const weeklyLogs = fraudLogs.filter(log => 
      new Date(log.created_at) >= weekAgo
    );

    const highRiskLogs = fraudLogs.filter(log => log.risk_score >= 50);
    const pendingReviews = reviewQueue.filter(item => item.status === 'pending');

    return {
      totalChecks: fraudLogs.length,
      highRiskDetected: highRiskLogs.length,
      blockedUsers: userBlocks.length,
      pendingReviews: pendingReviews.length,
      todayAlerts: todayLogs.length,
      weeklyTrend: weeklyLogs.length
    };
  }

  static async unblockUser(blockId: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('user_blocks')
      .update({
        is_active: false,
        unblocked_at: new Date().toISOString(),
        unblocked_by: '00000000-0000-4000-8000-000000000001' // Desktop app system user
      })
      .eq('id', blockId);

    if (error) {
      console.error('❌ Error unblocking user:', error);
      throw error;
    }
  }

  static async updateReviewStatus(reviewId: string, status: string, notes?: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: '00000000-0000-4000-8000-000000000001'
    };

    if (notes) {
      updateData.review_notes = notes;
    }

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('review_queue')
      .update(updateData)
      .eq('id', reviewId);

    if (error) {
      console.error('❌ Error updating review status:', error);
      throw error;
    }
  }
}
