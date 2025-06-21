import { supabase } from '@/integrations/supabase/client';
import type { EmergencyControlsState, EmergencyControlAction } from '@/types/emergencyControls';

export class EmergencyControlsService {
  static async loadEmergencyControls(): Promise<EmergencyControlsState> {
    console.log('🚨 Loading emergency controls...');
    
    const { data, error } = await supabase
      .from('emergency_controls')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error loading emergency controls:', error);
      throw error;
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
      throw insertError;
    }
    
    console.log('✅ Created default emergency controls:', newData);
    return newData;
  }

  static async updateControl(
    controlsId: string,
    controlName: EmergencyControlAction,
    value: boolean,
    userId: string,
    reason?: string
  ): Promise<EmergencyControlsState> {
    console.log(`🚨 Updating emergency control: ${controlName} = ${value}`);
    
    const updateData: any = {
      [controlName]: value,
      activated_by: userId,
      activated_at: new Date().toISOString()
    };
    
    if (reason) {
      updateData.reason = reason;
    }

    if (!value) {
      updateData.deactivated_by = userId;
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
      throw error;
    }

    await this.logEmergencyAction(
      userId,
      `toggle_${controlName}`,
      { control: controlName, value, reason }
    );

    console.log('✅ Emergency control updated successfully');
    return data;
  }

  static async emergencyDisableClaude(userId: string, reason?: string): Promise<void> {
    console.log('🚨 Emergency Claude disable triggered...');
    
    try {
      const { data, error } = await supabase.rpc('emergency_disable_claude');
      
      if (error) {
        console.error('❌ RPC error:', error);
        throw error;
      }
      
      await this.logEmergencyAction(
        userId,
        'emergency_claude_disable',
        { reason: reason || 'Emergency disable triggered' }
      );
      
      console.log('✅ Claude emergency disable completed:', data);
    } catch (error) {
      console.error('❌ Failed to emergency disable Claude:', error);
      throw error;
    }
  }

  static async enableClaudeAccess(userId: string): Promise<void> {
    console.log('🔄 Enabling Claude access...');
    
    try {
      const { data, error } = await supabase.rpc('enable_claude_access');
      
      if (error) {
        console.error('❌ RPC error:', error);
        throw error;
      }
      
      await this.logEmergencyAction(
        userId,
        'claude_access_restored',
        { action: 'Claude access restored' }
      );
      
      console.log('✅ Claude access enabled:', data);
    } catch (error) {
      console.error('❌ Failed to enable Claude access:', error);
      throw error;
    }
  }

  static async restoreNormalOperations(
    controlsId: string,
    userId: string,
    reason?: string
  ): Promise<EmergencyControlsState> {
    console.log('🔄 Restoring normal operations...');
    
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
      deactivated_by: userId,
      deactivated_at: new Date().toISOString(),
      reason: reason || 'Normal operations restored'
    };

    const { data, error } = await supabase
      .from('emergency_controls')
      .update(normalState)
      .eq('id', controlsId)
      .select()
      .single();

    if (error) throw error;

    await this.logEmergencyAction(
      userId,
      'restore_normal_operations',
      { reason }
    );

    console.log('✅ Normal operations restored successfully');
    return data;
  }

  static async triggerEmergencyBackup(
    controlsId: string,
    userId: string
  ): Promise<EmergencyControlsState> {
    console.log('💾 Triggering emergency backup...');
    
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
      userId,
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
