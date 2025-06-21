
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface CalendarModeToggleProps {
  isGoogleSyncMode: boolean;
  onModeToggle: (checked: boolean) => void;
}

const CalendarModeToggle: React.FC<CalendarModeToggleProps> = ({
  isGoogleSyncMode,
  onModeToggle
}) => {
  const { isFeatureAvailable } = useSubscription();
  const { toast } = useToast();
  const { isConnected: googleConnected } = useGoogleCalendar();

  const handleModeToggle = (checked: boolean) => {
    if (checked && !isFeatureAvailable('google_calendar')) {
      toast({
        title: "Fonctionnalité Premium",
        description: "La synchronisation Google Calendar nécessite un abonnement Premium.",
        variant: "destructive",
      });
      return;
    }
    
    if (checked && !googleConnected) {
      toast({
        title: "Google Calendar non connecté",
        description: "Veuillez d'abord connecter votre Google Calendar.",
        variant: "destructive",
      });
      return;
    }
    
    onModeToggle(checked);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {isGoogleSyncMode ? (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Wifi className="h-3 w-3 mr-1" />
            Synchronisé
          </Badge>
        ) : (
          <Badge variant="outline">
            <WifiOff className="h-3 w-3 mr-1" />
            Local
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
        <div className="flex items-center gap-3">
          <Label htmlFor="sync-mode" className="text-sm font-medium text-gray-700">
            Mode Calendrier
          </Label>
          <div className="text-xs text-gray-500">
            {isGoogleSyncMode ? 'Google Calendar Sync' : 'HOUSIE Local'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="sync-mode"
            checked={isGoogleSyncMode}
            onCheckedChange={handleModeToggle}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
          />
          {!isFeatureAvailable('google_calendar') && isGoogleSyncMode === false && (
            <Badge variant="outline" className="text-xs">
              Premium requis
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarModeToggle;
