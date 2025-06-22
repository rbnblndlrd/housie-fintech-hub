
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { EmergencyControlsService } from '@/services/emergencyControlsService';
import type { EmergencyControlsState, EmergencyControlAction } from '@/types/emergencyControls';

export const useEmergencyControls = () => {
  const [controls, setControls] = useState<EmergencyControlsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
    if (!controls?.id || !user?.id) {
      toast.error('Missing required data for update');
      return;
    }

    try {
      setActionLoading(true);
      const updatedControls = await EmergencyControlsService.updateControl(
        controls.id,
        controlName,
        value,
        user.id,
        reason
      );
      setControls(updatedControls);
      
      toast.success(`Emergency control ${value ? 'activated' : 'deactivated'}`);
      queryClient.invalidateQueries({ queryKey: ['emergency-controls'] });
    } catch (error) {
      console.error('Failed to update control:', error);
      toast.error('Failed to update emergency control');
    } finally {
      setActionLoading(false);
    }
  };

  const restoreNormalOperations = async (reason?: string) => {
    if (!controls?.id || !user?.id) {
      toast.error('Missing required data for restore');
      return;
    }

    try {
      setActionLoading(true);
      const updatedControls = await EmergencyControlsService.restoreNormalOperations(
        controls.id,
        user.id,
        reason
      );
      setControls(updatedControls);
      
      toast.success('Normal operations restored');
      queryClient.invalidateQueries({ queryKey: ['emergency-controls'] });
    } catch (error) {
      console.error('Failed to restore normal operations:', error);
      toast.error('Failed to restore normal operations');
    } finally {
      setActionLoading(false);
    }
  };

  const triggerEmergencyBackup = async () => {
    if (!controls?.id || !user?.id) {
      toast.error('Missing required data for backup');
      return;
    }

    try {
      setActionLoading(true);
      const updatedControls = await EmergencyControlsService.triggerEmergencyBackup(
        controls.id,
        user.id
      );
      setControls(updatedControls);
      
      toast.success('Emergency backup triggered');
      queryClient.invalidateQueries({ queryKey: ['emergency-controls'] });
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
    reload: loadControls
  };
};
