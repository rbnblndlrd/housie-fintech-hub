import { useState, useEffect } from "react";
import { ArrowLeft, Save, Eye, Edit3, Trash2, Share, Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useObsidianNotes, type ObsidianNote } from "@/hooks/useObsidianNotes";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TagInput } from "./TagInput";
import { AnnetteIntegration } from "./AnnetteIntegration";
import { toast } from "@/hooks/use-toast";

interface NoteEditorProps {
  note: ObsidianNote;
  onClose: () => void;
}

export const NoteEditor = ({ note, onClose }: NoteEditorProps) => {
  const { updateNote, deleteNote } = useObsidianNotes();
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const hasUnsavedChanges = 
      title !== note.title || 
      content !== note.content || 
      JSON.stringify(tags) !== JSON.stringify(note.tags);
    setHasChanges(hasUnsavedChanges);
  }, [title, content, tags, note]);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      await updateNote.mutateAsync({
        id: note.id,
        title,
        content,
        tags,
        last_synced_at: new Date().toISOString()
      });
      setHasChanges(false);
      toast({
        title: "Note saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteNote.mutateAsync(note.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleExport = () => {
    const markdown = `# ${title}\n\n${content}\n\n---\n\n**Tags:** ${tags.join(', ')}\n**Created:** ${new Date(note.created_at).toLocaleDateString()}\n**Updated:** ${new Date(note.updated_at).toLocaleDateString()}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Note exported",
      description: "Your note has been downloaded as a Markdown file."
    });
  };

  const handleInsertSummary = (summary: string) => {
    setContent(prev => prev + summary);
  };

  const getTemplateIcon = (template: string) => {
    switch (template) {
      case 'CanonClaim': return '🏆';
      case 'Agent': return '🤖';
      case 'Broadcast': return '📡';
      case 'CryptoAnalysis': return '📈';
      case 'TitleTrack': return '👑';
      default: return '📝';
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!hasChanges) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, tags]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Card className="fintech-card-base sticky top-0 z-10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-background/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vault
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTemplateIcon(note.template_type)}</span>
                <Badge variant="outline">{note.template_type}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Preview Toggle */}
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                <Switch
                  checked={isPreview}
                  onCheckedChange={setIsPreview}
                />
                <Eye className="h-4 w-4" />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                disabled // Placeholder for GitHub sync
              >
                <Github className="h-4 w-4 mr-2" />
                Sync
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : hasChanges ? 'Save' : 'Saved'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title & Tags */}
            <Card className="fintech-card-secondary">
              <CardContent className="p-6 space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="text-2xl font-bold border-none shadow-none p-0 fintech-text-header bg-transparent"
                />
                
                <TagInput
                  tags={tags}
                  onChange={setTags}
                  placeholder="Add tags..."
                />
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="fintech-card-base min-h-[600px]">
              <CardContent className="p-0">
                {isPreview ? (
                  <div className="p-6">
                    <MarkdownRenderer content={content} />
                  </div>
                ) : (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your note..."
                    className="min-h-[600px] border-none shadow-none resize-none font-mono text-sm bg-transparent"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <AnnetteIntegration note={note} onInsertSummary={handleInsertSummary} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="lg:col-span-3">
          <Card className="fintech-card-secondary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(note.updated_at).toLocaleDateString()}</span>
                  {note.last_synced_at && (
                    <span className="text-green-600">
                      Last synced: {new Date(note.last_synced_at).toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span>{content.length} characters</span>
                  <span>{content.split('\n').length} lines</span>
                  <span>{content.split(/\s+/).filter(word => word).length} words</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};