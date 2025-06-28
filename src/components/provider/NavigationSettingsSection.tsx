
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationPreferences from '@/components/navigation/NavigationPreferences';
import { Navigation } from 'lucide-react';

interface NavigationSettingsSectionProps {
  onSettingsUpdate?: () => void;
}

const NavigationSettingsSection: React.FC<NavigationSettingsSectionProps> = ({
  onSettingsUpdate
}) => {
  const handlePreferenceChange = () => {
    onSettingsUpdate?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Navigation & GPS Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NavigationPreferences onPreferenceChange={handlePreferenceChange} />
      </CardContent>
    </Card>
  );
};

export default NavigationSettingsSection;
