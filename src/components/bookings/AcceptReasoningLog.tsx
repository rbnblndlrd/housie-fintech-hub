import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Save, Clock, DollarSign, MapPin, Star, CheckCircle } from 'lucide-react';

interface AcceptReasoningLogProps {
  onSaveReasoning?: (reason: string, tags: string[]) => void;
  suggestedReasons?: string[];
}

const AcceptReasoningLog: React.FC<AcceptReasoningLogProps> = ({
  onSaveReasoning,
  suggestedReasons = [
    "Close to current location",
    "Good client rating",
    "Quick in/out job",
    "High hourly rate",
    "Preferred time slot",
    "Returning client"
  ]
}) => {
  const [reasoning, setReasoning] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (onSaveReasoning) {
      onSaveReasoning(reasoning, selectedTags);
    }
    // Show success feedback
    setIsExpanded(false);
  };

  const getTagIcon = (tag: string) => {
    if (tag.includes('location')) return <MapPin className="h-3 w-3" />;
    if (tag.includes('rating')) return <Star className="h-3 w-3" />;
    if (tag.includes('time') || tag.includes('slot')) return <Clock className="h-3 w-3" />;
    if (tag.includes('rate') || tag.includes('hourly')) return <DollarSign className="h-3 w-3" />;
    if (tag.includes('client')) return <CheckCircle className="h-3 w-3" />;
    return null;
  };

  if (!isExpanded) {
    return (
      <Card className="fintech-card border-gray-200">
        <CardContent className="p-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center gap-2 text-sm"
          >
            <Brain className="h-4 w-4" />
            Log acceptance reasoning (optional)
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-gray-600" />
          Why I'm accepting this job
        </CardTitle>
        <p className="text-sm text-gray-500">
          Track your decision-making for performance insights
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Reason Tags */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Quick reasons:</div>
          <div className="flex flex-wrap gap-2">
            {suggestedReasons.map((reason, index) => (
              <Badge
                key={index}
                variant={selectedTags.includes(reason) ? "default" : "outline"}
                className={`cursor-pointer transition-colors flex items-center gap-1 ${
                  selectedTags.includes(reason)
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleTagToggle(reason)}
              >
                {getTagIcon(reason)}
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        {/* Custom Reasoning */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Additional notes:</div>
          <Textarea
            placeholder="e.g., Perfect timing between my other jobs, client specifically requested me..."
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            className="flex-1 flex items-center gap-2"
            disabled={selectedTags.length === 0 && !reasoning.trim()}
          >
            <Save className="h-4 w-4" />
            Save Reasoning
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(false)}
            className="px-3"
          >
            Skip
          </Button>
        </div>

        {/* Info Note */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          💡 Annette will use this data to help optimize your job selection over time
        </div>
      </CardContent>
    </Card>
  );
};

export default AcceptReasoningLog;