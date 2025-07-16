import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Dog, Cat, Heart } from 'lucide-react';

interface PetCareWalkScheduleProps {
  bookings: any[];
  loading?: boolean;
}

const PetCareWalkSchedule: React.FC<PetCareWalkScheduleProps> = ({ 
  bookings, 
  loading = false 
}) => {
  const mockPetBookings = [
    {
      id: '1',
      petName: 'Buddy',
      petType: 'dog',
      breed: 'Golden Retriever',
      owner: 'Sarah Johnson',
      time: '9:00 AM',
      duration: '30 min',
      location: '123 Park Ave',
      notes: 'Loves tennis balls, shy with other dogs',
      lastWalk: '2 days ago'
    },
    {
      id: '2',
      petName: 'Whiskers',
      petType: 'cat',
      breed: 'Persian',
      owner: 'Mike Chen',
      time: '2:00 PM',
      duration: '20 min',
      location: '456 Oak St',
      notes: 'Indoor cat, needs gentle handling',
      lastWalk: 'First visit'
    }
  ];

  const getPetIcon = (type: string) => {
    switch(type) {
      case 'dog': return <Dog className="h-4 w-4" />;
      case 'cat': return <Cat className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getLastWalkColor = (lastWalk: string) => {
    if (lastWalk.includes('First')) return 'bg-blue-600 text-white';
    if (lastWalk.includes('day')) return 'bg-green-600 text-white';
    return 'bg-gray-600 text-white';
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dog className="h-5 w-5" />
          Today's Pet Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading pet schedule...</div>
        ) : (
          mockPetBookings.map((booking) => (
            <div key={booking.id} className="fintech-inner-box p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getPetIcon(booking.petType)}
                  <div>
                    <h3 className="font-semibold">{booking.petName}</h3>
                    <p className="text-sm text-muted-foreground">{booking.breed}</p>
                  </div>
                </div>
                <Badge className={getLastWalkColor(booking.lastWalk)}>
                  {booking.lastWalk}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {booking.time} ({booking.duration})
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {booking.location}
                </div>
                <p className="text-xs"><strong>Owner:</strong> {booking.owner}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-2 rounded text-xs">
                <strong>Special Notes:</strong> {booking.notes}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Start Walk
                </Button>
                <Button size="sm" variant="outline">
                  Call Owner
                </Button>
              </div>
            </div>
          ))
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          🐾 Annette's tip: "Rebook before that puppy pees on Yelp!"
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCareWalkSchedule;