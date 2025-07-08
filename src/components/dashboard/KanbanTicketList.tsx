import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, GripVertical, GripHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ServiceTicket {
  id: string;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  serviceType: string;
  city: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  payout: number;
  date: string;
  customerName: string;
  duration: string;
}

interface Column {
  id: string;
  label: string;
  field: keyof ServiceTicket;
  visible: boolean;
}

const KanbanTicketList = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'status', label: 'Status', field: 'status', visible: true },
    { id: 'service', label: 'Service', field: 'serviceType', visible: true },
    { id: 'city', label: 'City', field: 'city', visible: true },
    { id: 'priority', label: 'Priority', field: 'priority', visible: true },
    { id: 'payout', label: 'Payout', field: 'payout', visible: false },
    { id: 'date', label: 'Date', field: 'date', visible: false },
    { id: 'customer', label: 'Customer', field: 'customerName', visible: false },
    { id: 'duration', label: 'Duration', field: 'duration', visible: false },
  ]);

  const [tickets] = useState<ServiceTicket[]>([
    {
      id: '1',
      status: 'new',
      serviceType: 'Plumbing',
      city: 'Montreal',
      priority: 'high',
      payout: 150,
      date: '2024-01-15',
      customerName: 'Marie Dubois',
      duration: '2 hours'
    },
    {
      id: '2',
      status: 'in-progress',
      serviceType: 'Electrical',
      city: 'Laval',
      priority: 'medium',
      payout: 200,
      date: '2024-01-16',
      customerName: 'Jean Tremblay',
      duration: '3 hours'
    },
    {
      id: '3',
      status: 'completed',
      serviceType: 'Cleaning',
      city: 'Longueuil',
      priority: 'low',
      payout: 80,
      date: '2024-01-14',
      customerName: 'Sophie Martin',
      duration: '1.5 hours'
    }
  ]);

  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible } : col
    ));
  };

  const visibleColumns = columns.filter(col => col.visible);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-600 text-white';
      case 'in-progress': return 'bg-amber-600 text-white';
      case 'completed': return 'bg-green-600 text-white';
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTicketDragStart = (e: React.DragEvent, ticket: ServiceTicket) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ticket));
  };

  const renderCellValue = (ticket: ServiceTicket, field: keyof ServiceTicket) => {
    const value = ticket[field];
    
    switch (field) {
      case 'status':
        return <Badge className={getStatusColor(value as string)}>{value}</Badge>;
      case 'priority':
        return <Badge className={getPriorityColor(value as string)}>{value}</Badge>;
      case 'payout':
        return <span className="font-medium text-green-600">${value}</span>;
      default:
        return <span className="text-sm">{value}</span>;
    }
  };

  return (
    <Card className="fintech-card border-3 border-black bg-cream/95 shadow-lg h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          My Service Tickets
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible}
                onCheckedChange={(checked) => handleColumnVisibilityChange(column.id, checked)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Column Headers */}
            <div className="grid gap-2 p-4 border-b bg-gray-50/50" style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, 1fr)` }}>
              {visibleColumns.map((column) => (
                <div key={column.id} className="flex items-center gap-2 font-medium text-sm text-gray-700">
                  <GripVertical className="h-3 w-3 text-gray-400 cursor-move" />
                  {column.label}
                </div>
              ))}
            </div>
            
            {/* Ticket Rows */}
            <div className="max-h-[280px] overflow-y-auto">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="grid gap-2 p-3 border-b hover:bg-gray-50/50 cursor-move transition-colors"
                  style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, 1fr)` }}
                  draggable
                  onDragStart={(e) => handleTicketDragStart(e, ticket)}
                >
                  <div className="flex items-center gap-2">
                    <GripHorizontal className="h-3 w-3 text-gray-400" />
                  </div>
                  {visibleColumns.slice(1).map((column) => (
                    <div key={column.id} className="flex items-center">
                      {renderCellValue(ticket, column.field)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanTicketList;
