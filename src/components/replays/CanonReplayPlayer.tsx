import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useReplayFragments, ReplayFragment } from '@/hooks/useReplayFragments';
import { formatDistanceToNow } from 'date-fns';

interface CanonReplayPlayerProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string;
}

export const CanonReplayPlayer: React.FC<CanonReplayPlayerProps> = ({
  eventId,
  isOpen,
  onClose,
  eventTitle
}) => {
  const { fragments, loading } = useReplayFragments(eventId);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const currentFragment = fragments[currentStep];

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying || !fragments.length) return;

    const timer = setTimeout(() => {
      if (currentStep < fragments.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false); // End of replay
      }
    }, 3000); // 3 seconds per fragment

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, fragments.length]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleNext = () => {
    if (currentStep < fragments.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getFragmentIcon = (type: ReplayFragment['type']) => {
    switch (type) {
      case 'quote': return '💭';
      case 'photo': return '📸';
      case 'stat': return '📊';
      case 'location': return '📍';
      case 'reaction': return '⚡';
      default: return '✨';
    }
  };

  const getFragmentTypeLabel = (type: ReplayFragment['type']) => {
    switch (type) {
      case 'quote': return 'Narration';
      case 'photo': return 'Visual';
      case 'stat': return 'Statistic';
      case 'location': return 'Location';
      case 'reaction': return 'Reaction';
      default: return 'Fragment';
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Loading replay...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!fragments.length) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>No Replay Available</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              This Canon event doesn't have a replay sequence yet.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎬 Canon Replay: {eventTitle}
            <Badge variant="outline">{fragments.length} scenes</Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Replay Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-br from-background to-muted/20 rounded-lg p-8">
          {currentFragment && (
            <div className="text-center max-w-2xl space-y-6">
              {/* Fragment Type Badge */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{getFragmentIcon(currentFragment.type)}</span>
                <Badge variant="secondary">
                  {getFragmentTypeLabel(currentFragment.type)}
                </Badge>
                <Badge variant="outline">
                  Step {currentStep + 1} of {fragments.length}
                </Badge>
              </div>

              {/* Fragment Image */}
              {currentFragment.image_url && (
                <div className="relative w-full max-w-md mx-auto">
                  <img 
                    src={currentFragment.image_url} 
                    alt="Replay scene"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Fragment Content */}
              {currentFragment.content && (
                <div className="space-y-4">
                  <blockquote className="text-lg font-medium leading-relaxed">
                    "{currentFragment.content}"
                  </blockquote>
                  {currentFragment.type === 'quote' && (
                    <p className="text-sm text-muted-foreground italic">
                      — Annette's Commentary
                    </p>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(currentFragment.timestamp))} ago
              </p>

              {/* Audio Preview (if available) */}
              {currentFragment.audio_url && audioEnabled && (
                <audio 
                  src={currentFragment.audio_url} 
                  autoPlay
                  onEnded={() => {
                    // Could auto-advance here
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Replay Controls */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={currentStep === fragments.length - 1 && isPlaying}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentStep === fragments.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex-1 mx-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ 
                  width: `${((currentStep + 1) / fragments.length) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{fragments.length}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};