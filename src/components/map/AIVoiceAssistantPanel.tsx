
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Plus, Navigation, MessageSquare, Clock } from 'lucide-react';

interface AIVoiceAssistantPanelProps {
  isListening: boolean;
  onToggleListening: () => void;
  recentCommands: string[];
  onQuickAction: (action: string) => void;
}

const AIVoiceAssistantPanel: React.FC<AIVoiceAssistantPanelProps> = ({
  isListening,
  onToggleListening,
  recentCommands,
  onQuickAction
}) => {
  const quickActions = [
    { label: 'Add Stop to Route', action: 'add_stop', icon: Plus },
    { label: 'Check Traffic', action: 'check_traffic', icon: Navigation },
    { label: 'Find Nearby Services', action: 'find_services', icon: MessageSquare },
    { label: 'Read Messages', action: 'read_messages', icon: MessageSquare }
  ];

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-purple-700 flex items-center gap-2 text-sm">
          <Mic className="h-4 w-4" />
          🗣️ AI Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Large microphone button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            onClick={onToggleListening}
            size="lg"
            className={`w-20 h-20 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
          <p className="text-sm text-purple-700 font-medium">
            {isListening ? 'Listening...' : 'Ask Claude'}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Actions</h4>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.action}
                onClick={() => onQuickAction(action.action)}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>

        {/* Recent commands history */}
        {recentCommands.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Recent Commands
            </h4>
            <div className="space-y-1">
              {recentCommands.slice(0, 3).map((command, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded p-2">
                  "{command}"
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIVoiceAssistantPanel;
