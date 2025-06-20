
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, MessageCircle, Map, Bell, Brain } from 'lucide-react';

interface FeatureTogglesProps {
  controls: any;
  onUpdateControl: (field: string, value: boolean) => void;
  isUpdating: boolean;
}

const FeatureToggles: React.FC<FeatureTogglesProps> = ({
  controls,
  onUpdateControl,
  isUpdating
}) => {
  const features = [
    {
      key: 'ai_assistant_enabled',
      name: 'AI Assistant',
      description: 'Claude chat and AI features',
      icon: Brain,
      value: controls.ai_assistant_enabled
    },
    {
      key: 'maps_enabled',
      name: 'Maps & Location',
      description: 'Google Maps integration',
      icon: Map,
      value: controls.maps_enabled
    },
    {
      key: 'chat_enabled',
      name: 'Chat System',
      description: 'Real-time messaging',
      icon: MessageCircle,
      value: controls.chat_enabled
    },
    {
      key: 'notifications_enabled',
      name: 'Notifications',
      description: 'Push notifications',
      icon: Bell,
      value: controls.notifications_enabled
    }
  ];

  return (
    <Card className="fintech-chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Feature Toggles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.key}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-semibold">{feature.name}</p>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={feature.value ? 'default' : 'destructive'}>
                    {feature.value ? 'ON' : 'OFF'}
                  </Badge>
                  <Switch
                    checked={feature.value}
                    onCheckedChange={(checked) => onUpdateControl(feature.key, checked)}
                    disabled={isUpdating || controls.emergency_mode}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {controls.emergency_mode && (
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 text-sm">
              ⚠️ Feature toggles are disabled during emergency mode. Deactivate emergency mode to make changes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureToggles;
