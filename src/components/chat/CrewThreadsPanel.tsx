import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Clock, MessageSquare, Hash, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useCanonThreads, CanonThread } from '@/hooks/useCanonThreads';

interface CrewThreadsPanelProps {
  onBack: () => void;
}

export const CrewThreadsPanel: React.FC<CrewThreadsPanelProps> = ({ onBack }) => {
  const { threads, isLoading } = useCanonThreads();
  const [activeThreads, setActiveThreads] = useState<CanonThread[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mobile swipe support
  useEffect(() => {
    let startX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      // Swipe right to go back (threshold: 50px)
      if (diffX < -50) {
        onBack();
      }
    };
    
    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener('touchstart', handleTouchStart);
      panel.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        panel.removeEventListener('touchstart', handleTouchStart);
        panel.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [onBack]);

  useEffect(() => {
    // Filter for recently active threads (created or updated in last 7 days)
    const recentCutoff = new Date();
    recentCutoff.setDate(recentCutoff.getDate() - 7);
    
    const filtered = threads.filter(thread => {
      const updatedAt = new Date(thread.updated_at);
      return updatedAt > recentCutoff;
    });
    
    setActiveThreads(filtered);
  }, [threads]);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const getThreadTypeIcon = (thread: CanonThread) => {
    if (thread.tags.includes('crew')) return '👥';
    if (thread.tags.includes('collective')) return '🤝';
    if (thread.tags.includes('opportunity')) return '💼';
    if (thread.tags.includes('cluster')) return '🗂️';
    return '💬';
  };

  const getThreadTypeLabel = (thread: CanonThread) => {
    if (thread.tags.includes('crew')) return 'Crew';
    if (thread.tags.includes('collective')) return 'Collective';
    if (thread.tags.includes('opportunity')) return 'Job Crew';
    if (thread.tags.includes('cluster')) return 'Customer Group';
    return 'Thread';
  };

  return (
    <div ref={panelRef} className="h-full flex flex-col bg-gray-900 text-white animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-slate-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0 hover:bg-slate-600 text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-white">Crew Threads</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            👥 Active
          </Badge>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-11">
          Group chats & crew coordination
        </p>
      </div>

      {/* Threads Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <Users className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>Loading crew threads...</p>
            </div>
          ) : activeThreads.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No active Crews or Collectives yet!</p>
              <p className="text-xs mt-1">Join a crew job or start a collective</p>
              <div className="mt-4 p-3 bg-slate-800 rounded-lg text-left">
                <p className="text-xs text-blue-400 font-medium mb-1">
                  💡 Annette says:
                </p>
                <p className="text-xs text-gray-300">
                  "Flying solo, are we? Nothing wrong with that, but crews can tackle bigger jobs and share the glory. Time to network, sugar!"
                </p>
              </div>
            </div>
          ) : (
            activeThreads.map((thread) => (
              <div 
                key={thread.id}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getThreadTypeIcon(thread)}</span>
                    <div>
                      <h4 className="text-sm font-medium text-white truncate">
                        {thread.title}
                      </h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {getThreadTypeLabel(thread)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {thread.is_starred && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}
                    <div className="text-xs text-gray-400 text-right">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTimeAgo(thread.updated_at)}
                    </div>
                  </div>
                </div>

                {/* Message Preview */}
                <p className="text-xs text-gray-300 mb-2" style={{ 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden' 
                }}>
                  {thread.root_message}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {thread.emoji_tag && (
                      <span className="text-sm">{thread.emoji_tag}</span>
                    )}
                    {thread.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Hash className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {thread.is_public && (
                      <Badge variant="outline" className="text-xs">
                        Public
                      </Badge>
                    )}
                    <MessageSquare className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-slate-800/50">
        <p className="text-xs text-gray-400 text-center">
          Coordinate with crews and collectives for bigger opportunities
        </p>
      </div>
    </div>
  );
};