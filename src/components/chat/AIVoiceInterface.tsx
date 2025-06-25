
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Navigation, MessageSquare, Phone } from 'lucide-react';

interface AIVoiceInterfaceProps {
  isFleetMode?: boolean;
}

const AIVoiceInterface: React.FC<AIVoiceInterfaceProps> = ({ isFleetMode = false }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // TODO: Implement actual voice recognition
  };

  const quickActions = isFleetMode 
    ? [
        { icon: Navigation, label: 'Add Stop' },
        { icon: MessageSquare, label: 'Read Messages' },
        { icon: Phone, label: 'Call Driver' },
        { icon: Navigation, label: 'Optimize Fleet' }
      ]
    : [
        { icon: Navigation, label: 'Add Stop' },
        { icon: MessageSquare, label: 'Read Messages' },
        { icon: Navigation, label: 'Check Traffic' },
        { icon: MessageSquare, label: 'Find Jobs' }
      ];

  const recentCommands = isFleetMode
    ? [
        '• "Add Tim Hortons to route"',
        '• "How much time to next job?"',
        '• "Where is driver John?"'
      ]
    : [
        '• "Add Tim Hortons to route"',
        '• "How much time to next job?"',
        '• "Find cleaning jobs nearby"'
      ];

  return (
    <div className="p-4 space-y-4">
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
        {quickActions.map((action, index) => (
          <Button 
            key={index}
            size="sm" 
            variant="outline" 
            className="text-xs justify-start"
          >
            <action.icon className="h-3 w-3 mr-1" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Recent Commands */}
      <div className="pt-2 border-t">
        <p className="text-xs text-gray-600 mb-2">Recent Commands:</p>
        <div className="space-y-1 text-xs text-gray-500">
          {recentCommands.map((command, index) => (
            <div key={index}>{command}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIVoiceInterface;
