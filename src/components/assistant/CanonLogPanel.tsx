import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database,
  Brain,
  X,
  Share2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRecentCanonEntries, type CanonLevel } from '@/utils/canonHelper';

interface CanonLogPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const CanonLogPanel: React.FC<CanonLogPanelProps> = ({
  isOpen,
  onClose,
  className
}) => {
  const canonEntries = getRecentCanonEntries();

  const getCanonIcon = (trust: CanonLevel) => {
    return trust === 'canon' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-orange-500" />
    );
  };

  const getCanonBadge = (trust: CanonLevel) => {
    return trust === 'canon' ? (
      <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-500/20">
        ✅ Canon
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-500/20">
        🌀 Non-Canon
      </Badge>
    );
  };

  const getSourceIcon = (source: string) => {
    return source === 'supabase' ? (
      <Database className="h-3 w-3 text-blue-500" />
    ) : (
      <Brain className="h-3 w-3 text-purple-500" />
    );
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      className
    )}>
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Canon Log Panel */}
      <Card className="relative w-full max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-md border-border/20 shadow-2xl">
        <CardHeader className="pb-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                  Canon Log 
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    Truth & Verification Center
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Every insight categorized, every source tracked
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[50vh] p-6">
            <div className="space-y-4">
              {canonEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group p-4 rounded-lg border border-border/20 bg-muted/20 hover:bg-muted/40 transition-all duration-200"
                >
                  {/* Entry Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getCanonIcon(entry.trust)}
                      <div>
                        <h3 className="font-medium text-foreground capitalize">
                          {entry.command.replace(/_/g, ' ')}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {entry.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            {getSourceIcon(entry.metadata.source)}
                            {entry.metadata.source}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((entry.metadata.confidence || 0) * 100)}% confidence
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getCanonBadge(entry.trust)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Annette Response */}
                  <div className="mb-3">
                    <p className="text-sm text-foreground italic">
                      "{entry.result}"
                    </p>
                  </div>

                  {/* Data Points */}
                  {entry.metadata.dataPoints && entry.metadata.dataPoints.length > 0 && (
                    <div className="border-t border-border/10 pt-3">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">
                        Source Data Points:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.metadata.dataPoints.map((point, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs py-0 px-2 h-5"
                          >
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {canonEntries.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Canon Entries Yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use the Revollver to trigger actions and build your Canon log
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Footer Stats */}
        <div className="border-t border-border/20 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {canonEntries.filter(e => e.trust === 'canon').length} Canon
              </span>
              <span className="flex items-center space-x-1">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                {canonEntries.filter(e => e.trust === 'non_canon').length} Non-Canon
              </span>
            </div>
            <span>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};