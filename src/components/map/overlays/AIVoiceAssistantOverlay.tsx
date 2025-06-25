
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, MessageSquare, Navigation, Phone, Minimize2, GripVertical } from 'lucide-react';
import { OverlayWrapper } from './OverlayWrapper';

interface AIVoiceAssistantOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  isFleetMode: boolean;
}

const AIVoiceAssistantOverlay: React.FC<AIVoiceAssistantOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  isFleetMode
}) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceActivated, setVoiceActivated] = useState(false);

  if (!visible) return null;

  if (minimized) {
    return (
      <div className={`absolute ${position} z-30`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onMinimize}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // TODO: Implement actual voice recognition
  };

  return (
    <OverlayWrapper
      position={position}
      draggable={draggable}
      className="z-30"
    >
      <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {draggable && <GripVertical className="h-4 w-4 cursor-grab" />}
              <MessageSquare className="h-4 w-4" />
              🗣️ AI Voice Assistant
            </CardTitle>
            <div className="flex items-center gap-1">
              {voiceActivated && (
                <Badge variant="default" className="text-xs animate-pulse">
                  ACTIVE
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Main Voice Button */}
          <div className="text-center">
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              onClick={handleVoiceToggle}
              className={`w-20 h-20 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              {isListening ? 'Listening...' : 'Ask Claude'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              <Navigation className="h-3 w-3 mr-1" />
              Add Stop
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Read Messages
            </Button>
            {isFleetMode ? (
              <>
                <Button size="sm" variant="outline" className="text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  Call Driver
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Navigation className="h-3 w-3 mr-1" />
                  Optimize Fleet
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" className="text-xs">
                  <Navigation className="h-3 w-3 mr-1" />
                  Check Traffic
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Find Jobs
                </Button>
              </>
            )}
          </div>

          {/* Recent Commands */}
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 mb-2">Recent Commands:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <div>• "Add Tim Hortons to route"</div>
              <div>• "How much time to next job?"</div>
              {isFleetMode && <div>• "Where is driver John?"</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </OverlayWrapper>
  );
};

export default AIVoiceAssistantOverlay;
