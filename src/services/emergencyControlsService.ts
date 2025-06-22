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
      // Map existing fields to Claude API controls
      const mappedData = {
        ...data,
        claude_api_killswitch: !data.claude_api_enabled,
        claude_api_rate_limiting: data.current_daily_spend >= (data.daily_spend_limit * 0.8), // 80% threshold
        claude_response_filtering: false, // Default frontend state
        claude_api_cost_monitor: data.daily_spend_limit > 0
      };
      return mappedData;
    }

    // Create default controls if none exist
    return this.createDefaultControls();
  }

  private static async createDefaultControls(): Promise<EmergencyControlsState> {
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
      daily_spend_limit: 100.00,
      current_daily_spend: 0.00
    };
    
    const { data: newData, error: insertError } = await supabase
      .from('emergency_controls')
      .insert(defaultControls)
      .select()
      .single();

    if (insertError) throw insertError;
    
    const mappedData = {
      ...newData,
      claude_api_killswitch: !newData.claude_api_enabled,
      claude_api_rate_limiting: false,
      claude_response_filtering: false,
      claude_api_cost_monitor: true
    };
    
    console.log('✅ Created default emergency controls:', mappedData);
    return mappedData;
  }

  static async updateControl(
    controlsId: string,
    controlName: EmergencyControlAction,
    value: boolean,
    userId: string,
    reason?: string
  ): Promise<EmergencyControlsState> {
    console.log(`🚨 Updating emergency control: ${controlName} = ${value}`);
    
    let updateData: any = {
      activated_by: userId,
      activated_at: new Date().toISOString()
    };
    
    // Map Claude API controls to existing database fields
    switch (controlName) {
      case 'claude_api_killswitch':
        updateData.claude_api_enabled = !value;
        break;
      case 'claude_api_cost_monitor':
        updateData.daily_spend_limit = value ? 100.00 : 0;
        break;
      case 'claude_api_rate_limiting':
      case 'claude_response_filtering':
        // These are handled in frontend logic, just log the action
        updateData.reason = `${controlName}: ${value ? 'enabled' : 'disabled'}`;
        break;
      default:
        updateData[controlName] = value;
    }
    
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

    if (error) throw error;

    await this.logEmergencyAction(
      userId,
      `toggle_${controlName}`,
      { control: controlName, value, reason }
    );

    // Map response back to include Claude controls
    const mappedData = {
      ...data,
      claude_api_killswitch: !data.claude_api_enabled,
      claude_api_rate_limiting: data.current_daily_spend >= (data.daily_spend_limit * 0.8),
      claude_response_filtering: controlName === 'claude_response_filtering' ? value : false,
      claude_api_cost_monitor: data.daily_spend_limit > 0
    };

    console.log('✅ Emergency control updated successfully');
    return mappedData;
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
      claude_api_enabled: true, // Restore Claude API
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

    const mappedData = {
      ...data,
      claude_api_killswitch: false,
      claude_api_rate_limiting: false,
      claude_response_filtering: false,
      claude_api_cost_monitor: data.daily_spend_limit > 0
    };

    console.log('✅ Normal operations restored successfully');
    return mappedData;
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

    const mappedData = {
      ...data,
      claude_api_killswitch: !data.claude_api_enabled,
      claude_api_rate_limiting: data.current_daily_spend >= (data.daily_spend_limit * 0.8),
      claude_response_filtering: false,
      claude_api_cost_monitor: data.daily_spend_limit > 0
    };

    console.log('✅ Emergency backup triggered successfully');
    return mappedData;
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
