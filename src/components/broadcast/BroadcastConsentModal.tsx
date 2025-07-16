import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Radio, MapPin, Users, Settings } from 'lucide-react';
import { BroadcastScope, BroadcastEventType } from '@/utils/broadcastEngine';

interface BroadcastConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consent: boolean, scope: BroadcastScope, rememberChoice: boolean) => void;
  eventType: BroadcastEventType;
  content: string;
  canonLevel: 'canon' | 'non_canon';
}

const BroadcastConsentModal: React.FC<BroadcastConsentModalProps> = ({
  isOpen,
  onClose,
  onConsent,
  eventType,
  content,
  canonLevel
}) => {
  const [selectedScope, setSelectedScope] = useState<BroadcastScope>('local');
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleConsent = (consent: boolean) => {
    onConsent(consent, selectedScope, rememberChoice);
    onClose();
  };

  const getScopeDescription = (scope: BroadcastScope) => {
    switch (scope) {
      case 'local':
        return 'Share with your neighborhood (block level)';
      case 'city':
        return 'Broadcast across Montreal';
      case 'global':
        return 'Share with the entire HOUSIE community';
    }
  };

  const getScopeIcon = (scope: BroadcastScope) => {
    switch (scope) {
      case 'local':
        return <MapPin className="h-4 w-4" />;
      case 'city':
        return <Radio className="h-4 w-4" />;
      case 'global':
        return <Users className="h-4 w-4" />;
    }
  };

  const getEventDescription = (type: BroadcastEventType) => {
    switch (type) {
      case 'title_earned':
        return 'New title earned';
      case 'stamp':
        return 'Achievement stamp collected';
      case 'booking_streak':
        return 'Booking milestone reached';
      case 'prestige_milestone':
        return 'Prestige level increased';
      case 'service_milestone':
        return 'Service milestone achieved';
      default:
        return 'Achievement unlocked';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            Annette wants to shout you out!
          </DialogTitle>
          <DialogDescription>
            Your achievement is ready to become a Community Echo. Choose how widely to broadcast it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Achievement Preview */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getEventDescription(eventType)}
              </Badge>
              <Badge variant={canonLevel === 'canon' ? 'default' : 'secondary'} className="text-xs">
                {canonLevel === 'canon' ? '✅ Canonical' : '🌀 Pending'}
              </Badge>
            </div>
            <p className="text-sm text-foreground/90 font-mono">
              "{content}"
            </p>
          </div>

          {/* Scope Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Broadcast Scope</Label>
            <div className="space-y-2">
              {(['local', 'city', 'global'] as BroadcastScope[]).map((scope) => (
                <div
                  key={scope}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedScope === scope
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedScope(scope)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {getScopeIcon(scope)}
                    <div>
                      <div className="font-medium text-sm capitalize">{scope}</div>
                      <div className="text-xs text-muted-foreground">
                        {getScopeDescription(scope)}
                      </div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedScope === scope
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`} />
                </div>
              ))}
            </div>
          </div>

          {/* Remember Choice */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberChoice}
              onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
            />
            <Label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember my choice for future achievements
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleConsent(false)}>
            Keep Private
          </Button>
          <Button onClick={() => handleConsent(true)} className="gap-2">
            <Radio className="h-4 w-4" />
            Broadcast It!
          </Button>
        </DialogFooter>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <Settings className="h-3 w-3 inline mr-1" />
          You can change broadcast preferences in your profile settings
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastConsentModal;