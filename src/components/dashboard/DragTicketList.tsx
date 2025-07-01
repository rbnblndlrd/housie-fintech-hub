
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  MapPin, 
  User, 
  AlertTriangle, 
  Star,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

interface DragTicketListProps {
  onDragStart: (ticket: any) => void;
  draggedTicket: any;
}

const DragTicketList = ({ onDragStart, draggedTicket }: DragTicketListProps) => {
  const tickets = [
    {
      id: 1,
      title: 'Emergency Plumbing Repair',
      client: 'Sarah Johnson',
      location: 'Downtown Montreal',
      priority: 'high',
      estimatedTime: '2 hours',
      category: 'Plumbing',
      description: 'Burst pipe in basement needs immediate attention',
      status: 'urgent'
    },
    {
      id: 2,
      title: 'HVAC System Maintenance',
      client: 'Mike Chen',
      location: 'Westmount',
      priority: 'medium',
      estimatedTime: '1.5 hours',
      category: 'HVAC',
      description: 'Regular maintenance check and filter replacement',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Electrical Panel Inspection',
      client: 'Lisa Martin',
      location: 'NDG',
      priority: 'medium',
      estimatedTime: '1 hour',
      category: 'Electrical',
      description: 'Safety inspection and code compliance check',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Deep House Cleaning',
      client: 'Robert Wilson',
      location: 'Plateau',
      priority: 'low',
      estimatedTime: '3 hours',
      category: 'Cleaning',
      description: 'Post-renovation cleaning service',
      status: 'scheduled'
    },
    {
      id: 5,
      title: 'Kitchen Renovation Consult',
      client: 'Emma Davis',
      location: 'Outremont',
      priority: 'low',
      estimatedTime: '45 minutes',
      category: 'Renovation',
      description: 'Initial consultation for kitchen renovation project',
      status: 'pending'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <RefreshCw className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleDragStart = (e: React.DragEvent, ticket: any) => {
    onDragStart(ticket);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="autumn-card-fintech-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            Job Ticket Queue
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge className="bg-indigo-100 text-indigo-800 px-4 py-2 text-lg font-bold border-2 border-indigo-200">
              {tickets.length} Active
            </Badge>
            <Button variant="outline" size="sm" className="border-2 border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-2 border-gray-300">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              draggable
              onDragStart={(e) => handleDragStart(e, ticket)}
              className={`
                p-6 bg-white rounded-xl border-4 border-amber-200 shadow-lg hover:shadow-xl 
                cursor-move transition-all duration-200 hover:scale-105 hover:border-amber-400
                ${draggedTicket?.id === ticket.id ? 'opacity-50 scale-95' : ''}
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <Badge className={`${getPriorityColor(ticket.priority)} font-bold text-sm border-2`}>
                    {ticket.priority}
                  </Badge>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {ticket.category}
                </Badge>
              </div>

              <h4 className="font-black text-gray-900 text-lg mb-2 line-clamp-2">
                {ticket.title}
              </h4>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {ticket.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-bold text-gray-900">{ticket.client}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">{ticket.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">{ticket.estimatedTime}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-2 border-gray-300 hover:border-gray-400"
                >
                  View Details
                </Button>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Drag to optimize</div>
                  <div className="text-xs text-gray-400">ID: #{ticket.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-4 border-amber-200">
          <div className="text-center">
            <h4 className="font-black text-amber-800 text-lg mb-2">💡 Pro Tip</h4>
            <p className="text-amber-700">
              Drag tickets to the AI Optimizer above for automatic route planning and crew assignment!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DragTicketList;
