import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Palette, AlertTriangle } from 'lucide-react';

interface TattooSessionPrepNotesProps {
  jobs: any[];
}

const TattooSessionPrepNotes: React.FC<TattooSessionPrepNotesProps> = ({ jobs }) => {
  const nextSession = jobs[0] || {};
  
  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" />
          Session Prep Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="fintech-inner-box p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Next Session: {nextSession.customer || 'Sarah Chen'}</span>
            <Badge variant="outline">2:00 PM Today</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Duration:</span>
                <span>3-4 hours</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Palette className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Style:</span>
                <span>Minimalist</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Size:</span>
                <span>4x6 inches</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Placement:</span>
                <span>Left forearm</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Custom Fields:</div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div><span className="text-muted-foreground">Allergies:</span> None</div>
              <div><span className="text-muted-foreground">Previous tattoos:</span> 2 small pieces</div>
              <div><span className="text-muted-foreground">Pain tolerance:</span> Average</div>
              <div><span className="text-muted-foreground">Aftercare instructions:</span> Provided</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              Client requested touch-up consultation
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            Start Session Prep
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Edit Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooSessionPrepNotes;