import React, { useState } from 'react';
import { Bot, Plus, Clock, Zap, Home, Calculator, MessageSquare, Download, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAIChat } from '@/hooks/useAIChat';
import { useWebLLM } from '@/hooks/useWebLLM';
import { usePopArt } from '@/contexts/PopArtContext';
import AIConversation from './AIConversation';

const AIAssistantTab = () => {
  const { sessions, activeSession, loadMessages, createSession } = useAIChat();
  const { 
    isLoading: webLLMLoading, 
    isDownloading, 
    downloadProgress, 
    isReady: webLLMReady, 
    error: webLLMError,
    debugInfo,
    sendMessage: sendWebLLMMessage,
    resetConversation,
    initializeEngine
  } = useWebLLM();
  const { activatePopArt } = usePopArt();
  const [showConversation, setShowConversation] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const handleSessionClick = (sessionId: string) => {
    loadMessages(sessionId);
    setCurrentSessionId(sessionId);
    setShowConversation(true);
  };

  const handleNewChat = async () => {
    const newSession = await createSession('WebLLM Chat Session');
    if (newSession) {
      resetConversation();
      handleSessionClick(newSession.id);
    }
  };

  const handleBackToList = () => {
    setShowConversation(false);
    setCurrentSessionId(null);
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

  if (showConversation && currentSessionId) {
    return (
      <AIConversation
        sessionId={currentSessionId}
        onBack={handleBackToList}
        webLLMSendMessage={sendWebLLMMessage}
        webLLMLoading={webLLMLoading}
        webLLMReady={webLLMReady}
        onPopArtTrigger={activatePopArt}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* AI Header with Enhanced Status */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">HOUSIE AI Assistant</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {debugInfo || (isDownloading ? 'Downloading AI model...' : 
                 webLLMReady ? 'Local AI ready' : 
                 webLLMError ? 'Fallback mode' : 'Initializing AI...')}
              </p>
              <Badge variant="outline" className={`text-xs ${
                webLLMReady ? 'bg-green-50 text-green-700 border-green-200' :
                webLLMError ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {webLLMReady ? 'WebLLM Active' : webLLMError ? 'Fallback Mode' : 'Loading'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Download Progress */}
        {isDownloading && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Downloading AI model: {downloadProgress}%
              </span>
            </div>
            <Progress value={downloadProgress} className="h-2" />
          </div>
        )}

        {/* Debug Info Alert */}
        {debugInfo && !isDownloading && (
          <Alert className="mb-3">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {debugInfo}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {webLLMError && (
          <Alert className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {webLLMError} The AI will still work with intelligent fallback responses.
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleNewChat}
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          {webLLMReady ? 'Start Local AI Chat' : 'Start New Chat'}
        </Button>
      </div>

      {/* Quick Actions with Test Commands */}
      {sessions.length === 0 && (
        <div className="p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={handleNewChat}
                disabled={isDownloading}
                className="p-3 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 mb-1">
                  <action.icon className="h-4 w-4 text-purple-600 group-hover:text-purple-700" />
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{action.title}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
              </button>
            ))}
          </div>
          
          {/* Test Commands Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🧪 Test Commands</h5>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <div>• Type <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">test webllm</code> to verify local AI</div>
              <div>• Type <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">webllm status</code> for detailed status</div>
              <div>• Type <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">show me colors</code> for surprise! 🎨</div>
            </div>
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
              {webLLMReady ? 'Local AI powered by WebLLM' : 'AI assistant for home services'}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 italic">
              💡 Try "test webllm" to verify local AI is working! 🤖
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
                        {webLLMReady ? 'Local AI' : 'AI Assistant'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Footer with Status */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>🤖 {webLLMReady ? 'WebLLM Active' : 'Fallback Mode'}</span>
          <Badge variant="outline" className="text-xs">
            {webLLMReady ? 'Local • Private • Fast' : 'Intelligent • Context-Aware'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantTab;
