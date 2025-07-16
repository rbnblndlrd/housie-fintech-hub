import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Clock, Palette, CheckCircle } from 'lucide-react';

interface TattooPrepSheetsProps {
  bookings: any[];
}

const TattooPrepSheets: React.FC<TattooPrepSheetsProps> = ({ bookings }) => {
  const prepSheets = [
    {
      id: 1,
      client: 'Sarah Chen',
      appointment: 'Today 2:00 PM',
      design: 'Minimalist florals',
      placement: 'Left forearm',
      duration: '3 hours',
      status: 'ready',
      notes: 'First tattoo, allergies checked'
    },
    {
      id: 2,
      client: 'Mike Rodriguez',
      appointment: 'Tomorrow 10:00 AM',
      design: 'Traditional eagle',
      placement: 'Upper arm',
      duration: '4 hours',
      status: 'in-progress',
      notes: 'Sleeve continuation, session 3 of 5'
    },
    {
      id: 3,
      client: 'Emma Thompson',
      appointment: 'Friday 1:00 PM',
      design: 'Watercolor abstract',
      placement: 'Shoulder blade',
      duration: '2 hours',
      status: 'draft',
      notes: 'Design approval pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-600 text-white';
      case 'in-progress': return 'bg-blue-600 text-white';
      case 'draft': return 'bg-amber-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" />
          Prep Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {prepSheets.map((sheet) => (
          <div key={sheet.id} className="fintech-inner-box p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{sheet.client}</span>
              </div>
              <Badge className={getStatusColor(sheet.status)}>
                {sheet.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{sheet.appointment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-3 w-3 text-muted-foreground" />
                  <span>{sheet.design}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div><span className="text-muted-foreground">Placement:</span> {sheet.placement}</div>
                <div><span className="text-muted-foreground">Duration:</span> {sheet.duration}</div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-muted/30 rounded text-xs">
              <span className="text-muted-foreground">Notes:</span> {sheet.notes}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1">
                Edit Prep Sheet
              </Button>
              {sheet.status === 'ready' && (
                <Button size="sm" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Start Session
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {prepSheets.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No prep sheets available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TattooPrepSheets;