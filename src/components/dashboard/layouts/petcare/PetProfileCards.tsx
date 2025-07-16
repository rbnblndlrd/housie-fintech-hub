import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog, Cat, Heart, Calendar, Phone } from 'lucide-react';

const PetProfileCards: React.FC = () => {
  const petProfiles = [
    {
      id: '1',
      name: 'Buddy',
      type: 'dog',
      breed: 'Golden Retriever',
      age: '3 years',
      owner: 'Sarah Johnson',
      lastVisit: 'Yesterday',
      rating: 5,
      personality: ['Friendly', 'Energetic', 'Ball-obsessed'],
      medicalNotes: 'Hip dysplasia - gentle exercise',
      nextBooking: 'Tomorrow 9 AM'
    },
    {
      id: '2',
      name: 'Whiskers',
      type: 'cat',
      breed: 'Persian',
      age: '7 years',
      owner: 'Mike Chen',
      lastVisit: '3 days ago',
      rating: 4,
      personality: ['Calm', 'Indoor', 'Treats-motivated'],
      medicalNotes: 'None',
      nextBooking: 'Friday 2 PM'
    }
  ];

  const getPetIcon = (type: string) => {
    switch(type) {
      case 'dog': return <Dog className="h-5 w-5 text-blue-600" />;
      case 'cat': return <Cat className="h-5 w-5 text-purple-600" />;
      default: return <Heart className="h-5 w-5 text-pink-600" />;
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Regular Clients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {petProfiles.map((pet) => (
          <div key={pet.id} className="fintech-inner-box p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getPetIcon(pet.type)}
                <div>
                  <h3 className="font-semibold">{pet.name}</h3>
                  <p className="text-sm text-muted-foreground">{pet.breed}, {pet.age}</p>
                  <p className="text-xs text-muted-foreground">Owner: {pet.owner}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{renderStars(pet.rating)}</div>
                <p className="text-xs text-muted-foreground">Last: {pet.lastVisit}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Personality:</p>
                <div className="flex flex-wrap gap-1">
                  {pet.personality.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              {pet.medicalNotes !== 'None' && (
                <div className="bg-red-50 border border-red-200 p-2 rounded">
                  <p className="text-xs font-medium text-red-800">Medical Notes:</p>
                  <p className="text-xs text-red-700">{pet.medicalNotes}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Next: {pet.nextBooking}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-1" />
                Rebook
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
        ))}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          🐾 Tip: Regular clients book 3x more often than new ones!
        </div>
      </CardContent>
    </Card>
  );
};

export default PetProfileCards;