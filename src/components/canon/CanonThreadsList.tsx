import React, { useState } from 'react';
import { Search, Plus, Star, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCanonThreads, CanonThread } from '@/hooks/useCanonThreads';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const CanonThreadsList: React.FC = () => {
  const { threads, searchThreads, updateThread, deleteThread, isLoading } = useCanonThreads();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const results = await searchThreads(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const toggleStar = async (thread: CanonThread) => {
    await updateThread(thread.id, { is_starred: !thread.is_starred });
  };

  const toggleVisibility = async (thread: CanonThread) => {
    await updateThread(thread.id, { is_public: !thread.is_public });
  };

  const handleDelete = async (threadId: string) => {
    if (window.confirm('Are you sure you want to delete this thread?')) {
      await deleteThread(threadId);
    }
  };

  const displayThreads = searchQuery ? searchResults : threads;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your Canon threads..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => navigate('/canon-threads/new')} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New Thread
        </Button>
      </div>

      {isLoading || isSearching ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading threads...
        </div>
      ) : displayThreads.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? 'No threads found' : 'No Canon threads yet. Create your first one!'}
        </div>
      ) : (
        <div className="space-y-3">
          {displayThreads.map((thread: any) => (
            <Card 
              key={thread.thread_id || thread.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/canon-threads/${thread.thread_id || thread.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground">{thread.title}</h3>
                      {thread.emoji_tag && (
                        <span className="text-lg">{thread.emoji_tag}</span>
                      )}
                      {thread.is_starred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {thread.root_message}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStar(thread)}
                    >
                      <Star className={`w-4 h-4 ${thread.is_starred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(thread)}
                    >
                      {thread.is_public ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(thread.thread_id || thread.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {thread.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                    {thread.entry_count && (
                      <span className="ml-2">• {thread.entry_count} entries</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};