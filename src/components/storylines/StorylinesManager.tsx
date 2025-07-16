import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StorylineCard } from './StorylineCard';
import { CanonicalChainViewer } from './CanonicalChainViewer';
import { useStorylines } from '@/hooks/useStorylines';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BookOpen, Scroll } from 'lucide-react';

export const StorylinesManager: React.FC = () => {
  const { 
    storylines, 
    canonicalChain, 
    loading, 
    error,
    getActiveStorylines,
    getCompletedStorylines
  } = useStorylines();

  const activeStorylines = getActiveStorylines();
  const completedStorylines = getCompletedStorylines();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">📜 Stamp Storylines</h2>
        <p className="text-muted-foreground">
          "Prestige is power, love. But a story? That's what makes it stick." — Annette
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Active ({activeStorylines.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            Completed ({completedStorylines.length})
          </TabsTrigger>
          <TabsTrigger value="chain" className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            📜 Canonical Chain
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeStorylines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active storylines yet.</p>
              <p className="text-sm">Earn stamps to begin your first storyline!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeStorylines.map((storyline) => (
                <StorylineCard key={storyline.id} storyline={storyline} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedStorylines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Scroll className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed storylines yet.</p>
              <p className="text-sm">Keep earning stamps to complete your first storyline!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedStorylines.map((storyline) => (
                <StorylineCard key={storyline.id} storyline={storyline} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chain" className="space-y-4">
          {canonicalChain ? (
            <CanonicalChainViewer chain={canonicalChain} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Scroll className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No Canonical Chain established yet.</p>
              <p className="text-sm">Earn your first stamp to begin your chain!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};