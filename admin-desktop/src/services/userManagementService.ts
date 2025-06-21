
import { getSupabaseClient } from './supabaseClient';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  user_role?: string;
  can_provide?: boolean;
  city?: string;
  province?: string;
  subscription_tier?: string;
  created_at: string;
  provider_profile?: {
    verified?: boolean;
    total_bookings?: number;
    average_rating?: number;
  };
}

export interface UserStats {
  totalUsers: number;
  verifiedProviders: number;
  pendingProviders: number;
  newUsersLast30Days: number;
}

export class UserManagementService {
  static async loadUsers(): Promise<User[]> {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        email,
        phone,
        user_role,
        can_provide,
        city,
        province,
        subscription_tier,
        created_at,
        provider_profiles (
          verified,
          total_bookings,
          average_rating
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading users:', error);
      throw error;
    }

    const formattedUsers = data?.map(user => ({
      ...user,
      provider_profile: user.provider_profiles?.[0] || null
    })) || [];

    return formattedUsers;
  }

  static calculateUserStats(users: User[]): UserStats {
    const totalUsers = users.length;
    const verifiedProviders = users.filter(u => u.can_provide && u.provider_profile?.verified).length;
    const pendingProviders = users.filter(u => u.can_provide && !u.provider_profile?.verified).length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = users.filter(u => {
      const created = new Date(u.created_at);
      return created > thirtyDaysAgo;
    }).length;

    return {
      totalUsers,
      verifiedProviders,
      pendingProviders,
      newUsersLast30Days
    };
  }

  static async updateUserSubscription(userId: string, newTier: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase
      .from('users')
      .update({ subscription_tier: newTier })
      .eq('id', userId);

    if (error) {
      console.error('❌ Error updating user subscription:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    // Note: This should use the admin delete function if available
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }
}
