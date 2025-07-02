import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { 
  MapPin, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Navigation,
  Shield,
  Save
} from 'lucide-react';

interface QuickSettings {
  showOnMap: boolean;
  confidentialityRadius: number;
  serviceRadius: number;
}

const QuickSettingsPanel = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<QuickSettings>({
    showOnMap: true,
    confidentialityRadius: 10,
    serviceRadius: 25
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load from user_profiles table for most settings
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('service_radius_km')
        .eq('user_id', user.id)
        .single();

      // Load from users table for privacy settings - use available columns
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      }

      if (userError && userError.code !== 'PGRST116') {
        console.error('User error:', userError);
      }

      setSettings({
        showOnMap: userData?.show_on_map ?? true,
        confidentialityRadius: userData?.confidentiality_radius ? Math.round(userData.confidentiality_radius / 1000) : 10,
        serviceRadius: profileData?.service_radius_km ?? 25
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          service_radius_km: settings.serviceRadius,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          show_on_map: settings.showOnMap,
          confidentiality_radius: settings.confidentialityRadius * 1000,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userError) {
        throw userError;
      }

      toast({
        title: "Settings Updated",
        description: "Your quick settings have been saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 min-w-[300px]">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium text-sm">Quick Settings</h3>
      </div>

      {/* Show on Map Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.showOnMap ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            <Label htmlFor="quickShowOnMap" className="text-sm font-medium">
              Show on Map
            </Label>
          </div>
          <Switch
            id="quickShowOnMap"
            checked={settings.showOnMap}
            onCheckedChange={(checked) => 
              setSettings({ ...settings, showOnMap: checked })
            }
          />
        </div>
        <p className="text-xs text-gray-600">
          Allow clients to discover you via the interactive map
        </p>
      </div>

      {/* Comfort Zone Radius */}
      {settings.showOnMap && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <Label className="text-sm font-medium">
                Privacy Zone: {settings.confidentialityRadius} km
              </Label>
            </div>
            <Slider
              value={[settings.confidentialityRadius]}
              onValueChange={([value]) => 
                setSettings({ ...settings, confidentialityRadius: value })
              }
              min={1}
              max={25}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 km</span>
              <span>25 km</span>
            </div>
          </div>
        </>
      )}

      {/* Service Radius (for providers) */}
      {currentRole === 'provider' && settings.showOnMap && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium">
                Service Range: {settings.serviceRadius} km
              </Label>
            </div>
            <Slider
              value={[settings.serviceRadius]}
              onValueChange={([value]) => 
                setSettings({ ...settings, serviceRadius: value })
              }
              min={5}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 km</span>
              <span>50 km</span>
            </div>
          </div>
        </>
      )}


      {/* Save Button */}
      <Separator />
      <Button 
        onClick={handleSaveSettings}
        disabled={saving}
        className="w-full fintech-button-primary text-sm h-8"
        size="sm"
      >
        {saving ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <span>Saving...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Save className="h-3 w-3" />
            <span>Save Settings</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default QuickSettingsPanel;