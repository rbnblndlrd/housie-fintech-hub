import { formatDistanceToNow } from "date-fns";
import { FileText, Tag, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ObsidianNote } from "@/hooks/useObsidianNotes";

interface NoteCardProps {
  note: ObsidianNote;
  onClick: () => void;
}

export const NoteCard = ({ note, onClick }: NoteCardProps) => {
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

  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'CanonClaim': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'Agent': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'Broadcast': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'CryptoAnalysis': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'TitleTrack': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  // Extract preview from content (first few lines without markdown)
  const getPreview = (content: string) => {
    const lines = content.split('\n').filter(line => 
      line.trim() && 
      !line.startsWith('#') && 
      !line.startsWith('*') && 
      !line.startsWith('-') &&
      !line.includes('---')
    );
    return lines.slice(0, 3).join(' ').substring(0, 150) + (lines.join(' ').length > 150 ? '...' : '');
  };

  return (
    <Card 
      className="fintech-card-base hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTemplateIcon(note.template_type)}</span>
            <Badge className={getTemplateColor(note.template_type)}>
              {note.template_type}
            </Badge>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 fintech-text-header line-clamp-2">
          {note.title}
        </h3>

        {/* Preview */}
        <p className="text-sm fintech-text-secondary mb-4 line-clamp-3">
          {getPreview(note.content)}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
            </span>
          </div>
          
          {note.last_synced_at && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Synced</span>
            </div>
          )}
        </div>

        {/* File path indicator */}
        {note.file_path && (
          <div className="mt-2 text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
            <FileText className="h-3 w-3 inline mr-1" />
            {note.file_path}
          </div>
        )}
      </CardContent>
    </Card>
  );
};