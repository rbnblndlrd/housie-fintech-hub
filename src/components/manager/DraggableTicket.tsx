
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
      case 'high': return 'bg-red-500/30 text-red-200 border-red-400/50 backdrop-blur-sm drop-shadow-md';
      case 'medium': return 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50 backdrop-blur-sm drop-shadow-md';
      case 'low': return 'bg-green-500/30 text-green-200 border-green-400/50 backdrop-blur-sm drop-shadow-md';
      default: return 'bg-gray-500/30 text-gray-200 border-gray-400/50 backdrop-blur-sm drop-shadow-md';
    }
  };

  return (
    <Card 
      className={`bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all cursor-move border-l-4 text-white ${
        ticket.priority === 'high' ? 'border-l-red-400' : 
        ticket.priority === 'medium' ? 'border-l-yellow-400' : 'border-l-green-400'
      } ${isDragging ? 'opacity-50 rotate-2' : ''} border-white/20 shadow-lg drop-shadow-lg`}
      draggable
      onDragStart={(e) => onDragStart(e, ticket)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-white text-sm drop-shadow-md text-shadow">{ticket.title}</h4>
          <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
            <span className="drop-shadow-sm">{ticket.priority}</span>
          </Badge>
        </div>
        
        <p className="text-xs text-white/80 mb-3 line-clamp-2 drop-shadow-md">{ticket.description}</p>
        
        <div className="space-y-1 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 drop-shadow-sm" />
            <span className="drop-shadow-sm">{ticket.client}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 drop-shadow-sm" />
            <span className="drop-shadow-sm">{ticket.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 drop-shadow-sm" />
            <span className="drop-shadow-sm">{ticket.estimatedDuration}min</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {ticket.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-white/20 text-white/90 border-white/30 backdrop-blur-sm drop-shadow-md">
              <span className="drop-shadow-sm">{tag}</span>
            </Badge>
          ))}
          {ticket.tags.length > 2 && (
            <Badge variant="outline" className="text-xs bg-white/20 text-white/90 border-white/30 backdrop-blur-sm drop-shadow-md">
              <span className="drop-shadow-sm">+{ticket.tags.length - 2}</span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DraggableTicket;
