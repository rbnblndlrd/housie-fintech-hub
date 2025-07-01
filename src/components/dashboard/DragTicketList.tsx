
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, MapPin, Phone, Wrench } from 'lucide-react';

interface DragTicketListProps {
  onDragStart: (ticket: any) => void;
  draggedTicket: any;
}

const DragTicketList = ({ onDragStart, draggedTicket }: DragTicketListProps) => {
  const tickets = [
    {
      id: 1,
      title: 'Emergency Plumbing Repair',
      client: 'Marie Tremblay',
      location: 'Downtown Montreal',
      time: '09:00 AM',
      priority: 'high',
      service: 'Plumbing',
      estimatedDuration: 120,
      status: 'new'
    },
    {
      id: 2,
      title: 'HVAC System Maintenance',
      client: 'Jean Dupont',
      location: 'Westmount',
      time: '11:30 AM',
      priority: 'medium',
      service: 'HVAC',
      estimatedDuration: 90,
      status: 'assigned'
    },
    {
      id: 3,
      title: 'Electrical Panel Upgrade',
      client: 'Sophie Martin',
      location: 'Plateau Mont-Royal',
      time: '02:00 PM',
      priority: 'low',
      service: 'Electrical',
      estimatedDuration: 180,
      status: 'scheduled'
    },
    {
      id: 4,
      title: 'Kitchen Renovation',
      client: 'Robert Wilson',
      location: 'NDG',
      time: '10:00 AM',
      priority: 'medium',
      service: 'Renovation',
      estimatedDuration: 240,
      status: 'new'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'assigned': return 'bg-purple-500';
      case 'scheduled': return 'bg-orange-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDragStart = (e: React.DragEvent, ticket: any) => {
    e.dataTransfer.setData('text/plain', '');
    onDragStart(ticket);
  };

  return (
    <Card className="banking-card">
      <CardHeader>
        <CardTitle className="banking-title flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          Job Ticket Queue
          <Badge className="banking-badge ml-auto">
            {tickets.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              draggable
              onDragStart={(e) => handleDragStart(e, ticket)}
              className={`
                p-4 bg-white/70 rounded-xl border-3 border-gray-300 
                hover:border-gray-400 transition-all duration-200 cursor-move
                ${draggedTicket?.id === ticket.id ? 'opacity-50 scale-95' : 'hover:shadow-lg'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="banking-title text-lg mb-1">{ticket.title}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                      {ticket.priority}
                    </Badge>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`}></div>
                    <span className="text-xs banking-text capitalize">{ticket.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 banking-text text-sm">
                  <User className="h-4 w-4" />
                  <span>{ticket.client}</span>
                </div>
                <div className="flex items-center gap-2 banking-text text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{ticket.location}</span>
                </div>
                <div className="flex items-center gap-2 banking-text text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{ticket.time} • {ticket.estimatedDuration} min</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" className="banking-button-secondary flex-1 text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button size="sm" className="banking-button-primary flex-1 text-xs">
                  Assign
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border-3 border-blue-200">
          <p className="banking-text text-sm text-center">
            <strong>💡 Tip:</strong> Drag tickets to the AI Job Optimizer above for intelligent scheduling and route optimization
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DragTicketList;
