import { useState } from "react";
import { Plus, Upload, FileText, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";
import { TemplateSelector } from "./TemplateSelector";
import { useObsidianNotes, type NoteTemplate } from "@/hooks/useObsidianNotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ObsidianDashboard = () => {
  const { notes, isLoading, createNote } = useObsidianNotes();
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate>('Custom');

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = async () => {
    try {
      const result = await createNote.mutateAsync({
        title: `New ${selectedTemplate} Note`,
        template_type: selectedTemplate,
        content: getTemplateContent(selectedTemplate),
        metadata: { template: selectedTemplate },
        tags: [selectedTemplate.toLowerCase()]
      });
      setSelectedNote(result.id);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const getTemplateContent = (template: NoteTemplate): string => {
    switch (template) {
      case 'CanonClaim':
        return `# Canon Claim

## Event Details
- **Date**: 
- **Location**: 
- **Participants**: 

## Claim Statement


## Evidence
- [ ] Photo evidence
- [ ] Witness verification
- [ ] GPS coordinates

## Verification Status
- **Tier**: Local/Regional/Global
- **Confidence**: /10

## Notes

---
*Generated with HOUSIE Verification System*`;

      case 'Agent':
        return `# AI Agent Profile

## Basic Info
- **Name**: 
- **Role**: 
- **Capabilities**: 

## Behavior Matrix
- **Personality**: 
- **Response Style**: 
- **Specializations**: 

## Training Data
- [ ] Core knowledge base
- [ ] Domain expertise
- [ ] Interaction patterns

## Performance Metrics


---
*Powered by HOUSIE Intelligence*`;

      case 'Broadcast':
        return `# Broadcast Event

## Broadcast Details
- **Timestamp**: ${new Date().toISOString()}
- **Range**: Local/Regional/Global
- **Event Type**: 

## Message


## Engagement Metrics
- **Reach**: 
- **Reactions**: 
- **Canon Score**: 

## Related Events


---
*Broadcast via HOUSIE Network*`;

      case 'CryptoAnalysis':
        return `# Crypto Analysis

## Asset Overview
- **Symbol**: 
- **Current Price**: 
- **Market Cap**: 

## Technical Analysis
- **Trend**: 
- **Support/Resistance**: 
- **Indicators**: 

## Fundamental Analysis
- **Project Health**: 
- **Team**: 
- **Adoption**: 

## Risk Assessment
- **Risk Level**: Low/Medium/High
- **Time Horizon**: 

## Action Plan


---
*Analysis by HOUSIE Financial Intelligence*`;

      case 'TitleTrack':
        return `# Prestige Title Progress

## Title Information
- **Title**: 
- **Tier**: 
- **Requirements**: 

## Progress Tracking
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Milestones Achieved


## Next Steps


## Evidence Collection
- [ ] Screenshots
- [ ] Verification data
- [ ] Community witness

---
*Tracked by HOUSIE Prestige System*`;

      default:
        return `# New Note

Start writing your note here...

## Tags
#custom

---
*Created with HOUSIE Note System*`;
    }
  };

  if (selectedNote) {
    const note = notes.find(n => n.id === selectedNote);
    if (!note) return null;
    
    return (
      <NoteEditor 
        note={note} 
        onClose={() => setSelectedNote(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="fintech-card-base">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="fintech-text-header">
                    Obsidian Vault
                  </CardTitle>
                  <p className="fintech-text-secondary">
                    Your knowledge base synced with HOUSIE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Files
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Sync Settings
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Create */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, content, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {isCreating ? (
            <div className="flex items-center gap-2">
              <TemplateSelector
                value={selectedTemplate}
                onChange={setSelectedTemplate}
              />
              <Button onClick={handleCreateNote} disabled={createNote.isPending}>
                Create Note
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          )}
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card className="fintech-card-base">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No notes match your search.' : 'Create your first note to get started.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Note
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => setSelectedNote(note.id)}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="fintech-card-secondary">
            <CardContent className="p-4">
              <div className="text-2xl font-bold fintech-text-header">{notes.length}</div>
              <p className="text-sm fintech-text-secondary">Total Notes</p>
            </CardContent>
          </Card>
          <Card className="fintech-card-secondary">
            <CardContent className="p-4">
              <div className="text-2xl font-bold fintech-text-header">
                {notes.filter(n => n.template_type === 'CanonClaim').length}
              </div>
              <p className="text-sm fintech-text-secondary">Canon Claims</p>
            </CardContent>
          </Card>
          <Card className="fintech-card-secondary">
            <CardContent className="p-4">
              <div className="text-2xl font-bold fintech-text-header">
                {new Set(notes.flatMap(n => n.tags)).size}
              </div>
              <p className="text-sm fintech-text-secondary">Unique Tags</p>
            </CardContent>
          </Card>
          <Card className="fintech-card-secondary">
            <CardContent className="p-4">
              <div className="text-2xl font-bold fintech-text-header">
                {notes.filter(n => n.last_synced_at).length}
              </div>
              <p className="text-sm fintech-text-secondary">Synced</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};