
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertTriangle, Power, Shield, Database, Zap, Bot, DollarSign, Settings, MessageSquareOff } from "lucide-react";
import { useState, useEffect } from "react";
import { getSupabase } from "../../lib/supabase";
import { toast } from "../ui/use-toast";

const EmergencyControlsSection = () => {
  const [controls, setControls] = useState({
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
    claude_api_killswitch: false,
    claude_api_rate_limiting: false,
    claude_response_filtering: false,
    claude_api_cost_monitor: true,
    normal_operations: true
  });

  const [loading, setLoading] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);

  // Load emergency controls from Supabase
  useEffect(() => {
    const loadControls = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('emergency_controls')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading emergency controls:', error);
          toast({
            title: "Error",
            description: "Failed to load emergency controls",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setCurrentRecordId(data.id);
          setControls({
            bookings_paused: data.bookings_paused || false,
            maintenance_mode: data.maintenance_mode || false,
            new_registrations_disabled: data.new_registrations_disabled || false,
            force_logout_users: data.force_logout_users || false,
            fraud_lockdown_active: data.fraud_lockdown_active || false,
            manual_review_all_bookings: data.manual_review_all_bookings || false,
            geographic_blocking_enabled: data.geographic_blocking_enabled || false,
            payment_restrictions_active: data.payment_restrictions_active || false,
            messaging_disabled: data.messaging_disabled || false,
            emergency_notification_active: data.emergency_notification_active || false,
            provider_broadcast_active: data.provider_broadcast_active || false,
            claude_api_killswitch: !data.claude_api_enabled,
            claude_api_rate_limiting: data.current_daily_spend >= (data.daily_spend_limit * 0.8),
            claude_response_filtering: false,
            claude_api_cost_monitor: data.daily_spend_limit > 0,
            normal_operations: data.normal_operations || true
          });
          console.log('✅ Emergency controls loaded successfully');
        } else {
          // Create default controls if none exist
          await createDefaultControls();
        }
      } catch (error) {
        console.error('Failed to load emergency controls:', error);
        toast({
          title: "Error",
          description: "Failed to load emergency controls",
          variant: "destructive",
        });
      }
    };

    loadControls();

    // Set up real-time subscription
    const supabase = getSupabase();
    const subscription = supabase
      .channel('emergency_controls_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'emergency_controls' },
        (payload) => {
          console.log('🔄 Emergency controls updated by another admin:', payload);
          loadControls(); // Reload when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createDefaultControls = async () => {
    try {
      const supabase = getSupabase();
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
        messaging_disabled: false,
        emergency_notification_active: false,
        provider_broadcast_active: false,
        claude_api_enabled: true,
        daily_spend_limit: 100.00,
        current_daily_spend: 0.00
      };

      const { data, error } = await supabase
        .from('emergency_controls')
        .insert(defaultControls)
        .select()
        .single();

      if (error) throw error;
      
      setCurrentRecordId(data.id);
      console.log('✅ Default emergency controls created');
    } catch (error) {
      console.error('Failed to create default controls:', error);
      toast({
        title: "Error",
        description: "Failed to create default emergency controls",
        variant: "destructive",
      });
    }
  };

  const logEmergencyAction = async (actionType: string, actionDetails: any, previousState?: any, newState?: any) => {
    try {
      const supabase = getSupabase();
      
      // Get current admin user ID from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('log_emergency_action', {
        p_admin_id: user.id,
        p_action_type: actionType,
        p_action_details: actionDetails,
        p_previous_state: previousState || {},
        p_new_state: newState || {}
      });
    } catch (error) {
      console.error('Failed to log emergency action:', error);
      // Don't throw here to avoid breaking the main operation
    }
  };

  const handleEmergencyAction = async (actionId: number, actionTitle: string, controlKey: string) => {
    if (!currentRecordId) {
      toast({
        title: "Error",
        description: "No emergency controls record found",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation for critical actions
    const criticalActions = ['maintenance_mode', 'payment_restrictions_active', 'claude_api_killswitch', 'force_logout_users'];
    if (criticalActions.includes(controlKey)) {
      const newValue = !controls[controlKey];
      const confirmMessage = `Are you sure you want to ${newValue ? 'ENABLE' : 'DISABLE'} ${actionTitle}? This will affect all users immediately.`;
      if (!confirm(confirmMessage)) {
        return;
      }
    }

    console.log(`🚨 Emergency action triggered: ${actionTitle} (ID: ${actionId})`);
    setLoading(true);
    
    try {
      const newValue = !controls[controlKey];
      const previousState = { [controlKey]: controls[controlKey] };
      
      // Update state immediately for UI responsiveness
      setControls(prev => ({ ...prev, [controlKey]: newValue }));

      // Handle frontend-only controls
      if (controlKey === 'claude_response_filtering') {
        console.log(`✅ ${actionTitle} ${newValue ? 'activated' : 'deactivated'} (frontend-only)`);
        toast({
          title: "Success",
          description: `${actionTitle} ${newValue ? 'activated' : 'deactivated'} (frontend-only)`,
        });
        
        await logEmergencyAction(`toggle_${controlKey}`, { 
          control: controlKey, 
          value: newValue, 
          type: 'frontend-only' 
        }, previousState, { [controlKey]: newValue });
        return;
      }

      // Handle database controls
      const supabase = getSupabase();
      let updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      // Map frontend control keys to database fields
      switch (controlKey) {
        case 'claude_api_killswitch':
          updateData.claude_api_enabled = !newValue;
          break;
        case 'claude_api_cost_monitor':
          updateData.daily_spend_limit = newValue ? 100.00 : 0;
          break;
        case 'claude_api_rate_limiting':
          // Implement rate limiting by adjusting spend limits
          updateData.daily_spend_limit = newValue ? 10.00 : 100.00;
          break;
        default:
          updateData[controlKey] = newValue;
      }

      // Update the specific record using its ID
      const { error } = await supabase
        .from('emergency_controls')
        .update(updateData)
        .eq('id', currentRecordId);

      if (error) {
        console.error('Failed to update emergency control:', error);
        // Revert state if database update failed
        setControls(prev => ({ ...prev, [controlKey]: !newValue }));
        toast({
          title: "Error",
          description: `Failed to update ${actionTitle}: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log(`✅ ${actionTitle} ${newValue ? 'activated' : 'deactivated'} successfully`);
      toast({
        title: "Success",
        description: `${actionTitle} ${newValue ? 'activated' : 'deactivated'} successfully`,
      });

      // Log the action for audit trail
      await logEmergencyAction(`toggle_${controlKey}`, { 
        control: controlKey, 
        value: newValue,
        actionTitle 
      }, previousState, { [controlKey]: newValue });

    } catch (error) {
      console.error('Error updating emergency control:', error);
      // Revert state on error
      setControls(prev => ({ ...prev, [controlKey]: !controls[controlKey] }));
      toast({
        title: "Error",
        description: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCriticalAction = async (actionType: string) => {
    if (!currentRecordId) {
      toast({
        title: "Error",
        description: "No emergency controls record found",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
    const confirmMessage = `Are you sure you want to execute "${actionType}"? This is a critical system operation.`;
    if (!confirm(confirmMessage)) {
      return;
    }

    console.log(`🚨 Critical emergency action: ${actionType}`);
    setLoading(true);
    
    try {
      const supabase = getSupabase();
      
      if (actionType === 'Emergency Database Backup') {
        const { error } = await supabase
          .from('emergency_controls')
          .update({ 
            last_backup_triggered: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', currentRecordId);
          
        if (error) throw error;
        
        console.log('✅ Emergency backup triggered successfully');
        toast({
          title: "Success",
          description: "Emergency backup triggered successfully",
        });

        await logEmergencyAction('emergency_backup', { 
          timestamp: new Date().toISOString() 
        });
        
      } else if (actionType === 'Platform Shutdown') {
        const { error } = await supabase
          .from('emergency_controls')
          .update({ 
            maintenance_mode: true, 
            normal_operations: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentRecordId);
          
        if (error) throw error;
        
        setControls(prev => ({ ...prev, maintenance_mode: true, normal_operations: false }));
        console.log('✅ Platform shutdown initiated');
        toast({
          title: "Critical Action",
          description: "Platform shutdown initiated - maintenance mode enabled",
          variant: "destructive",
        });

        await logEmergencyAction('platform_shutdown', { 
          timestamp: new Date().toISOString() 
        });
      }
    } catch (error) {
      console.error('Critical action failed:', error);
      toast({
        title: "Error",
        description: `Critical action failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const systemStatus = {
    platform: controls.maintenance_mode ? "maintenance" : "operational",
    payments: controls.payment_restrictions_active ? "restricted" : "operational", 
    chat: controls.messaging_disabled ? "disabled" : "operational",
    notifications: controls.emergency_notification_active ? "emergency" : "operational",
    api: controls.claude_api_killswitch ? "disabled" : "operational"
  };

  const emergencyActions = [
    {
      id: 1,
      title: "Disable New Registrations",
      description: "Temporarily stop new user registrations",
      status: controls.new_registrations_disabled ? "active" : "inactive",
      critical: false,
      controlKey: "new_registrations_disabled"
    },
    {
      id: 2, 
      title: "Emergency Maintenance Mode",
      description: "Put platform in maintenance mode",
      status: controls.maintenance_mode ? "active" : "inactive",
      critical: true,
      controlKey: "maintenance_mode"
    },
    {
      id: 3,
      title: "Disable Payments",
      description: "Temporarily disable all payment processing",
      status: controls.payment_restrictions_active ? "active" : "inactive",
      critical: true,
      controlKey: "payment_restrictions_active"
    },
    {
      id: 4,
      title: "Rate Limit API",
      description: "Enforce strict API rate limiting",
      status: controls.claude_api_rate_limiting ? "active" : "inactive",
      critical: false,
      controlKey: "claude_api_rate_limiting"
    }
  ];

  const claudeApiControls = [
    {
      id: 5,
      title: "Claude API Killswitch",
      description: "Immediately disable all Claude API access platform-wide",
      status: controls.claude_api_killswitch ? "active" : "inactive",
      critical: true,
      controlKey: "claude_api_killswitch"
    },
    {
      id: 6,
      title: "API Rate Limiting",
      description: "Enable aggressive rate limiting for Claude API",
      status: controls.claude_api_rate_limiting ? "active" : "inactive",
      critical: false,
      controlKey: "claude_api_rate_limiting"
    },
    {
      id: 7,
      title: "Response Filtering",
      description: "Enable strict content filtering for Claude responses",
      status: controls.claude_response_filtering ? "active" : "inactive",
      critical: false,
      controlKey: "claude_response_filtering"
    },
    {
      id: 8,
      title: "API Cost Monitor",
      description: "Monitor and control Claude API spending limits",
      status: controls.claude_api_cost_monitor ? "active" : "inactive",
      critical: false,
      controlKey: "claude_api_cost_monitor"
    }
  ];

  const isAnyEmergencyActive = !controls.normal_operations || 
    controls.bookings_paused || 
    controls.maintenance_mode || 
    controls.fraud_lockdown_active ||
    controls.messaging_disabled ||
    controls.claude_api_killswitch;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Emergency Controls
          <Badge variant="outline">Admin Only</Badge>
          {isAnyEmergencyActive && (
            <Badge variant="destructive">EMERGENCY ACTIVE</Badge>
          )}
          {currentRecordId && (
            <Badge variant="secondary" className="text-xs">ID: {currentRecordId.slice(0, 8)}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">System Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'operational' ? 'bg-green-500' : 
                  status === 'degraded' || status === 'emergency' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm capitalize">{service}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Platform Controls</h4>
          <div className="grid gap-3">
            {emergencyActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {action.critical ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Settings className="h-5 w-5 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={action.status === 'active' ? 'destructive' : 'outline'}>
                    {action.status}
                  </Badge>
                  <Button 
                    variant={action.status === 'active' ? 'default' : action.critical ? 'destructive' : 'secondary'}
                    size="sm"
                    disabled={loading || !currentRecordId}
                    onClick={() => handleEmergencyAction(action.id, action.title, action.controlKey)}
                  >
                    <Power className="h-3 w-3 mr-1" />
                    {action.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Claude 4 API Controls
          </h4>
          <div className="grid gap-3">
            {claudeApiControls.map((control) => (
              <div key={control.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="flex items-center gap-3">
                  {control.critical ? (
                    <Bot className="h-5 w-5 text-red-500" />
                  ) : control.controlKey === 'claude_api_cost_monitor' ? (
                    <DollarSign className="h-5 w-5 text-green-600" />
                  ) : (
                    <Zap className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">{control.title}</p>
                    <p className="text-sm text-muted-foreground">{control.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={control.status === 'active' ? 'destructive' : 'outline'}>
                    {control.status}
                  </Badge>
                  <Button 
                    variant={control.status === 'active' ? 'default' : control.critical ? 'destructive' : 'secondary'}
                    size="sm"
                    disabled={loading || !currentRecordId}
                    onClick={() => handleEmergencyAction(control.id, control.title, control.controlKey)}
                  >
                    <Power className="h-3 w-3 mr-1" />
                    {control.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-600">Critical Emergency Actions</span>
          </div>
          <p className="text-sm text-red-600 mb-3">
            These actions will immediately affect all users. Use only in genuine emergencies.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              size="sm"
              disabled={loading || !currentRecordId}
              onClick={() => handleCriticalAction('Emergency Database Backup')}
            >
              <Database className="h-3 w-3 mr-1" />
              Emergency Database Backup
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              disabled={loading || !currentRecordId}
              onClick={() => handleCriticalAction('Platform Shutdown')}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Platform Shutdown
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyControlsSection;
