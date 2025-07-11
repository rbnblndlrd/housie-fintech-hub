import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { triggerAnnetteAction } from '@/components/assistant/AnnetteIntegration';

interface JobTicket {
  id: string;
  title: string;
  dueDate: string;
  customer: string;
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  status: 'Confirmed' | 'In Progress' | 'Scheduled' | 'Pending';
  description?: string;
}

const mockTickets: JobTicket[] = [
  {
    id: '1',
    title: 'Furnace Repair',
    dueDate: '2024-01-15',
    customer: 'Marie Dubois',
    priority: 'Emergency',
    status: 'Confirmed'
  },
  {
    id: '2', 
    title: 'Kitchen Sink Installation',
    dueDate: '2024-01-16',
    customer: 'Jean-Paul Tremblay',
    priority: 'High',
    status: 'Scheduled'
  },
  {
    id: '3',
    title: 'Bathroom Tile Repair',
    dueDate: '2024-01-17',
    customer: 'Sophie Martin',
    priority: 'Medium',
    status: 'Pending'
  },
  {
    id: '4',
    title: 'Electrical Outlet Install',
    dueDate: '2024-01-18',
    customer: 'Michel Bouchard',
    priority: 'Low',
    status: 'In Progress'
  }
];

const JobTicketTable = () => {
  const [tickets, setTickets] = useState(mockTickets);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Scheduled': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Scheduled': return <Calendar className="h-4 w-4" />;
      case 'Pending': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Emergency': return <Zap className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleParse = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    triggerAnnetteAction('parse_ticket', { ticket });
  };

  const handleSchedule = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    triggerAnnetteAction('schedule_job', { ticket });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Active Job Tickets</h3>
        <Button variant="outline" size="sm" className="text-xs">
          <FileText className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-muted/30 backdrop-blur-md border border-muted/20 rounded-lg p-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium text-foreground">{ticket.title}</h4>
                {getPriorityIcon(ticket.priority)}
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span className="font-medium">Customer:</span>
                <span className="ml-2">{ticket.customer}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Due: {ticket.dueDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleParse(ticket.id)}
                className="bg-muted/20 hover:bg-muted/40"
              >
                <FileText className="h-4 w-4 mr-2" />
                Parse
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSchedule(ticket.id)}
                className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobTicketTable;