import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CanonicalChain } from '@/hooks/useStorylines';
import { useStorylines } from '@/hooks/useStorylines';
import { useStamps } from '@/hooks/useStamps';
import { Edit2, Eye, EyeOff, Share2, MessageSquare, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CanonicalChainViewerProps {
  chain: CanonicalChain;
}

export const CanonicalChainViewer: React.FC<CanonicalChainViewerProps> = ({ chain }) => {
  const { stamps } = useStamps();
  const { updateChainTitle, toggleChainPublic, addAnnotation } = useStorylines();
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(chain.title);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [annotationText, setAnnotationText] = useState('');

  const handleTitleUpdate = async () => {
    if (newTitle.trim() === chain.title) {
      setEditingTitle(false);
      return;
    }

    const success = await updateChainTitle(newTitle.trim());
    if (success) {
      toast.success('Chain title updated');
      setEditingTitle(false);
    } else {
      toast.error('Failed to update title');
    }
  };

  const handleTogglePublic = async () => {
    const success = await toggleChainPublic();
    if (success) {
      toast.success(chain.is_public ? 'Chain made private' : 'Chain made public');
    } else {
      toast.error('Failed to update visibility');
    }
  };

  const handleAddAnnotation = async () => {
    if (!selectedStamp || !annotationText.trim()) return;

    const success = await addAnnotation(selectedStamp, annotationText.trim());
    if (success) {
      toast.success('Annotation added');
      setSelectedStamp(null);
      setAnnotationText('');
    } else {
      toast.error('Failed to add annotation');
    }
  };

  const getStampById = (stampId: string) => {
    return stamps.find(userStamp => userStamp.stampId === stampId);
  };

  const getAnnotationForStamp = (stampId: string) => {
    return chain.annotations?.find(a => a.stamp_id === stampId)?.note;
  };

  return (
    <div className="space-y-6">
      {/* Chain Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              {editingTitle ? (
                <div className="flex gap-2">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="font-semibold text-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleUpdate();
                      if (e.key === 'Escape') {
                        setEditingTitle(false);
                        setNewTitle(chain.title);
                      }
                    }}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleTitleUpdate}>Save</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">📜 {chain.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTitle(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <p className="text-muted-foreground">{chain.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {chain.prestige_score} Prestige Points
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {chain.chain_sequence?.length || 0} Stamps
                </div>
                {chain.last_stamp_added_at && (
                  <div>
                    Last updated {format(new Date(chain.last_stamp_added_at), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePublic}
                className="flex items-center gap-2"
              >
                {chain.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {chain.is_public ? 'Public' : 'Private'}
              </Button>
              
              {chain.is_public && (
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chain Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🔗</span>
            Canonical Chain Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chain.chain_sequence && chain.chain_sequence.length > 0 ? (
            <div className="space-y-4">
              {chain.chain_sequence.map((stampId, index) => {
                const userStamp = getStampById(stampId);
                const annotation = getAnnotationForStamp(stampId);
                
                if (!userStamp || !userStamp.stamp) return null;

                return (
                  <div
                    key={`${stampId}-${index}`}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                  >
                    {/* Chain connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      {index < chain.chain_sequence.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2" />
                      )}
                    </div>

                    {/* Stamp content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{userStamp.stamp.icon}</span>
                          <h4 className="font-semibold">{userStamp.stamp.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            ✅ Canonical
                          </Badge>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStamp(stampId);
                                setAnnotationText(annotation || '');
                              }}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Note to {userStamp.stamp.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                value={annotationText}
                                onChange={(e) => setAnnotationText(e.target.value)}
                                placeholder="Add your personal note about this stamp..."
                                rows={4}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedStamp(null);
                                    setAnnotationText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleAddAnnotation}>
                                  Save Note
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {userStamp.stamp.flavorText}
                      </p>

                      {annotation && (
                        <div className="p-3 bg-secondary/20 rounded border-l-4 border-primary">
                          <p className="text-sm italic">"{annotation}"</p>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Earned {format(new Date(userStamp.earnedAt), 'PPP')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-4xl mb-4 block">🔗</span>
              <p>Your chain will appear here as you earn verified stamps.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};