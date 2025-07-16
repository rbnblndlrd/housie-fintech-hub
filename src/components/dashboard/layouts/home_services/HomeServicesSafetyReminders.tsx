import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const HomeServicesSafetyReminders: React.FC = () => {
  const safetyChecks = [
    {
      id: 'power',
      text: 'Turn off power at breaker',
      critical: true,
      completed: false
    },
    {
      id: 'tools',
      text: 'Inspect tools for damage',
      critical: false,
      completed: true
    },
    {
      id: 'ppe',
      text: 'Wear appropriate PPE',
      critical: true,
      completed: false
    },
    {
      id: 'workspace',
      text: 'Clear workspace of hazards',
      critical: false,
      completed: true
    }
  ];

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Safety Protocol
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-red-800">
            High voltage work detected - Extra precautions required
          </span>
        </div>

        <div className="space-y-2">
          {safetyChecks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-2 rounded border">
              <div className="flex items-center gap-2">
                {check.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-400 rounded" />
                )}
                <span className={`text-sm ${check.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {check.text}
                </span>
              </div>
              {check.critical && (
                <Badge variant="destructive" className="text-xs">Critical</Badge>
              )}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          💡 Annette's tip: "Circuit integrity &gt; ego integrity. Safety first, sugar."
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeServicesSafetyReminders;