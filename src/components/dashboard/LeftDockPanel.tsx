
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnnetteBubbleChat } from '@/components/assistant/AnnetteBubbleChat';
import { cn } from '@/lib/utils';

interface LeftDockPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
}

export const LeftDockPanel: React.FC<LeftDockPanelProps> = ({
  isOpen,
  onToggle,
  activeTab
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Only show when Annette tab is active
  if (activeTab !== 'annette') {
    return null;
  }

  return (
    <>
      {/* Desktop Left Panel */}
      <div className={cn(
        "fixed left-0 top-20 bottom-0 z-40 transition-all duration-300 ease-in-out",
        "hidden lg:block",
        isOpen ? "w-80" : "w-0"
      )}>
        <div className={cn(
          "h-full bg-background/95 backdrop-blur-sm border-r border-border/20 shadow-lg",
          "transition-all duration-300",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
        )}>
          {/* Panel Header */}
          <div className="p-4 border-b border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Chat with Annette</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  💅 Start Conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Drawer */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="bg-background/95 backdrop-blur-sm border-t border-border/20 shadow-lg">
          {/* Drawer Header */}
          <div className="p-4 border-b border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Chat with Annette</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="p-4 max-h-80 overflow-y-auto">
            <Button
              onClick={() => setIsChatOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              💅 Start Conversation
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Button (when closed) */}
      {!isOpen && activeTab === 'annette' && (
        <Button
          onClick={onToggle}
          className={cn(
            "fixed z-40 transition-all duration-300",
            "lg:left-4 lg:top-32",
            "bottom-20 right-4 lg:bottom-auto lg:right-auto",
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
            "shadow-lg"
          )}
          size="sm"
        >
          <ChevronRight className="h-4 w-4 lg:hidden" />
          <MessageCircle className="h-4 w-4 hidden lg:block" />
        </Button>
      )}

      {/* Annette Chat Modal */}
      <AnnetteBubbleChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};
