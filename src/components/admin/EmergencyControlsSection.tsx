import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, DollarSign, Clock, Power, PowerOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EmergencyControls {
  id: string;
  claude_api_enabled: boolean;
  daily_spend_limit: number;
  current_daily_spend: number;
  spend_reset_date: string;
  disabled_reason: string | null;
  disabled_at: string | null;
  disabled_by_user_id: string | null;
  last_updated_at: string;
}

const EmergencyControlsSection = () => {
  const { user } = useAuth();
  const [controls, setControls] = useState<EmergencyControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const toggleClaudeAPI = async (enable: boolean) => {
    if (!user || !controls) return;

    setIsUpdating(true);
    try {
      const updateData = {
        claude_api_enabled: enable,
        disabled_reason: enable ? null : 'Manually disabled by admin',
        disabled_at: enable ? null : new Date().toISOString(),
        disabled_by_user_id: enable ? null : user.id,
        last_updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('emergency_controls')
        .update(updateData)
        .eq('id', controls.id);

      if (error) throw error;

      setControls({ ...controls, ...updateData });
      toast.success(enable ? 'Claude API enabled successfully' : 'Claude API disabled successfully');
    } catch (error) {
      console.error('Error updating emergency controls:', error);
      toast.error('Failed to update emergency controls');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSpendLimit = async (newLimit: number) => {
    if (!controls) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('emergency_controls')
        .update({
          daily_spend_limit: newLimit,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', controls.id);

      if (error) throw error;

      setControls({ ...controls, daily_spend_limit: newLimit });
      toast.success('Daily spend limit updated successfully');
    } catch (error) {
      console.error('Error updating spend limit:', error);
      toast.error('Failed to update spend limit');
    } finally {
      setIsUpdating(false);
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
          <CardTitle>Emergency Controls</CardTitle>
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

  const spendPercentage = Math.min((controls.current_daily_spend / controls.daily_spend_limit) * 100, 100);
  const isNearLimit = spendPercentage >= 80;
  const isAtLimit = spendPercentage >= 100;

  return (
    <div className="space-y-6">
      {/* API Status Card */}
      <Card className={`fintech-chart-container ${!controls.claude_api_enabled ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Claude API Status
            </span>
            <Badge variant={controls.claude_api_enabled ? 'default' : 'destructive'} className={controls.claude_api_enabled ? 'bg-green-100 text-green-800' : ''}>
              {controls.claude_api_enabled ? 'ACTIVE' : 'DISABLED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {controls.claude_api_enabled ? 'API is operational' : 'API is disabled'}
              </p>
              {controls.disabled_reason && (
                <p className="text-sm text-gray-600">Reason: {controls.disabled_reason}</p>
              )}
              {controls.disabled_at && (
                <p className="text-xs text-gray-500">
                  Disabled at: {new Date(controls.disabled_at).toLocaleString()}
                </p>
              )}
            </div>
            
            <Button
              onClick={() => toggleClaudeAPI(!controls.claude_api_enabled)}
              disabled={isUpdating}
              size="lg"
              className={
                controls.claude_api_enabled 
                  ? "bg-red-600 hover:bg-red-700 text-white min-w-[180px]"
                  : "bg-green-600 hover:bg-green-700 text-white min-w-[180px]"
              }
            >
              {isUpdating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : controls.claude_api_enabled ? (
                <PowerOff className="h-4 w-4 mr-2" />
              ) : (
                <Power className="h-4 w-4 mr-2" />
              )}
              {controls.claude_api_enabled ? 'EMERGENCY DISABLE' : 'RE-ENABLE API'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Spend Monitoring Card */}
      <Card className="fintech-chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Daily Spend Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Current Spend</p>
              <p className="text-2xl font-bold text-gray-900">
                ${controls.current_daily_spend.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Daily Limit</p>
              <p className="text-2xl font-bold text-gray-900">
                ${controls.daily_spend_limit.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.max(0, controls.daily_spend_limit - controls.current_daily_spend).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Spend Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{spendPercentage.toFixed(1)}%</span>
                {isAtLimit && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {isNearLimit && !isAtLimit && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              </div>
            </div>
            <Progress 
              value={spendPercentage} 
              className={`h-3 ${isAtLimit ? 'bg-red-200' : isNearLimit ? 'bg-yellow-200' : 'bg-green-200'}`}
            />
          </div>

          {isAtLimit && (
            <div className="bg-red-100 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">Daily spend limit reached!</p>
              </div>
              <p className="text-red-700 text-sm mt-1">
                API has been automatically disabled to prevent further charges.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => updateSpendLimit(50)}
              disabled={isUpdating}
              size="sm"
            >
              Set $50 Limit
            </Button>
            <Button
              variant="outline"
              onClick={() => updateSpendLimit(100)}
              disabled={isUpdating}
              size="sm"
            >
              Set $100 Limit
            </Button>
            <Button
              variant="outline"
              onClick={() => updateSpendLimit(200)}
              disabled={isUpdating}
              size="sm"
            >
              Set $200 Limit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Information */}
      <Card className="fintech-chart-container">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              Daily spend resets automatically at midnight UTC. 
              Last reset: {new Date(controls.spend_reset_date).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyControlsSection;
