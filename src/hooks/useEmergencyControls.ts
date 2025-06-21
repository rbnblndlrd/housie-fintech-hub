
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmergencyControlsState {
  // Platform Controls
  bookings_paused: boolean;
  maintenance_mode: boolean;
  new_registrations_disabled: boolean;
  force_logout_users: boolean;
  
  // Security Controls
  fraud_lockdown_active: boolean;
  manual_review_all_bookings: boolean;
  geographic_blocking_enabled: boolean;
  payment_restrictions_active: boolean;
  blocked_countries: string[];
  allowed_payment_methods: string[];
  
  // Communication Controls
  messaging_disabled: boolean;
  emergency_notification_active: boolean;
  provider_broadcast_active: boolean;
  
  // System Status
  normal_operations: boolean;
  last_backup_triggered: string | null;
  
  // Metadata
  activated_by: string | null;
  activated_at: string | null;
  reason: string | null;
}

export const useEmergencyControls = () => {
  const [controls, setControls] = useState<EmergencyControlsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadEmergencyControls = async () => {
    try {
      console.log('🚨 Loading emergency controls...');
      const { data, error } = await supabase
        .from('emergency_controls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading emergency controls:', error);
        throw error;
      }

      if (data) {
        setControls(data);
        console.log('✅ Emergency controls loaded:', data);
      } else {
        // Create default controls if none exist
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
          provider_broadcast_active: false
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('emergency_controls')
          .insert(defaultControls)
          .select()
          .single();

        if (insertError) throw insertError;
        setControls(newData);
      }
    } catch (error: any) {
      console.error('💥 Failed to load emergency controls:', error);
      toast({
        title: "Error",
        description: "Failed to load emergency controls",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateControl = async (
    controlName: keyof EmergencyControlsState,
    value: any,
    reason?: string
  ) => {
    if (!user || !controls) return;

    setActionLoading(true);
    try {
      console.log(`🚨 Updating emergency control: ${controlName} = ${value}`);
      
      const previousState = { [controlName]: controls[controlName] };
      const newState = { [controlName]: value };
      
      // Update the control
      const updateData: any = {
        [controlName]: value,
        activated_by: user.id,
        activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (reason) {
        updateData.reason = reason;
      }

      const { data, error } = await supabase
        .from('emergency_controls')
        .update(updateData)
        .eq('id', controls.id)
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase.from('emergency_actions_log').insert({
        admin_id: user.id,
        action_type: `toggle_${controlName}`,
        action_details: { control: controlName, value, reason },
        previous_state: previousState,
        new_state: newState
      });

      setControls(data);
      
      toast({
        title: "Emergency Control Updated",
        description: `${controlName.replace(/_/g, ' ')} has been ${value ? 'activated' : 'deactivated'}`,
        variant: value ? "destructive" : "default",
      });

      console.log('✅ Emergency control updated successfully');
      
    } catch (error: any) {
      console.error('❌ Error updating emergency control:', error);
      toast({
        title: "Error",
        description: `Failed to update ${controlName.replace(/_/g, ' ')}`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const restoreNormalOperations = async (reason?: string) => {
    if (!user || !controls) return;

    setActionLoading(true);
    try {
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
        deactivated_by: user.id,
        deactivated_at: new Date().toISOString(),
        reason: reason || 'Normal operations restored',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('emergency_controls')
        .update(normalState)
        .eq('id', controls.id)
        .select()
        .single();

      if (error) throw error;

      // Log the restoration
      await supabase.from('emergency_actions_log').insert({
        admin_id: user.id,
        action_type: 'restore_normal_operations',
        action_details: { reason },
        previous_state: controls,
        new_state: normalState
      });

      setControls(data);
      
      toast({
        title: "Normal Operations Restored",
        description: "All emergency controls have been deactivated",
        variant: "default",
      });

      console.log('✅ Normal operations restored successfully');
      
    } catch (error: any) {
      console.error('❌ Error restoring normal operations:', error);
      toast({
        title: "Error",
        description: "Failed to restore normal operations",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const triggerEmergencyBackup = async () => {
    if (!user) return;

    setActionLoading(true);
    try {
      console.log('💾 Triggering emergency backup...');
      
      // Update the last backup triggered timestamp
      const { error } = await supabase
        .from('emergency_controls')
        .update({ 
          last_backup_triggered: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', controls?.id);

      if (error) throw error;

      // Log the action
      await supabase.from('emergency_actions_log').insert({
        admin_id: user.id,
        action_type: 'trigger_emergency_backup',
        action_details: { timestamp: new Date().toISOString() }
      });

      toast({
        title: "Backup Triggered",
        description: "Emergency database backup has been initiated",
      });

      await loadEmergencyControls();
      
    } catch (error: any) {
      console.error('❌ Error triggering backup:', error);
      toast({
        title: "Error",
        description: "Failed to trigger emergency backup",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencyControls();

    // Set up real-time subscription
    const channel = supabase
      .channel('emergency-controls-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_controls'
        },
        () => {
          console.log('📡 Emergency controls updated, reloading...');
          loadEmergencyControls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    controls,
    loading,
    actionLoading,
    updateControl,
    restoreNormalOperations,
    triggerEmergencyBackup,
    loadEmergencyControls
  };
};
