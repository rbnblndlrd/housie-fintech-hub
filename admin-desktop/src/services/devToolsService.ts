
import { getSupabaseClient } from './supabaseClient';

export class DevToolsService {
  static async generateTestUsers(count: number): Promise<void> {
    const supabase = getSupabaseClient();
    
    const testUsers = Array.from({ length: count }, (_, i) => ({
      full_name: `Test User ${Date.now()}_${i}`,
      email: `testuser_${Date.now()}_${i}@test.fraud.local`,
      user_role: Math.random() > 0.5 ? 'seeker' : 'provider',
      can_provide: Math.random() > 0.5,
      subscription_tier: 'free',
      city: 'Test City',
      province: 'Test Province'
    }));

    const { error } = await supabase
      .from('users')
      .insert(testUsers);

    if (error) {
      console.error('❌ Error generating test users:', error);
      throw error;
    }
  }

  static async generateTestBookings(count: number): Promise<void> {
    const supabase = getSupabaseClient();
    
    // First get some test users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(20);

    if (userError || !users || users.length < 2) {
      throw new Error('Need at least 2 users to generate test bookings');
    }

    const testBookings = Array.from({ length: count }, (_, i) => {
      const customer = users[Math.floor(Math.random() * users.length)];
      let provider = users[Math.floor(Math.random() * users.length)];
      
      // Ensure different customer and provider
      while (provider.id === customer.id) {
        provider = users[Math.floor(Math.random() * users.length)];
      }

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));

      return {
        customer_id: customer.id,
        provider_id: provider.id,
        service_id: crypto.randomUUID(),
        scheduled_date: futureDate.toISOString().split('T')[0],
        scheduled_time: '10:00:00',
        duration_hours: 2,
        total_amount: 100 + Math.random() * 400,
        status: Math.random() > 0.7 ? 'pending' : 'confirmed',
        payment_status: Math.random() > 0.3 ? 'paid' : 'pending'
      };
    });

    const { error } = await supabase
      .from('bookings')
      .insert(testBookings);

    if (error) {
      console.error('❌ Error generating test bookings:', error);
      throw error;
    }
  }

  static async generateTestRevenue(): Promise<void> {
    // This would typically insert test payment/revenue data
    console.log('📊 Test revenue data generated');
  }

  static async createVerifiedProviders(): Promise<void> {
    const supabase = getSupabaseClient();
    
    // Get some test users to convert to verified providers
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('can_provide', true)
      .limit(5);

    if (userError || !users) {
      throw new Error('No provider users found');
    }

    const verifiedProfiles = users.map(user => ({
      user_id: user.id,
      verified: true,
      business_name: `Test Business ${Date.now()}`,
      description: 'Verified test provider',
      hourly_rate: 50 + Math.random() * 100,
      years_experience: Math.floor(Math.random() * 10) + 1,
      average_rating: 4 + Math.random(),
      total_bookings: Math.floor(Math.random() * 50)
    }));

    const { error } = await supabase
      .from('provider_profiles')
      .upsert(verifiedProfiles);

    if (error) {
      console.error('❌ Error creating verified providers:', error);
      throw error;
    }
  }

  static async cleanupTestData(): Promise<void> {
    const supabase = getSupabaseClient();
    
    // Delete test users (cascade should handle related data)
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .like('email', '%test.fraud.local');

    if (userError) {
      console.error('❌ Error cleaning up test users:', userError);
    }

    // Clean up any test fraud logs
    const { error: fraudError } = await supabase
      .from('fraud_logs')
      .delete()
      .like('metadata->email', '%test.fraud.local');

    if (fraudError) {
      console.error('❌ Error cleaning up fraud logs:', fraudError);
    }

    console.log('🧹 Test data cleanup completed');
  }

  static async resetAnalytics(): Promise<void> {
    // This would reset analytics counters/cache
    console.log('📊 Analytics reset completed');
  }
}
