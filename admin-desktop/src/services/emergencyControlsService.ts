import { getSupabaseClient, initializeSupabase, isSupabaseInitialized } from './supabaseClient';
import type { EmergencyControlsState, EmergencyControlAction } from '../types/emergencyControls';

export class EmergencyControlsService {
  static async loadEmergencyControls(): Promise<EmergencyControlsState> {
    console.log('🚨 Loading emergency controls...');
    
    let supabase;
    try {
      if (!isSupabaseInitialized()) {
        console.log('⚠️ Supabase not initialized, attempting initialization...');
        supabase = await initializeSupabase();
      } else {
        supabase = getSupabaseClient();
      }
    } catch (error) {
      console.error('❌ Failed to get Supabase client:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    const { data, error } = await supabase
      .from('emergency_controls')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error loading emergency controls:', error);
      throw new Error(`Failed to load emergency controls: ${error.message}`);
    }

    if (data) {
      console.log('✅ Emergency controls loaded:', data);
      return data;
    }

    // Create default controls if none exist
    return this.createDefaultControls();
  }

  private static async createDefaultControls(): Promise<EmergencyControlsState> {
    console.log('🆕 Creating default emergency controls...');
    
    const supabase = getSupabaseClient();
    
    const defaultControls = {
      normal_operations: true,
      bookings_paused: false,
      maintenance_mode: false,
      new_registrations_disabled: false,
      force_logout_users: false,
      fraud_lockdown_active: false,
      manual_review_all_bookings: false,
      geographic_blocking_enabled: false,
      payment_restrictions_active: false,
      blocked_countries: [],
      allowed_payment_methods: ['card', 'bank_transfer'],
      messaging_disabled: false,
      emergency_notification_active: false,
      provider_broadcast_active: false,
      claude_api_enabled: true,
      claude_access_enabled: true
    };
    
    const { data: newData, error: insertError } = await supabase
      .from('emergency_controls')
      .insert(defaultControls)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating default controls:', insertError);
      throw new Error(`Failed to create default controls: ${insertError.message}`);
    }
    
    console.log('✅ Created default emergency controls:', newData);
    return newData;
  }

  static async updateControl(
    controlsId: string,
    controlName: EmergencyControlAction,
    value: boolean,
    reason?: string
  ): Promise<EmergencyControlsState> {
    console.log(`🚨 Updating emergency control: ${controlName} = ${value}`);
    
    const supabase = getSupabaseClient();
    
    // Use system user ID for desktop app
    const systemUserId = 'system-admin-desktop';
    
    const updateData: any = {
      [controlName]: value,
      activated_by: systemUserId,
      activated_at: new Date().toISOString()
    };
    
    if (reason) {
      updateData.reason = reason;
    }

    if (!value) {
      updateData.deactivated_by = systemUserId;
      updateData.deactivated_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('emergency_controls')
      .update(updateData)
      .eq('id', controlsId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating emergency control:', error);
      throw new Error(`Failed to update control: ${error.message}`);
    }

    await this.logEmergencyAction(
      systemUserId,
      `toggle_${controlName}`,
      { control: controlName, value, reason }
    );

    console.log('✅ Emergency control updated successfully');
    return data;
  }

  static async emergencyDisableClaude(reason?: string): Promise<void> {
    console.log('🚨 Emergency Claude disable triggered...');
    
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase.rpc('emergency_disable_claude');
      
      if (error) {
        console.error('❌ RPC error:', error);
        throw error;
      }
      
      await this.logEmergencyAction(
        'system-admin-desktop',
        'emergency_claude_disable',
        { reason: reason || 'Emergency disable triggered from desktop app' }
      );
      
      console.log('✅ Claude emergency disable completed:', data);
    } catch (error) {
      console.error('❌ Failed to emergency disable Claude:', error);
      throw error;
    }
  }

  static async enableClaudeAccess(): Promise<void> {
    console.log('🔄 Enabling Claude access...');
    
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase.rpc('enable_claude_access');
      
      if (error) {
        console.error('❌ RPC error:', error);
        throw error;
      }
      
      await this.logEmergencyAction(
        'system-admin-desktop',
        'claude_access_restored',
        { action: 'Claude access restored from desktop app' }
      );
      
      console.log('✅ Claude access enabled:', data);
    } catch (error) {
      console.error('❌ Failed to enable Claude access:', error);
      throw error;
    }
  }

  static async restoreNormalOperations(
    controlsId: string,
    reason?: string
  ): Promise<EmergencyControlsState> {
    console.log('🔄 Restoring normal operations...');
    
    const supabase = getSupabaseClient();
    const systemUserId = 'system-admin-desktop';
    
    const normalState = {
      normal_operations: true,
      bookings_paused: false,
      maintenance_mode: false,
      new_registrations_disabled: false,
      force_logout_users: false,
      fraud_lockdown_active: false,
      manual_review_all_bookings: false,
      geographic_blocking_enabled: false,
      payment_restrictions_active: false,
      messaging_disabled: false,
      emergency_notification_active: false,
      provider_broadcast_active: false,
      claude_api_enabled: true,
      claude_access_enabled: true,
      deactivated_by: systemUserId,
      deactivated_at: new Date().toISOString(),
      reason: reason || 'Normal operations restored from desktop app'
    };

    const { data, error } = await supabase
      .from('emergency_controls')
      .update(normalState)
      .eq('id', controlsId)
      .select()
      .single();

    if (error) throw error;

    await this.logEmergencyAction(
      systemUserId,
      'restore_normal_operations',
      { reason }
    );

    console.log('✅ Normal operations restored successfully');
    return data;
  }

  static async triggerEmergencyBackup(
    controlsId: string
  ): Promise<EmergencyControlsState> {
    console.log('💾 Triggering emergency backup...');
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('emergency_controls')
      .update({ 
        last_backup_triggered: new Date().toISOString()
      })
      .eq('id', controlsId)
      .select()
      .single();

    if (error) throw error;

    await this.logEmergencyAction(
      'system-admin-desktop',
      'trigger_emergency_backup',
      { timestamp: new Date().toISOString() }
    );

    console.log('✅ Emergency backup triggered successfully');
    return data;
  }

  private static async logEmergencyAction(
    adminId: string,
    actionType: string,
    actionDetails: any,
    previousState?: any,
    newState?: any
  ): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      
      await supabase.rpc('log_emergency_action', {
        p_admin_id: adminId,
        p_action_type: actionType,
        p_action_details: actionDetails,
        p_previous_state: previousState,
        p_new_state: newState
      });
    } catch (error) {
      console.error('Failed to log emergency action:', error);
      // Don't throw here to avoid breaking the main operation
    }
  }
}
