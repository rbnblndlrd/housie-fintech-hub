
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
      case 'high': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  return (
    <Card 
      className={`bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all cursor-move border-l-4 text-white ${
        ticket.priority === 'high' ? 'border-l-red-400' : 
        ticket.priority === 'medium' ? 'border-l-yellow-400' : 'border-l-green-400'
      } ${isDragging ? 'opacity-50 rotate-2' : ''} border-white/20 shadow-lg`}
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
        
        <p className="text-xs text-white/70 mb-3 line-clamp-2">{ticket.description}</p>
        
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
            <Badge key={tag} variant="outline" className="text-xs bg-white/10 text-white/80 border-white/30">
              {tag}
            </Badge>
          ))}
          {ticket.tags.length > 2 && (
            <Badge variant="outline" className="text-xs bg-white/10 text-white/80 border-white/30">
              +{ticket.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableTicket;
