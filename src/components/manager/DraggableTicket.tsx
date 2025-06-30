
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, User, AlertTriangle } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  client: string;
  location: string;
  estimatedDuration: number;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  tags: string[];
  createdAt: string;
}

interface DraggableTicketProps {
  ticket: Ticket;
  onDragStart: (e: React.DragEvent, ticket: Ticket) => void;
  isDragging?: boolean;
}

const DraggableTicket: React.FC<DraggableTicketProps> = ({ 
  ticket, 
  onDragStart, 
  isDragging = false 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card 
      className={`bg-black/40 backdrop-blur-md hover:bg-black/50 border-l-4 text-white ${getPriorityBorderColor(ticket.priority)} ${
        isDragging ? 'opacity-50 rotate-2' : ''
      } border-white/30 shadow-lg hover:shadow-xl transition-all cursor-move`}
      draggable
      onDragStart={(e) => onDragStart(e, ticket)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-white text-sm">{ticket.title}</h4>
          <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
            {ticket.priority}
          </Badge>
        </div>
        
        <p className="text-xs text-white/80 mb-3 line-clamp-2">{ticket.description}</p>
        
        <div className="space-y-1 text-xs text-white/70">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{ticket.client}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{ticket.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{ticket.estimatedDuration}min</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {ticket.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-white/20 text-white/90 border-white/30">
              {tag}
            </Badge>
          ))}
          {ticket.tags.length > 2 && (
            <Badge variant="outline" className="text-xs bg-white/20 text-white/90 border-white/30">
              +{ticket.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableTicket;
