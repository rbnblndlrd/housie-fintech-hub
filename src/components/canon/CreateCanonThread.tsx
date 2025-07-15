import React, { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCanonThreads } from '@/hooks/useCanonThreads';

const commonTags = ['prestige', 'crew', 'broadcast', 'stamp', 'job', 'rebooking', 'insight', 'network'];
const emojiOptions = ['📍', '📡', '🔁', '⭐', '🎯', '🏆', '🧠', '💡', '🔮', '🎭'];

export const CreateCanonThread: React.FC = () => {
  const navigate = useNavigate();
  const { createThread } = useCanonThreads();
  const [title, setTitle] = useState('');
  const [rootMessage, setRootMessage] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !rootMessage.trim()) return;

    setIsCreating(true);
    try {
      const threadId = await createThread(
        title.trim(),
        rootMessage.trim(),
        selectedTags,
        isPublic
      );

      if (threadId) {
        // Update with emoji if selected
        if (selectedEmoji) {
          // Note: We would need to add updateThread call here
        }
        navigate(`/canon-threads/${threadId}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/canon-threads')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Threads
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Canon Thread</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Thread Title</Label>
            <Input
              id="title"
              placeholder="e.g., 'Roseanne Rebooking Analysis'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Root Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Initial Message</Label>
            <Textarea
              id="message"
              placeholder="What would you like to discuss or analyze?"
              value={rootMessage}
              onChange={(e) => setRootMessage(e.target.value)}
              rows={4}
            />
          </div>

          {/* Emoji Tag */}
          <div className="space-y-2">
            <Label>Thread Emoji (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((emoji) => (
                <Button
                  key={emoji}
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEmoji(selectedEmoji === emoji ? '' : emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
            
            {/* Custom Tag Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
              />
              <Button onClick={handleAddCustomTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X 
                      className="w-3 h-3 ml-1" 
                      onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">
              Make this thread public (others can view if anonymized)
            </Label>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || !rootMessage.trim() || isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating Thread...' : 'Create Canon Thread'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};