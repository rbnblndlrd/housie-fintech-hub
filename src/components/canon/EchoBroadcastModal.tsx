import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Radio, 
  MapPin, 
  Eye, 
  EyeOff, 
  Users, 
  Globe,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EchoLocation, EchoVisibility, createCanonEcho, getEchoBroadcastVoiceLine } from '@/utils/canonEchoEngine';
import { CanonMetadata } from '@/utils/canonHelper';

interface EchoBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: EchoLocation, visibility: EchoVisibility) => Promise<void>;
  message: string;
  canonMetadata: CanonMetadata;
  suggestedLocation?: EchoLocation;
}

export const EchoBroadcastModal: React.FC<EchoBroadcastModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  canonMetadata,
  suggestedLocation = 'profile'
}) => {
  const [selectedLocation, setSelectedLocation] = useState<EchoLocation>(suggestedLocation);
  const [selectedVisibility, setSelectedVisibility] = useState<EchoVisibility>('public');
  const [isConfirming, setIsConfirming] = useState(false);

  const locationOptions = [
    {
      key: 'profile' as EchoLocation,
      label: 'Profile',
      icon: Eye,
      description: 'Shows on your profile for connections to see',
      color: 'text-blue-600'
    },
    {
      key: 'city-board' as EchoLocation,
      label: 'City Board',
      icon: Radio,
      description: 'Public city-wide announcement board',
      color: 'text-purple-600'
    },
    {
      key: 'map' as EchoLocation,
      label: 'Map Pin',
      icon: MapPin,
      description: 'Geographic location marker on the map',
      color: 'text-green-600'
    },
    {
      key: 'none' as EchoLocation,
      label: 'Private',
      icon: EyeOff,
      description: 'Keep this echo private (Canon Log only)',
      color: 'text-gray-600'
    }
  ];

  const visibilityOptions = [
    {
      key: 'public' as EchoVisibility,
      label: 'Public',
      icon: Globe,
      description: 'Anyone can see this echo'
    },
    {
      key: 'network-only' as EchoVisibility,
      label: 'Network Only',
      icon: Users,
      description: 'Only your trusted connections can see this'
    },
    {
      key: 'private' as EchoVisibility,
      label: 'Private',
      icon: EyeOff,
      description: 'Only you can see this echo'
    }
  ];

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(selectedLocation, selectedVisibility);
      onClose();
    } catch (error) {
      console.error('Error confirming broadcast:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const getAnnetteVoiceLine = () => {
    return getEchoBroadcastVoiceLine(selectedLocation, canonMetadata.trust === 'canon');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Avatar className="w-6 h-6 bg-gradient-to-r from-purple-100 to-orange-100">
              <AvatarFallback>
                <img 
                  src="/lovable-uploads/854d6f0c-9abe-4605-bb62-0a08d7ea62dc.png" 
                  alt="Annette"
                  className="w-full h-full object-cover rounded-full"
                />
              </AvatarFallback>
            </Avatar>
            <span>Broadcast Canon Echo?</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Echo Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                {canonMetadata.trust === 'canon' ? (
                  <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Canon Verified</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-700 border border-orange-500/20 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>Non-Canon</span>
                  </div>
                )}
                <Badge variant="outline" className="text-xs">
                  {Math.round(canonMetadata.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <p className="text-sm text-foreground italic">
                "{message}"
              </p>
            </CardContent>
          </Card>

          {/* Annette Voice Line */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <Avatar className="w-6 h-6 bg-gradient-to-r from-purple-100 to-orange-100">
                <AvatarFallback>
                  <img 
                    src="/lovable-uploads/854d6f0c-9abe-4605-bb62-0a08d7ea62dc.png" 
                    alt="Annette"
                    className="w-full h-full object-cover rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Annette says:</p>
                <p className="text-sm italic">"{getAnnetteVoiceLine()}"</p>
              </div>
            </div>
          </div>

          {/* Location Selection */}
          <div>
            <h4 className="text-sm font-medium mb-2">Where should this echo appear?</h4>
            <div className="grid grid-cols-2 gap-2">
              {locationOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.key}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedLocation === option.key && "ring-2 ring-primary/50"
                    )}
                    onClick={() => setSelectedLocation(option.key)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className={cn("w-4 h-4", option.color)} />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Visibility Selection (only if not private location) */}
          {selectedLocation !== 'none' && (
            <div>
              <h4 className="text-sm font-medium mb-2">Who can see this echo?</h4>
              <div className="space-y-2">
                {visibilityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={option.key}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md",
                        selectedVisibility === option.key && "ring-2 ring-primary/50"
                      )}
                      onClick={() => setSelectedVisibility(option.key)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Keep Private
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={isConfirming}
              className="flex-1"
            >
              {isConfirming ? 'Broadcasting...' : 'Broadcast Echo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};