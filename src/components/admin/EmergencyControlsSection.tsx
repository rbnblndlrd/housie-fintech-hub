
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Shield, DollarSign, Clock, Power, PowerOff, Zap, Users, Activity, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import EmergencyStopDialog from './emergency/EmergencyStopDialog';
import EmergencyActivationLog from './emergency/EmergencyActivationLog';
import SpendingMonitor from './emergency/SpendingMonitor';
import FeatureToggles from './emergency/FeatureToggles';
import RateLimitControls from './emergency/RateLimitControls';

interface EmergencyControls {
  id: string;
  claude_api_enabled: boolean;
  openai_api_enabled: boolean;
  google_maps_enabled: boolean;
  external_apis_enabled: boolean;
  ai_assistant_enabled: boolean;
  maps_enabled: boolean;
  chat_enabled: boolean;
  notifications_enabled: boolean;
  emergency_mode: boolean;
  daily_spend_limit: number;
  monthly_spend_limit: number;
  current_daily_spend: number;
  current_monthly_spend: number;
  max_requests_per_hour: number;
  max_requests_per_day: number;
  max_ai_requests_per_user_per_hour: number;
  max_ai_requests_per_user_per_day: number;
  auto_recovery_enabled: boolean;
  auto_recovery_hours: number;
  emergency_activated_at: string | null;
  emergency_reason: string | null;
  last_updated_at: string;
}

const EmergencyControlsSection = () => {
  const { user } = useAuth();
  const [controls, setControls] = useState<EmergencyControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  const fetchControls = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_controls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setControls(data);
    } catch (error) {
      console.error('Error fetching emergency controls:', error);
      toast.error('Failed to load emergency controls');
    } finally {
      setIsLoading(false);
    }
  };

  const updateControl = async (field: string, value: any) => {
    if (!controls) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('emergency_controls')
        .update({
          [field]: value,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', controls.id);

      if (error) throw error;

      setControls({ ...controls, [field]: value });
      
      // Log the change
      await supabase.from('emergency_activation_logs').insert({
        control_type: field,
        action: value ? 'enabled' : 'disabled',
        activated_by_user_id: user?.id,
        new_value: { [field]: value }
      });

      toast.success(`${field.replace('_', ' ')} updated successfully`);
    } catch (error) {
      console.error('Error updating control:', error);
      toast.error('Failed to update control');
    } finally {
      setIsUpdating(false);
    }
  };

  const activateEmergencyMode = async (reason: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('activate_emergency_mode', {
        reason_text: reason,
        activated_by: user.id
      });

      if (error) throw error;

      toast.error('🚨 EMERGENCY MODE ACTIVATED - All expensive features disabled');
      fetchControls();
    } catch (error) {
      console.error('Error activating emergency mode:', error);
      toast.error('Failed to activate emergency mode');
    }
  };

  const deactivateEmergencyMode = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('deactivate_emergency_mode', {
        deactivated_by: user.id
      });

      if (error) throw error;

      toast.success('Emergency mode deactivated - Services restored');
      fetchControls();
    } catch (error) {
      console.error('Error deactivating emergency mode:', error);
      toast.error('Failed to deactivate emergency mode');
    }
  };

  useEffect(() => {
    fetchControls();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('emergency_controls_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'emergency_controls' 
        }, 
        () => {
          fetchControls();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Emergency Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!controls) {
    return (
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle>Emergency Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-gray-600 mb-4">No emergency controls found. Please contact system administrator.</p>
            <Button onClick={fetchControls} className="fintech-button-primary">
              Retry Loading
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dailySpendPercentage = Math.min((controls.current_daily_spend / controls.daily_spend_limit) * 100, 100);
  const monthlySpendPercentage = Math.min((controls.current_monthly_spend / controls.monthly_spend_limit) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Emergency Status Overview */}
      <Card className={`fintech-chart-container ${controls.emergency_mode ? 'border-red-500 bg-red-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Emergency Status
            </span>
            <Badge 
              variant={controls.emergency_mode ? 'destructive' : 'default'} 
              className={`text-sm px-4 py-2 ${controls.emergency_mode ? 'bg-red-600 text-white' : 'bg-green-100 text-green-800'}`}
            >
              {controls.emergency_mode ? '🚨 EMERGENCY ACTIVE' : '✅ NORMAL OPERATION'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {controls.emergency_mode ? 'Platform in emergency mode' : 'All systems operational'}
              </p>
              {controls.emergency_reason && (
                <p className="text-sm text-red-600 mt-1">Reason: {controls.emergency_reason}</p>
              )}
              {controls.emergency_activated_at && (
                <p className="text-xs text-gray-500">
                  Activated: {new Date(controls.emergency_activated_at).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              {controls.emergency_mode ? (
                <Button
                  onClick={deactivateEmergencyMode}
                  disabled={isUpdating}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[180px]"
                >
                  <Power className="h-4 w-4 mr-2" />
                  RESTORE SERVICES
                </Button>
              ) : (
                <Button
                  onClick={() => setShowEmergencyDialog(true)}
                  disabled={isUpdating}
                  size="lg"
                  variant="destructive"
                  className="min-w-[180px]"
                >
                  <PowerOff className="h-4 w-4 mr-2" />
                  EMERGENCY STOP
                </Button>
              )}
            </div>
          </div>

          {controls.auto_recovery_enabled && controls.emergency_mode && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800 font-medium">Auto-recovery enabled</p>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Services will automatically restore in {controls.auto_recovery_hours} hours if not manually restored.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spending Monitor */}
      <SpendingMonitor 
        controls={controls}
        onUpdateLimit={updateControl}
        isUpdating={isUpdating}
      />

      {/* API Controls */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">Claude AI API</p>
                <p className="text-sm text-gray-600">Anthropic Claude integration</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={controls.claude_api_enabled ? 'default' : 'destructive'}>
                  {controls.claude_api_enabled ? 'ON' : 'OFF'}
                </Badge>
                <Switch
                  checked={controls.claude_api_enabled}
                  onCheckedChange={(checked) => updateControl('claude_api_enabled', checked)}
                  disabled={isUpdating || controls.emergency_mode}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">OpenAI API</p>
                <p className="text-sm text-gray-600">GPT and embeddings</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={controls.openai_api_enabled ? 'default' : 'destructive'}>
                  {controls.openai_api_enabled ? 'ON' : 'OFF'}
                </Badge>
                <Switch
                  checked={controls.openai_api_enabled}
                  onCheckedChange={(checked) => updateControl('openai_api_enabled', checked)}
                  disabled={isUpdating || controls.emergency_mode}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">Google Maps API</p>
                <p className="text-sm text-gray-600">Location services</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={controls.google_maps_enabled ? 'default' : 'destructive'}>
                  {controls.google_maps_enabled ? 'ON' : 'OFF'}
                </Badge>
                <Switch
                  checked={controls.google_maps_enabled}
                  onCheckedChange={(checked) => updateControl('google_maps_enabled', checked)}
                  disabled={isUpdating || controls.emergency_mode}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">External APIs</p>
                <p className="text-sm text-gray-600">All third-party integrations</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={controls.external_apis_enabled ? 'default' : 'destructive'}>
                  {controls.external_apis_enabled ? 'ON' : 'OFF'}
                </Badge>
                <Switch
                  checked={controls.external_apis_enabled}
                  onCheckedChange={(checked) => updateControl('external_apis_enabled', checked)}
                  disabled={isUpdating || controls.emergency_mode}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <FeatureToggles 
        controls={controls}
        onUpdateControl={updateControl}
        isUpdating={isUpdating}
      />

      {/* Rate Limit Controls */}
      <RateLimitControls 
        controls={controls}
        onUpdateControl={updateControl}
        isUpdating={isUpdating}
      />

      {/* Emergency Activation Log */}
      <EmergencyActivationLog />

      {/* Emergency Stop Dialog */}
      <EmergencyStopDialog
        open={showEmergencyDialog}
        onOpenChange={setShowEmergencyDialog}
        onConfirm={activateEmergencyMode}
      />
    </div>
  );
};

export default EmergencyControlsSection;
