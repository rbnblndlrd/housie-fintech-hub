
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  MoreVertical
} from 'lucide-react';

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

const KanbanBoard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Emergency Plumbing Repair',
      description: 'Burst pipe in basement - urgent repair needed',
      priority: 'high',
      assignee: 'Marc Dubois',
      client: 'Marie Tremblay',
      location: 'Downtown Montreal',
      estimatedDuration: 120,
      status: 'todo',
      tags: ['plumbing', 'emergency'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'HVAC Maintenance',
      description: 'Regular maintenance check for heating system',
      priority: 'medium',
      assignee: 'Sophie Lavoie',
      client: 'Jean Martin',
      location: 'Westmount',
      estimatedDuration: 90,
      status: 'in-progress',
      tags: ['hvac', 'maintenance'],
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Electrical Safety Check',
      description: 'Inspect electrical panel and wiring',
      priority: 'medium',
      assignee: 'Pierre Gagnon',
      client: 'Claire Dubois',
      location: 'Plateau Mont-Royal',
      estimatedDuration: 60,
      status: 'review',
      tags: ['electrical', 'inspection'],
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      title: 'Kitchen Renovation Consultation',
      description: 'Initial consultation for kitchen renovation project',
      priority: 'low',
      assignee: 'Luc Bouchard',
      client: 'Nathalie Roy',
      location: 'Verdun',
      estimatedDuration: 45,
      status: 'done',
      tags: ['renovation', 'consultation'],
      createdAt: '2024-01-12'
    }
  ]);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' }
  ];

  const getTicketsByStatus = (status: string) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDragStart = (ticket: Ticket) => {
    setDraggedTicket(ticket);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTicket) {
      setTickets(prev => prev.map(ticket => 
        ticket.id === draggedTicket.id 
          ? { ...ticket, status: newStatus as Ticket['status'] }
          : ticket
      ));
      setDraggedTicket(null);
    }
  };

  const handleSendToGPS = (ticket: Ticket) => {
    console.log('Sending ticket to GPS Job Analyzer:', ticket);
    // Navigate to GPS analyzer with ticket data
    navigate('/gps-job-analyzer', { state: { ticket } });
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
              <p className="text-gray-600">Manage tickets and assignments</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/manager')}>
                Back to Manager
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <div
                key={column.id}
                className={`${column.color} rounded-lg p-4 min-h-[600px]`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <Badge variant="secondary">
                    {getTicketsByStatus(column.id).length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {getTicketsByStatus(column.id).map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(ticket)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium line-clamp-2">
                            {ticket.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent className="pt-0 space-y-2">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{ticket.assignee}</span>
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
                          {ticket.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-500">
                            Client: {ticket.client}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleSendToGPS(ticket)}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            GPS
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
