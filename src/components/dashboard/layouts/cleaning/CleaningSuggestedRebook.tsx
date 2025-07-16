import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Star, Calendar, MessageCircle } from 'lucide-react';

interface CleaningSuggestedRebookProps {
  bookings: any[];
}

const CleaningSuggestedRebook: React.FC<CleaningSuggestedRebookProps> = ({ bookings }) => {
  const suggestedRepeats = [
    {
      id: 1,
      customer: 'Maria Santos',
      lastService: '2 weeks ago',
      frequency: 'Bi-weekly',
      rating: 5,
      nextSuggested: 'This Friday',
      amount: 120
    },
    {
      id: 2,
      customer: 'Robert Chen',
      lastService: '3 weeks ago',
      frequency: 'Monthly',
      rating: 5,
      nextSuggested: 'Next Monday',
      amount: 200
    },
    {
      id: 3,
      customer: 'Lisa Rodriguez',
      lastService: '1 month ago',
      frequency: 'Monthly',
      rating: 4,
      nextSuggested: 'This Weekend',
      amount: 150
    }
  ];

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-green-500" />
          Suggested Rebookings
          <Badge variant="secondary">{suggestedRepeats.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedRepeats.map((repeat) => (
            <div key={repeat.id} className="fintech-inner-box p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{repeat.customer}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{repeat.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>Last service: {repeat.lastService}</div>
                <div>Pattern: {repeat.frequency}</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium text-foreground">{repeat.nextSuggested}</span>
                </div>
                <div className="font-medium text-green-600">${repeat.amount}</div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 text-xs">
                  Book Again
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <MessageCircle className="h-3 w-3" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {suggestedRepeats.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No rebooking suggestions available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CleaningSuggestedRebook;