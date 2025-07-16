import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Radio, Users, Grab, GrabIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import ChatPanel from './ChatPanel';
import { EchoFeedPanel } from './EchoFeedPanel';
import { CrewThreadsPanel } from './CrewThreadsPanel';
import { toast } from 'sonner';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

interface AnnetteHaloProps {
  defaultTab?: 'messages' | 'ai' | 'voice';
  showMicIcon?: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const AnnetteHalo: React.FC<AnnetteHaloProps> = ({
  defaultTab = 'ai',
  showMicIcon = false
}) => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const { totalUnreadCount } = useChat();
  
  // Draggable state
  const [position, setPosition] = useState<Position>({ x: 24, y: window.innerHeight - 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  
  // Chat state
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'ai' | 'voice'>('ai'); // Always default to Annette
  const [activeSubPanel, setActiveSubPanel] = useState<'main' | 'echo' | 'threads'>('main');
  
  const haloRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  // User access levels
  const userTier = user?.user_metadata?.subscription_tier || 'free';
  const hasVoiceAccess = !!user && userTier !== 'free';
  const hasMessagesAccess = !!user;

  // Load saved position from localStorage
  useEffect(() => {
    const savedPos = localStorage.getItem('annette-halo-position');
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos);
        // Validate position is within viewport
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;
        setPosition({
          x: Math.max(24, Math.min(parsed.x, maxX)),
          y: Math.max(24, Math.min(parsed.y, maxY))
        });
      } catch (e) {
        console.warn('Failed to parse saved position');
      }
    }
  }, []);

  // Save position to localStorage
  const savePosition = useCallback((pos: Position) => {
    localStorage.setItem('annette-halo-position', JSON.stringify(pos));
  }, []);

  // Create chaos particle
  const createParticle = useCallback((x: number, y: number) => {
    const particle: Particle = {
      id: particleIdRef.current++,
      x: x + Math.random() * 20 - 10,
      y: y + Math.random() * 20 - 10,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 300,
      maxLife: 300
    };
    
    setParticles(prev => [...prev.slice(-15), particle]); // Keep max 15 particles
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 16,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.98
          }))
          .filter(particle => particle.life > 0)
      );
      
      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length]);

  // Mouse handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return; // Don't drag when chat is open
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = haloRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPos = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    // Constrain to viewport with margin
    const margin = 24;
    const maxX = window.innerWidth - 80 - margin;
    const maxY = window.innerHeight - 80 - margin;
    
    newPos.x = Math.max(margin, Math.min(newPos.x, maxX));
    newPos.y = Math.max(margin, Math.min(newPos.y, maxY));
    
    setPosition(newPos);
    
    // Create chaos trail particles while dragging
    if (Math.random() > 0.7) {
      createParticle(newPos.x + 40, newPos.y + 40);
    }
  }, [isDragging, dragOffset, createParticle]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }
  }, [isDragging, position, savePosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Add/remove layout class for dashboard reflow
  useEffect(() => {
    const mainPaneWrapper = document.querySelector('.main-pane-wrapper') || document.querySelector('.dashboard-container') || document.body;
    
    if (isOpen) {
      mainPaneWrapper.classList.add('annette-open');
    } else {
      mainPaneWrapper.classList.remove('annette-open');
    }

    return () => {
      mainPaneWrapper.classList.remove('annette-open');
    };
  }, [isOpen]);

  // Handle click to open chat
  const handleClick = () => {
    if (isDragging) return;
    
    setIsOpen(true);
    // Always default to Annette tab on first open each session
    setActiveTab('ai');
    
    // First-time special animation
    if (isFirstOpen) {
      setIsFirstOpen(false);
      // Create halo pulse effect
      for (let i = 0; i < 12; i++) {
        setTimeout(() => {
          createParticle(position.x + 40, position.y + 40);
        }, i * 50);
      }
    }
    
    // Show greeting
    const greetingLines = currentRole === 'provider' 
      ? ["Ready to optimize your route, sugar? I've got logistics and sass."]
      : ["Ask me anything. I've got data, sass, and an extremely organized brain."];
    
    toast("🧠 Annette", {
      description: greetingLines[0]
    });

    // Auto-focus after 1 second
    setTimeout(() => {
      const chatInput = document.querySelector('input[placeholder*="Ask"], textarea[placeholder*="Ask"]') as HTMLElement;
      if (chatInput) {
        chatInput.focus();
      }
    }, 1000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveSubPanel('main');
  };

  // Get current cursor style
  const getCursorStyle = () => {
    if (isOpen) return 'default';
    if (isDragging) return 'grabbing';
    return 'grab';
  };

  return (
    <>
      {/* Chaos Particles */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life / particle.maxLife,
              transform: `scale(${particle.life / particle.maxLife})`,
              boxShadow: '0 0 4px currentColor'
            }}
          />
        ))}
      </div>

      {/* Draggable Halo Widget */}
      <div
        ref={haloRef}
        className="fixed z-50"
        style={{
          left: position.x,
          top: position.y,
          cursor: getCursorStyle()
        }}
      >
        {!isOpen ? (
          // Circular Orb State
          <div
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            className={cn(
              "relative w-20 h-20 rounded-full shadow-2xl transition-all duration-300",
              "bg-gradient-to-br from-purple-500 to-blue-600 border-2 border-purple-400",
              "hover:scale-110 hover:shadow-purple-400/50",
              "animate-pulse",
              isDragging && "scale-105 rotate-12"
            )}
            title="Annette // AI Assistant — Drag me, click me, call me."
          >
            {/* Main Avatar - Always Annette */}
            <div className="absolute inset-2 rounded-full overflow-hidden">
              <img 
                src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
                alt="Annette AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Glow Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-blue-400/30 animate-pulse" />
            
            {/* Unread Badge - Only for human messages */}
            {totalUnreadCount > 0 && hasMessagesAccess && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold z-10"
              >
                {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
              </Badge>
            )}
            
            {/* Active Panel Indicator */}
            {activeSubPanel === 'echo' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Radio className="h-3 w-3 text-white" />
              </div>
            )}
            {activeSubPanel === 'threads' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ) : (
          // Expanded Chat Shell
          <div className={cn(
            "bg-slate-800 border-2 border-slate-600 shadow-2xl flex flex-col overflow-hidden",
            "annette-chat-shell h-[500px] transition-all duration-300 animate-scale-in",
            "rounded-3xl ring-2 ring-purple-400/20"
          )}>
            {/* Header */}
            <div className="bg-slate-700 border-b-2 border-slate-600 p-4 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/7e58a112-189a-4048-9103-cd1a291fa6a5.png" 
                  alt="Annette"
                  className="w-8 h-8 rounded-full"
                />
                <h3 className="font-semibold text-white">
                  {activeSubPanel === 'echo' ? '📡 Echo Feed' : 
                   activeSubPanel === 'threads' ? '👥 Crew Threads' :
                   activeTab === 'messages' ? '💬 Messages via Annette' :
                   '🧠 Annette AI'}
                </h3>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-slate-600 text-gray-200 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            {activeSubPanel === 'main' && (
              <div className="bg-slate-800 border-b-2 border-slate-600">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={cn(
                      "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                      activeTab === 'ai'
                        ? "text-purple-400 bg-slate-700"
                        : "text-gray-300 hover:text-white hover:bg-slate-700"
                    )}
                  >
                    🪪 Ask Annette
                    {activeTab === 'ai' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
                    )}
                  </button>

                  {hasMessagesAccess && (
                    <button
                      onClick={() => setActiveTab('messages')}
                      className={cn(
                        "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
                        activeTab === 'messages'
                          ? "text-blue-400 bg-slate-700"
                          : "text-gray-300 hover:text-white hover:bg-slate-700"
                      )}
                    >
                      💬 Messages
                      {totalUnreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2 h-4 px-1.5 text-xs">
                          {totalUnreadCount}
                        </Badge>
                      )}
                      {activeTab === 'messages' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {activeSubPanel === 'echo' ? (
                <EchoFeedPanel onBack={() => setActiveSubPanel('main')} />
              ) : activeSubPanel === 'threads' ? (
                <CrewThreadsPanel onBack={() => setActiveSubPanel('main')} />
              ) : (
                <ChatPanel 
                  activeTab={activeTab} 
                  activeSubPanel={activeSubPanel}
                  onSubPanelToggle={() => {
                    if (activeTab === 'ai') {
                      setActiveSubPanel(activeSubPanel === 'main' ? 'echo' : 'main');
                    } else if (activeTab === 'messages') {
                      setActiveSubPanel(activeSubPanel === 'main' ? 'threads' : 'main');
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};