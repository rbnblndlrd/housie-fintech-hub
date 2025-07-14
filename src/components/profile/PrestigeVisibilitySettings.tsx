import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, Eye, EyeOff } from 'lucide-react';

interface PrestigeVisibilitySettingsProps {
  userId: string;
  currentSettings: {
    show_canon_ratio: boolean;
    show_equipped_titles: boolean;
    show_stamp_history: boolean;
    show_echo_feed: boolean;
  };
}

const PrestigeVisibilitySettings: React.FC<PrestigeVisibilitySettingsProps> = ({
  userId,
  currentSettings
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(currentSettings);
  const [saving, setSaving] = useState(false);

  // Only show to profile owner
  if (!user || user.id !== userId) {
    return null;
  }

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Settings saved",
        description: "Your prestige profile visibility settings have been updated.",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to update your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      show_canon_ratio: true,
      show_equipped_titles: true,
      show_stamp_history: true,
      show_echo_feed: true,
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-600"
          size="icon"
        >
          <Settings className="h-5 w-5 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5" />
            Profile Visibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300 text-sm">
            Control what information is visible on your prestige profile to other users.
          </p>

          {/* Settings toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="canon-ratio" className="text-white">
                  Canon Ratio Display
                </Label>
                <p className="text-xs text-gray-400">
                  Show your Canon verification percentage
                </p>
              </div>
              <Switch
                id="canon-ratio"
                checked={settings.show_canon_ratio}
                onCheckedChange={(value) => handleSettingChange('show_canon_ratio', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="equipped-titles" className="text-white">
                  Equipped Titles & Stamps
                </Label>
                <p className="text-xs text-gray-400">
                  Display your active titles and equipped stamps
                </p>
              </div>
              <Switch
                id="equipped-titles"
                checked={settings.show_equipped_titles}
                onCheckedChange={(value) => handleSettingChange('show_equipped_titles', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="stamp-history" className="text-white">
                  Stamp History Timeline
                </Label>
                <p className="text-xs text-gray-400">
                  Show your canon event timeline
                </p>
              </div>
              <Switch
                id="stamp-history"
                checked={settings.show_stamp_history}
                onCheckedChange={(value) => handleSettingChange('show_stamp_history', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="echo-feed" className="text-white">
                  Echo Feed Activity
                </Label>
                <p className="text-xs text-gray-400">
                  Display your canon broadcast activity
                </p>
              </div>
              <Switch
                id="echo-feed"
                checked={settings.show_echo_feed}
                onCheckedChange={(value) => handleSettingChange('show_echo_feed', value)}
              />
            </div>
          </div>

          {/* Privacy notice */}
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
            <div className="flex items-start gap-2">
              <Eye className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-300">
                  <strong>Privacy Note:</strong> These settings only affect your public prestige profile. 
                  Your private dashboard and personal data remain secure.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={resetToDefaults}
              variant="outline"
              className="flex-1"
            >
              Reset Defaults
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrestigeVisibilitySettings;