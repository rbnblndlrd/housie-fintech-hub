
import React, { useState } from 'react';
import { Bot, Plus, Clock, Zap, Home, Calculator, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIChat } from '@/hooks/useAIChat';
import AIConversation from './AIConversation';

const AIAssistantTab = () => {
  const { sessions, activeSession, loadMessages, createSession } = useAIChat();
  const [showConversation, setShowConversation] = useState(false);

  const handleSessionClick = (sessionId: string) => {
    loadMessages(sessionId);
    setShowConversation(true);
  };

  const handleNewChat = async () => {
    const newSession = await createSession();
    if (newSession) {
      handleSessionClick(newSession.id);
    }
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const quickActions = [
    {
      icon: Home,
      title: "Find Services",
      description: "Discover local service providers",
      prompt: "I'm looking for home cleaning services in my area. Can you help me find reliable providers?"
    },
    {
      icon: Calculator,
      title: "Price Estimate",
      description: "Get cost estimates for services",
      prompt: "What's the typical cost for professional house cleaning for a 3-bedroom home?"
    },
    {
      icon: MessageSquare,
      title: "Booking Help",
      description: "Assistance with booking services",
      prompt: "I need help booking a lawn care service. What information do I need to provide?"
    },
    {
      icon: Zap,
      title: "Quick Tips",
      description: "Service tips and recommendations",
      prompt: "What should I prepare before a house cleaning service arrives?"
    }
  ];

  if (showConversation && activeSession) {
    return (
      <AIConversation
        sessionId={activeSession}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* AI Header */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">HOUSIE AI Assistant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your smart service companion</p>
          </div>
        </div>
        
        <Button 
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start New Chat
        </Button>
      </div>

      {/* Quick Actions */}
      {sessions.length === 0 && (
        <div className="p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={handleNewChat}
                className="p-3 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <action.icon className="h-4 w-4 text-purple-600 group-hover:text-purple-700" />
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{action.title}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to HOUSIE AI!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              I'm here to help you find services, get estimates, and answer questions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {session.session_title || 'AI Chat Session'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTime(session.last_message_at)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      Continue your conversation with HOUSIE AI
                    </p>
                    
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                        AI Assistant
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>🤖 Powered by HOUSIE AI</span>
          <Badge variant="outline" className="text-xs">
            Smart • Fast • Helpful
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantTab;
