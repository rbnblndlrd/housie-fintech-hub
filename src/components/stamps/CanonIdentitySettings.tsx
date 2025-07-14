// Canon Identity Settings - Annette voice style and canon display preferences
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic2, 
  Badge as BadgeIcon, 
  Activity, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useBroadcastPreferences } from '@/hooks/useBroadcastPreferences';
import { useToast } from '@/hooks/use-toast';

export function CanonIdentitySettings() {
  const { preferences, loading, updatePreferences } = useBroadcastPreferences();
  const { toast } = useToast();

  const handleVoiceStyleChange = async (style: 'default' | 'sassy' | 'classic') => {
    const success = await updatePreferences({ annette_voice_style: style });
    if (success) {
      toast({
        title: "Voice Style Updated",
        description: `Annette will now use ${style} voice style.`,
        duration: 2000,
      });
    }
  };

  const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
    const success = await updatePreferences({ [key]: value });
    if (success) {
      toast({
        title: "Settings Updated",
        description: `${key.replace(/_/g, ' ')} ${value ? 'enabled' : 'disabled'}.`,
        duration: 2000,
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Canon Identity Settings
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
          <Sparkles className="h-5 w-5" />
          Canon Identity Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize how Annette interacts with you and how your Canon status displays
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Annette Voice Style */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mic2 className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Annette Voice Style</Label>
          </div>
          <Select 
            value={preferences.annette_voice_style} 
            onValueChange={handleVoiceStyleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose voice style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">
                <div className="flex items-center gap-2">
                  <span>Default</span>
                  <Badge variant="outline" className="text-xs">Balanced</Badge>
                </div>
              </SelectItem>
              <SelectItem value="sassy">
                <div className="flex items-center gap-2">
                  <span>Sassy</span>
                  <Badge variant="outline" className="text-xs">Confident</Badge>
                </div>
              </SelectItem>
              <SelectItem value="classic">
                <div className="flex items-center gap-2">
                  <span>Classic</span>
                  <Badge variant="outline" className="text-xs">Professional</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {preferences.annette_voice_style === 'default' && 'Balanced mix of encouragement and guidance'}
            {preferences.annette_voice_style === 'sassy' && 'More confident and playful responses'}
            {preferences.annette_voice_style === 'classic' && 'Formal and professional tone'}
          </p>
        </div>

        {/* Canon Badge Display */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BadgeIcon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="canon-badge" className="text-sm font-medium">
                Canon Badge Display
              </Label>
              <Badge variant={preferences.canon_badge_display ? "default" : "secondary"} className="text-xs">
                {preferences.canon_badge_display ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Show your public Canon Ratio % as a trust indicator
            </p>
          </div>
          <Switch
            id="canon-badge"
            checked={preferences.canon_badge_display}
            onCheckedChange={(checked) => handleToggle('canon_badge_display', checked)}
          />
        </div>

        {/* Live Echo Participation */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="live-echo" className="text-sm font-medium">
                Live Echo Participation
              </Label>
              <Badge variant={preferences.live_echo_participation ? "default" : "secondary"} className="text-xs">
                {preferences.live_echo_participation ? 'ON' : 'OFF'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              See your last 5 broadcasted achievements in real-time
            </p>
          </div>
          <Switch
            id="live-echo"
            checked={preferences.live_echo_participation}
            onCheckedChange={(checked) => handleToggle('live_echo_participation', checked)}
          />
        </div>

        {/* Recent Echo Activity */}
        {preferences.live_echo_participation && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Recent Echo Activity</Label>
            </div>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {/* Mock recent activities - replace with real data */}
                <div className="p-2 bg-muted/20 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stamp Earned: Road Warrior</span>
                    <Badge variant="outline" className="text-xs">Canon</Badge>
                  </div>
                  <span className="text-muted-foreground">2 hours ago</span>
                </div>
                <div className="p-2 bg-muted/20 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Job Completed: 5-Star Review</span>
                    <Badge variant="outline" className="text-xs">Canon</Badge>
                  </div>
                  <span className="text-muted-foreground">1 day ago</span>
                </div>
                <div className="text-center text-muted-foreground py-2 text-xs">
                  No more recent activity
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}