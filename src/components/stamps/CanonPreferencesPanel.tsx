import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useCanonPreferences } from '@/hooks/useCanonPreferences';
import { Settings, Radio, Eye, MessageSquare, Shield, Star } from 'lucide-react';

export const CanonPreferencesPanel = () => {
  const { preferences, loading, saving, updatePreferences } = useCanonPreferences();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Canon Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Canon Preferences
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize how Annette behaves and what gets shared publicly
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Echo Visibility Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <h3 className="text-sm font-medium">Canon Visibility Controls</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="space-y-2">
              <Label htmlFor="echo-visibility">Echo Visibility</Label>
              <Select
                value={preferences.echo_visibility}
                onValueChange={(value: 'public' | 'local' | 'hidden') =>
                  updatePreferences({ echo_visibility: value })
                }
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Visible to everyone</SelectItem>
                  <SelectItem value="local">Local - Visible to your network</SelectItem>
                  <SelectItem value="hidden">Hidden - Private only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location-sharing">Location Sharing</Label>
                <p className="text-xs text-muted-foreground">
                  Show your city/region in Canon Echoes
                </p>
              </div>
              <Switch
                id="location-sharing"
                checked={preferences.location_sharing_enabled}
                onCheckedChange={(checked) =>
                  updatePreferences({ location_sharing_enabled: checked })
                }
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Annette Style Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <h3 className="text-sm font-medium">Annette Style Settings</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="space-y-2">
              <Label htmlFor="voice-style">Voice Style</Label>
              <Select
                value={preferences.voice_style}
                onValueChange={(value: 'professional' | 'warm' | 'sassy' | 'softspoken' | 'default') =>
                  updatePreferences({ voice_style: value })
                }
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Annette Default</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="sassy">Sassy</SelectItem>
                  <SelectItem value="softspoken">Softspoken</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sassiness-intensity">
                Sassiness Intensity: {preferences.sassiness_intensity}
              </Label>
              <Slider
                id="sassiness-intensity"
                min={0}
                max={3}
                step={1}
                value={[preferences.sassiness_intensity]}
                onValueChange={([value]) =>
                  updatePreferences({ sassiness_intensity: value })
                }
                disabled={saving}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Spicy</span>
                <span>🔥 Extra</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Canon Badge Display */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <h3 className="text-sm font-medium">Canon Badge Display</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="canon-badge">Show Canon Badge on Profile</Label>
                <p className="text-xs text-muted-foreground">
                  Display your Canon title publicly
                </p>
              </div>
              <Switch
                id="canon-badge"
                checked={preferences.show_canon_badge_on_profile}
                onCheckedChange={(checked) =>
                  updatePreferences({ show_canon_badge_on_profile: checked })
                }
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stamp-visibility">Stamp Visibility</Label>
              <Select
                value={preferences.stamp_visibility}
                onValueChange={(value: 'all' | 'canon_only' | 'private') =>
                  updatePreferences({ stamp_visibility: value })
                }
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stamps - Show everything</SelectItem>
                  <SelectItem value="canon_only">Canon Only - Verified stamps only</SelectItem>
                  <SelectItem value="private">Private - Hidden from others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trust Feedback Loops */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <h3 className="text-sm font-medium">Trust & Privacy Controls</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="manual-review">Manual Stamp Review</Label>
                <p className="text-xs text-muted-foreground">
                  Manually approve stamp triggers before they're awarded
                </p>
              </div>
              <Switch
                id="manual-review"
                checked={preferences.manual_stamp_review_enabled}
                onCheckedChange={(checked) =>
                  updatePreferences({ manual_stamp_review_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="canon-history">Canon Event History</Label>
                <p className="text-xs text-muted-foreground">
                  Show past Canon events on your public profile
                </p>
              </div>
              <Switch
                id="canon-history"
                checked={preferences.canon_event_history_visible}
                onCheckedChange={(checked) =>
                  updatePreferences({ canon_event_history_visible: checked })
                }
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {saving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
            Saving preferences...
          </div>
        )}
      </CardContent>
    </Card>
  );
};