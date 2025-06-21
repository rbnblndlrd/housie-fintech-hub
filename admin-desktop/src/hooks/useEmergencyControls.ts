
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { EmergencyControlsService } from '../services/emergencyControlsService';
import type { EmergencyControlsState, EmergencyControlAction } from '../types/emergencyControls';

export const useEmergencyControls = () => {
  const [controls, setControls] = useState<EmergencyControlsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadControls();
  }, []);

  const loadControls = async () => {
    try {
      setLoading(true);
      const data = await EmergencyControlsService.loadEmergencyControls();
      setControls(data);
    } catch (error) {
      console.error('Failed to load emergency controls:', error);
      toast.error('Failed to load emergency controls');
    } finally {
      setLoading(false);
    }
  };

  const updateControl = async (
    controlName: EmergencyControlAction,
    value: boolean,
    reason?: string
  ) => {
    if (!controls?.id) {
      console.error('❌ Missing controls ID for update');
      toast.error('Missing required data for update');
      return;
    }

    try {
      setActionLoading(true);
      console.log('🔄 Updating control:', { controlName, value, reason });
      
      const updatedControls = await EmergencyControlsService.updateControl(
        controls.id,
        controlName,
        value,
        reason
      );
      setControls(updatedControls);
      
      toast.success(`Emergency control ${value ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Failed to update control:', error);
      toast.error('Failed to update emergency control');
    } finally {
      setActionLoading(false);
    }
  };

  const emergencyDisableClaude = async (reason?: string) => {
    try {
      setActionLoading(true);
      console.log('🚨 Starting Claude emergency disable...');
      
      await EmergencyControlsService.emergencyDisableClaude(reason);
      
      // Reload controls to get updated state
      console.log('🔄 Reloading controls after Claude disable...');
      await loadControls();
      
      toast.success('Claude AI emergency disabled');
    } catch (error) {
      console.error('Failed to emergency disable Claude:', error);
      toast.error('Failed to emergency disable Claude AI');
    } finally {
      setActionLoading(false);
    }
  };

  const enableClaudeAccess = async () => {
    try {
      setActionLoading(true);
      console.log('🔄 Starting Claude access enable...');
      
      await EmergencyControlsService.enableClaudeAccess();
      
      // Reload controls to get updated state
      console.log('🔄 Reloading controls after Claude enable...');
      await loadControls();
      
      toast.success('Claude AI access restored');
    } catch (error) {
      console.error('Failed to enable Claude access:', error);
      toast.error('Failed to enable Claude AI access');
    } finally {
      setActionLoading(false);
    }
  };

  const restoreNormalOperations = async (reason?: string) => {
    if (!controls?.id) {
      toast.error('Missing required data for restore');
      return;
    }

    try {
      setActionLoading(true);
      const updatedControls = await EmergencyControlsService.restoreNormalOperations(
        controls.id,
        reason
      );
      setControls(updatedControls);
      
      toast.success('Normal operations restored');
    } catch (error) {
      console.error('Failed to restore normal operations:', error);
      toast.error('Failed to restore normal operations');
    } finally {
      setActionLoading(false);
    }
  };

  const triggerEmergencyBackup = async () => {
    if (!controls?.id) {
      toast.error('Missing required data for backup');
      return;
    }

    try {
      setActionLoading(true);
      const updatedControls = await EmergencyControlsService.triggerEmergencyBackup(
        controls.id
      );
      setControls(updatedControls);
      
      toast.success('Emergency backup triggered');
    } catch (error) {
      console.error('Failed to trigger backup:', error);
      toast.error('Failed to trigger emergency backup');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    controls,
    loading,
    actionLoading,
    updateControl,
    restoreNormalOperations,
    triggerEmergencyBackup,
    emergencyDisableClaude,
    enableClaudeAccess,
    reload: loadControls
  };
};
