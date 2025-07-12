import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Clock, Camera, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FallbackSettings {
  id: string;
  enable_checklist_fallback_flow: boolean;
  allow_retroactive_photo_unlocks: boolean;
  auto_remind_client_before_service: boolean;
  fallback_approval_timeout_hours: number;
}

interface AdminFallbackConfigProps {
  className?: string;
}

export const AdminFallbackConfig: React.FC<AdminFallbackConfigProps> = ({
  className
}) => {
  const [settings, setSettings] = useState<FallbackSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_fallback_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error loading fallback settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (field: keyof FallbackSettings, value: any) => {
    if (!settings) return;

    setSaving(true);
    try {
      const updatedSettings = { ...settings, [field]: value };
      
      const { error } = await supabase
        .from('admin_fallback_settings')
        .update(updatedSettings)
        .eq('id', settings.id);

      if (error) throw error;

      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const getSecurityLevel = () => {
    if (!settings) return 'unknown';
    
    const enabledFeatures = [
      settings.enable_checklist_fallback_flow,
      settings.allow_retroactive_photo_unlocks
    ].filter(Boolean).length;

    if (enabledFeatures === 0) return 'maximum';
    if (enabledFeatures === 1) return 'balanced';
    return 'flexible';
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'maximum':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'balanced':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'flexible':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Failed to load fallback settings
          </div>
        </CardContent>
      </Card>
    );
  }

  const securityLevel = getSecurityLevel();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Checklist Fallback Configuration</span>
          </CardTitle>
          <Badge className={getSecurityColor(securityLevel)}>
            <Shield className="w-3 h-3 mr-1" />
            {securityLevel.toUpperCase()} Security
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Core Fallback Features */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Core Fallback Features</span>
          </h4>
          
          <div className="space-y-4 pl-6 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium">Enable Checklist Fallback Flow</Label>
                <p className="text-sm text-muted-foreground">
                  Allow providers to submit fallback photos when required "before" photos are missed
                </p>
              </div>
              <Switch
                checked={settings.enable_checklist_fallback_flow}
                onCheckedChange={(checked) => updateSetting('enable_checklist_fallback_flow', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium">Allow Retroactive Photo Unlocks</Label>
                <p className="text-sm text-muted-foreground">
                  Enable clients to approve fallbacks for photos that were required but missed
                </p>
              </div>
              <Switch
                checked={settings.allow_retroactive_photo_unlocks}
                onCheckedChange={(checked) => updateSetting('allow_retroactive_photo_unlocks', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Client Communication */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Client Communication</span>
          </h4>
          
          <div className="space-y-4 pl-6 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium">Auto-Remind Client Before Service</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send Annette reminders to unlock photo checklists
                </p>
              </div>
              <Switch
                checked={settings.auto_remind_client_before_service}
                onCheckedChange={(checked) => updateSetting('auto_remind_client_before_service', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium">Fallback Approval Timeout (Hours)</Label>
                <p className="text-sm text-muted-foreground">
                  How long clients have to approve/reject fallback photos
                </p>
              </div>
              <div className="w-20">
                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.fallback_approval_timeout_hours}
                  onChange={(e) => updateSetting('fallback_approval_timeout_hours', parseInt(e.target.value))}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className={cn(
          "p-4 rounded-lg border",
          securityLevel === 'maximum' ? "bg-green-50 border-green-200" :
          securityLevel === 'balanced' ? "bg-yellow-50 border-yellow-200" :
          "bg-red-50 border-red-200"
        )}>
          <div className="flex items-start space-x-2">
            <Shield className={cn(
              "w-5 h-5 mt-0.5",
              securityLevel === 'maximum' ? "text-green-600" :
              securityLevel === 'balanced' ? "text-yellow-600" :
              "text-red-600"
            )} />
            <div>
              <h5 className="font-medium text-sm">Security Level: {securityLevel.toUpperCase()}</h5>
              <p className="text-sm mt-1">
                {securityLevel === 'maximum' && 
                  "Maximum security: All photo requirements are strictly enforced with no automatic overrides."}
                {securityLevel === 'balanced' && 
                  "Balanced security: Some flexibility allowed while maintaining audit trails and client control."}
                {securityLevel === 'flexible' && 
                  "Flexible security: Multiple fallback options enabled. Ensure proper staff training and monitoring."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-sm text-blue-900">Current Configuration Impact</h5>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• {settings.enable_checklist_fallback_flow ? 'Providers CAN' : 'Providers CANNOT'} submit fallback photos</li>
                <li>• {settings.allow_retroactive_photo_unlocks ? 'Clients CAN' : 'Clients CANNOT'} approve missed photos</li>
                <li>• {settings.auto_remind_client_before_service ? 'Annette WILL' : 'Annette WILL NOT'} send pre-service reminders</li>
                <li>• Fallback approvals timeout after {settings.fallback_approval_timeout_hours} hours</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};