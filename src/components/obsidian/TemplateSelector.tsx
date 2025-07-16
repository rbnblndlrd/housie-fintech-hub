import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type NoteTemplate } from "@/hooks/useObsidianNotes";

interface TemplateSelectorProps {
  value: NoteTemplate;
  onChange: (value: NoteTemplate) => void;
}

export const TemplateSelector = ({ value, onChange }: TemplateSelectorProps) => {
  const templates: { value: NoteTemplate; label: string; icon: string; description: string }[] = [
    {
      value: 'CanonClaim',
      label: 'Canon Claim',
      icon: '🏆',
      description: 'Document a significant event or achievement'
    },
    {
      value: 'Agent',
      label: 'AI Agent',
      icon: '🤖',
      description: 'Define AI agent behavior and capabilities'
    },
    {
      value: 'Broadcast',
      label: 'Broadcast Event',
      icon: '📡',
      description: 'Record a community broadcast or announcement'
    },
    {
      value: 'CryptoAnalysis',
      label: 'Crypto Analysis',
      icon: '📈',
      description: 'Analyze cryptocurrency trends and opportunities'
    },
    {
      value: 'TitleTrack',
      label: 'Title Track',
      icon: '👑',
      description: 'Track progress toward prestige titles'
    },
    {
      value: 'Custom',
      label: 'Custom Note',
      icon: '📝',
      description: 'Free-form note with no template'
    }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select template">
          {value && (
            <div className="flex items-center gap-2">
              <span>{templates.find(t => t.value === value)?.icon}</span>
              <span>{templates.find(t => t.value === value)?.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.value} value={template.value}>
            <div className="flex items-start gap-3 py-2">
              <span className="text-lg">{template.icon}</span>
              <div>
                <div className="font-medium">{template.label}</div>
                <div className="text-xs text-muted-foreground">
                  {template.description}
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};