
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, Briefcase } from 'lucide-react';
import { CalendarEvent } from '@/hooks/useBookingCalendarIntegration';

interface CalendarEventCardProps {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => Promise<void>;
}

const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl shadow-inner hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            {event.title}
            {event.booking_id && (
              <Badge variant="outline" className="text-xs">
                <Briefcase className="h-3 w-3 mr-1" />
                Réservation
              </Badge>
            )}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${getStatusColor(event.status)} text-white border-0 shadow-sm`}>
              {getStatusText(event.status)}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${event.source === 'google' ? 'border-green-300 text-green-700' : 'border-blue-300 text-blue-700'}`}
            >
              {event.source === 'google' ? 'Google' : 'HOUSIE'}
            </Badge>
            {event.is_provider && (
              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                Prestataire
              </Badge>
            )}
          </div>
        </div>
        {event.amount > 0 && (
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">${event.amount}</p>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <Clock className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm text-gray-700">{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
            <User className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm text-gray-700">{event.client}</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm text-gray-700">{event.location}</span>
        </div>
      </div>
      
      {event.source !== 'google' && (
        <div className="mt-4 flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onEdit(event)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            Modifier
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDelete(event.id)}
            className="border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200"
          >
            {event.booking_id ? 'Annuler' : 'Supprimer'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CalendarEventCard;
