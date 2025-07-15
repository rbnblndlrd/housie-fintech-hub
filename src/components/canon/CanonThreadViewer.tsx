import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Database, Mic, Settings, Star, Eye, EyeOff, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCanonThreads, useCanonThreadEntries } from '@/hooks/useCanonThreads';
import { formatDistanceToNow } from 'date-fns';

const getSourceIcon = (sourceType: string) => {
  switch (sourceType) {
    case 'voice_line': return <Mic className="w-4 h-4" />;
    case 'data_pull': return <Database className="w-4 h-4" />;
    case 'system': return <Settings className="w-4 h-4" />;
    default: return <MessageSquare className="w-4 h-4" />;
  }
};

const getCanonLevelColor = (canonLevel: string) => {
  switch (canonLevel) {
    case 'canon': return 'bg-green-100 text-green-800';
    case 'inferred': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const CanonThreadViewer: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { threads, updateThread } = useCanonThreads();
  const { entries, addEntry, isLoading } = useCanonThreadEntries(threadId || '');
  const [newMessage, setNewMessage] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  const thread = threads.find(t => t.id === threadId);

  const handleAddEntry = async () => {
    if (!newMessage.trim() || !threadId) return;

    setIsAddingEntry(true);
    try {
      await addEntry(
        `user-${Date.now()}`,
        newMessage,
        'user_prompt',
        'non-canon'
      );
      setNewMessage('');
    } finally {
      setIsAddingEntry(false);
    }
  };

  const toggleStar = async () => {
    if (thread) {
      await updateThread(thread.id, { is_starred: !thread.is_starred });
    }
  };

  const toggleVisibility = async () => {
    if (thread) {
      await updateThread(thread.id, { is_public: !thread.is_public });
    }
  };

  if (!thread) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Thread not found</p>
        <Button onClick={() => navigate('/canon-threads')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Threads
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/canon-threads')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Threads
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={toggleStar}>
            <Star className={`w-4 h-4 ${thread.is_starred ? 'text-yellow-500 fill-current' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleVisibility}>
            {thread.is_public ? (
              <Eye className="w-4 h-4 text-green-500" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Thread Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold">{thread.title}</h1>
                {thread.emoji_tag && (
                  <span className="text-2xl">{thread.emoji_tag}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {thread.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground">
                Created {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Thread Entries */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading thread entries...
          </div>
        ) : (
          entries.map((entry, index) => (
            <Card key={entry.id} className={`${entry.source_type === 'user_prompt' ? 'ml-0' : 'mr-0'}`}>
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${entry.source_type === 'user_prompt' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    {getSourceIcon(entry.source_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={getCanonLevelColor(entry.canon_level)}>
                        {entry.canon_level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{entry.message}</p>
                    {entry.linked_event_id && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Linked to event: {entry.linked_event_id.slice(0, 8)}...
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add New Entry */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Add a new entry to this thread..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddEntry}
                disabled={!newMessage.trim() || isAddingEntry}
              >
                {isAddingEntry ? 'Adding...' : 'Add Entry'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};