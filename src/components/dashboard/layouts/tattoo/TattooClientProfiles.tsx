import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, Star, MessageCircle } from 'lucide-react';

interface TattooClientProfilesProps {
  jobs: any[];
}

const TattooClientProfiles: React.FC<TattooClientProfilesProps> = ({ jobs }) => {
  const clients = [
    { id: 1, name: 'Sarah Chen', lastVisit: '2 weeks ago', tags: ['Minimalist', 'First Timer'], avatar: 'S' },
    { id: 2, name: 'Mike Rodriguez', lastVisit: '1 month ago', tags: ['Traditional', 'Sleeve Work'], avatar: 'M' },
    { id: 3, name: 'Emma Thompson', lastVisit: '3 days ago', tags: ['Color Work', 'Regular'], avatar: 'E' }
  ];

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          Client Profiles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="fintech-inner-box p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {client.avatar}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{client.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">5.0</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Last visit: {client.lastVisit}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    View History
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TattooClientProfiles;