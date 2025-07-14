import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  X, 
  Filter, 
  Radio, 
  MapPin, 
  Calendar,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CanonEcho, getUserCanonEchoes, generateEchoTranscript } from '@/utils/canonEchoEngine';

interface CanonEchoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const CanonEchoPanel: React.FC<CanonEchoPanelProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const [echoes, setEchoes] = useState<CanonEcho[]>([]);
  const [loading, setLoading] = useState(false);
  const [canonFilter, setCanonFilter] = useState<'all' | 'canon' | 'non-canon'>('all');
  const [selectedEcho, setSelectedEcho] = useState<CanonEcho | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadEchoes();
    }
  }, [isOpen, canonFilter]);

  const loadEchoes = async () => {
    setLoading(true);
    try {
      const canonOnly = canonFilter === 'canon' ? true : canonFilter === 'non-canon' ? false : undefined;
      const data = await getUserCanonEchoes(canonOnly, 20);
      setEchoes(data);
    } catch (error) {
      console.error('Error loading Canon Echoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEchoLocationIcon = (location: string) => {
    switch (location) {
      case 'profile': return <Eye className="w-3 h-3" />;
      case 'city-board': return <Radio className="w-3 h-3" />;
      case 'map': return <MapPin className="w-3 h-3" />;
      default: return <EyeOff className="w-3 h-3" />;
    }
  };

  const getEchoLocationColor = (location: string) => {
    switch (location) {
      case 'profile': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'city-board': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'map': return 'bg-green-500/10 text-green-700 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'job': return '💼';
      case 'stamp': return '🏆';
      case 'prestige': return '👑';
      case 'map': return '🗺️';
      default: return '💬';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed bottom-6 left-6 z-50 w-96 h-[600px] transition-all duration-300",
      className
    )}>
      <Card className="h-full bg-card/95 backdrop-blur-md border-border/20 shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-green-100 to-blue-100">
                <AvatarFallback>
                  <Radio className="w-4 h-4 text-green-600" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium text-foreground flex items-center">
                  Canon Echoes
                  <Sparkles className="h-3 w-3 ml-1 text-yellow-500" />
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Your broadcast history & achievements
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-1 mt-3">
            {[
              { key: 'all', label: 'All', count: echoes.length },
              { key: 'canon', label: 'Canon', count: echoes.filter(e => e.canonical).length },
              { key: 'non-canon', label: 'Non-Canon', count: echoes.filter(e => !e.canonical).length }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={canonFilter === filter.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setCanonFilter(filter.key as any)}
                className="text-xs h-7"
              >
                <Filter className="w-3 h-3 mr-1" />
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </CardHeader>

        {/* Echo List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                Loading echoes...
              </div>
            ) : echoes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No echoes found</p>
                <p className="text-xs mt-1">
                  Trigger some Revolver actions to create echoes!
                </p>
              </div>
            ) : (
              echoes.map((echo) => (
                <Card 
                  key={echo.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedEcho?.id === echo.id && "ring-2 ring-primary/50"
                  )}
                  onClick={() => setSelectedEcho(selectedEcho?.id === echo.id ? null : echo)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      {/* Source Icon */}
                      <div className="text-lg">
                        {getSourceIcon(echo.source)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center space-x-2 mb-2">
                          {/* Canon Status */}
                          {echo.canonical ? (
                            <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20 text-xs">
                              <CheckCircle className="w-3 h-3" />
                              <span>Canon</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-700 border border-orange-500/20 text-xs">
                              <AlertCircle className="w-3 h-3" />
                              <span>Non-Canon</span>
                            </div>
                          )}
                          
                          {/* Location Badge */}
                          <div className={cn(
                            "inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-xs",
                            getEchoLocationColor(echo.location)
                          )}>
                            {getEchoLocationIcon(echo.location)}
                            <span className="capitalize">{echo.location.replace('-', ' ')}</span>
                          </div>
                        </div>
                        
                        {/* Message */}
                        <p className="text-sm text-foreground mb-2 line-clamp-2">
                          {echo.message}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(echo.created_at!).toLocaleDateString([], { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          {/* Engagement */}
                          {echo.engagement_count && echo.engagement_count > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {echo.engagement_count} reactions
                            </Badge>
                          )}
                        </div>
                        
                        {/* Tags */}
                        {echo.tags && echo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {echo.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {echo.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{echo.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {selectedEcho?.id === echo.id && (
                      <div className="mt-3 pt-3 border-t border-border/20">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-xs font-medium mb-2">Echo Transcript:</p>
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                            {generateEchoTranscript(echo)}
                          </pre>
                        </div>
                        
                        {/* Technical Details */}
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Confidence:</span>
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {'█'.repeat(Math.round(echo.canon_confidence * 5))}
                                {'░'.repeat(5 - Math.round(echo.canon_confidence * 5))}
                              </div>
                              <span>{Math.round(echo.canon_confidence * 100)}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Generated by:</span>
                            <p className="capitalize">{echo.generated_by}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <CardContent className="pt-3 border-t border-border/20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Canon Echoes track your verified achievements and broadcast history
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};