import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Wand2, Save } from 'lucide-react';
import { useReplayFragments, ReplayFragment } from '@/hooks/useReplayFragments';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';

interface ReplayEditorProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string;
}

type NewFragment = Omit<ReplayFragment, 'id' | 'created_at' | 'updated_at'>;

export const ReplayEditor: React.FC<ReplayEditorProps> = ({
  eventId,
  isOpen,
  onClose,
  eventTitle
}) => {
  const { fragments, loading, createFragment, updateFragment, deleteFragment, generateReplay } = useReplayFragments(eventId);
  const [editingFragments, setEditingFragments] = useState<ReplayFragment[]>([]);
  const [newFragment, setNewFragment] = useState<Partial<NewFragment>>({
    type: 'quote',
    step_order: 1
  });
  const { toast } = useToast();

  // Initialize editing fragments when fragments load
  React.useEffect(() => {
    if (fragments.length > 0) {
      setEditingFragments([...fragments]);
    }
  }, [fragments]);

  const handleAddFragment = () => {
    if (!newFragment.content && !newFragment.image_url) {
      toast({
        title: "Content Required",
        description: "Please add content or an image URL",
        variant: "destructive"
      });
      return;
    }

    const fragmentToAdd: NewFragment = {
      event_id: eventId,
      timestamp: new Date().toISOString(),
      type: newFragment.type as ReplayFragment['type'],
      content: newFragment.content,
      image_url: newFragment.image_url,
      audio_url: newFragment.audio_url,
      step_order: editingFragments.length + 1
    };

    setEditingFragments(prev => [...prev, { ...fragmentToAdd, id: `temp-${Date.now()}`, created_at: '', updated_at: '' }]);
    setNewFragment({
      type: 'quote',
      step_order: editingFragments.length + 2
    });
  };

  const handleRemoveFragment = (index: number) => {
    setEditingFragments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFragmentChange = (index: number, field: keyof ReplayFragment, value: string) => {
    setEditingFragments(prev => 
      prev.map((fragment, i) => 
        i === index ? { ...fragment, [field]: value } : fragment
      )
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(editingFragments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update step_order for all fragments
    const reorderedFragments = items.map((item, index) => ({
      ...item,
      step_order: index + 1
    }));

    setEditingFragments(reorderedFragments);
  };

  const handleSave = async () => {
    try {
      // Delete existing fragments and create new ones
      // This is a simple approach - in production you'd want more sophisticated sync
      for (const existing of fragments) {
        await deleteFragment(existing.id);
      }

      for (const fragment of editingFragments) {
        if (!fragment.id.startsWith('temp-')) continue;
        
        await createFragment({
          event_id: eventId,
          timestamp: fragment.timestamp,
          type: fragment.type,
          content: fragment.content,
          image_url: fragment.image_url,
          audio_url: fragment.audio_url,
          step_order: fragment.step_order
        });
      }

      toast({
        title: "Replay Saved",
        description: "The replay sequence has been updated successfully"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the replay sequence",
        variant: "destructive"
      });
    }
  };

  const handleAutoGenerate = async () => {
    try {
      await generateReplay(eventId);
      toast({
        title: "Replay Generated",
        description: "An automatic replay sequence has been created"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to auto-generate replay",
        variant: "destructive"
      });
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>🎬 Edit Replay: {eventTitle}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleAutoGenerate}>
                <Wand2 className="w-4 h-4 mr-2" />
                Auto-Generate
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Replay
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          {/* Fragment List */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="font-medium mb-4">Replay Sequence</h3>
            
            {editingFragments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No fragments yet. Add some below or use auto-generate.</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fragments">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {editingFragments.map((fragment, index) => (
                        <Draggable key={fragment.id} draggableId={fragment.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="relative"
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-lg">{getFragmentIcon(fragment.type)}</span>
                                    <Badge variant="outline">Step {fragment.step_order}</Badge>
                                    <Badge variant="secondary">{fragment.type}</Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFragment(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <Textarea
                                  placeholder="Fragment content..."
                                  value={fragment.content || ''}
                                  onChange={(e) => handleFragmentChange(index, 'content', e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Image URL (optional)"
                                    value={fragment.image_url || ''}
                                    onChange={(e) => handleFragmentChange(index, 'image_url', e.target.value)}
                                  />
                                  <Input
                                    placeholder="Audio URL (optional)"
                                    value={fragment.audio_url || ''}
                                    onChange={(e) => handleFragmentChange(index, 'audio_url', e.target.value)}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Add Fragment Panel */}
          <div className="w-80 border-l pl-4">
            <h3 className="font-medium mb-4">Add New Fragment</h3>
            
            <div className="space-y-4">
              <Select
                value={newFragment.type}
                onValueChange={(value: ReplayFragment['type']) => 
                  setNewFragment(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quote">💭 Quote/Narration</SelectItem>
                  <SelectItem value="photo">📸 Photo/Visual</SelectItem>
                  <SelectItem value="stat">📊 Statistic</SelectItem>
                  <SelectItem value="location">📍 Location</SelectItem>
                  <SelectItem value="reaction">⚡ Reaction</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Fragment content or description..."
                value={newFragment.content || ''}
                onChange={(e) => setNewFragment(prev => ({ ...prev, content: e.target.value }))}
              />

              <Input
                placeholder="Image URL (optional)"
                value={newFragment.image_url || ''}
                onChange={(e) => setNewFragment(prev => ({ ...prev, image_url: e.target.value }))}
              />

              <Input
                placeholder="Audio URL (optional)"
                value={newFragment.audio_url || ''}
                onChange={(e) => setNewFragment(prev => ({ ...prev, audio_url: e.target.value }))}
              />

              <Button onClick={handleAddFragment} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Fragment
              </Button>
            </div>

            {/* Preview */}
            {newFragment.content && (
              <div className="mt-6 p-3 bg-muted/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="text-sm">
                  <Badge variant="outline" className="mb-2">
                    {getFragmentIcon(newFragment.type as ReplayFragment['type'])} {newFragment.type}
                  </Badge>
                  <p>"{newFragment.content}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};