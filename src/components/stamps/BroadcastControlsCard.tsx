// Broadcast Controls Card - User-side echo toggle settings
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, 
  Eye, 
  Lock, 
  Info,
  Settings
} from 'lucide-react';
import { useBroadcastPreferences } from '@/hooks/useBroadcastPreferences';
import { useToast } from '@/hooks/use-toast';

export function BroadcastControlsCard() {
  const { preferences, loading, updatePreferences } = useBroadcastPreferences();
  const { toast } = useToast();

  const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
    const success = await updatePreferences({ [key]: value });
    if (success) {
      toast({
        title: "Settings Updated",
        description: `Broadcast ${key.replace(/_/g, ' ')} ${value ? 'enabled' : 'disabled'}.`,
        duration: 2000,
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Unable to save broadcast settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Broadcast Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Loading settings...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5" />
          Broadcast Controls
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Control how your achievements appear in the Canon Echo Feed
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show in Broadcasts */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="public-echo" className="text-sm font-medium">
                Show in Broadcasts
              </Label>
              <Badge variant={preferences.public_echo_participation ? "default" : "secondary"} className="text-xs">
                {preferences.public_echo_participation ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Display your achievements in the public Canon Echo Feed
            </p>
          </div>
          <Switch
            id="public-echo"
            checked={preferences.public_echo_participation}
            onCheckedChange={(checked) => handleToggle('public_echo_participation', checked)}
          />
        </div>

        {/* Show Location */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="show-location" className="text-sm font-medium">
                Show Location
              </Label>
              <Badge variant={preferences.show_location ? "default" : "secondary"} className="text-xs">
                {preferences.show_location ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Reveal city/region name or stay anonymous
            </p>
          </div>
          <Switch
            id="show-location"
            checked={preferences.show_location}
            onCheckedChange={(checked) => handleToggle('show_location', checked)}
          />
        </div>

        {/* Canon Lock */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="canon-lock" className="text-sm font-medium">
                Canon Lock
              </Label>
              <Badge variant={preferences.canon_lock ? "default" : "secondary"} className="text-xs">
                {preferences.canon_lock ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Allow stamp visibility even if your display name is anonymized
            </p>
          </div>
          <Switch
            id="canon-lock"
            checked={preferences.canon_lock}
            onCheckedChange={(checked) => handleToggle('canon_lock', checked)}
          />
        </div>

        {/* Auto Broadcast */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="auto-broadcast" className="text-sm font-medium">
                Auto-Broadcast Achievements
              </Label>
              <Badge variant={preferences.auto_broadcast_achievements ? "default" : "secondary"} className="text-xs">
                {preferences.auto_broadcast_achievements ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically share achievements without asking
            </p>
          </div>
          <Switch
            id="auto-broadcast"
            checked={preferences.auto_broadcast_achievements}
            onCheckedChange={(checked) => handleToggle('auto_broadcast_achievements', checked)}
          />
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">
              <strong>Privacy Note:</strong> Even with broadcasts disabled, your achievements 
              are still tracked and contribute to your reputation score. This only controls 
              public visibility in the Echo Feed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}