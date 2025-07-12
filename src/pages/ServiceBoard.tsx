import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Navigate } from 'react-router-dom';
import VideoBackground from '@/components/common/VideoBackground';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Edit, 
  X, 
  Eye,
  CheckCircle,
  AlertCircle,
  Star,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import AnnetteServiceBoardTips from '@/components/annette/AnnetteServiceBoardTips';

// Sample ticket data
const sampleTickets = [
  {
    id: '1',
    title: 'Kitchen Deep Clean',
    serviceType: 'Cleaning',
    status: 'Created',
    scheduledDate: '2024-01-20',
    scheduledTime: '10:00 AM',
    address: '123 Rue Saint-Denis, Montreal, QC',
    instructions: 'Focus on the stovetop and oven. Kitchen hasn\'t been deep cleaned in 6 months.',
    photoVerification: true,
    provider: null,
    createdAt: '2024-01-15',
    estimatedCost: '$120 - $150'
  },
  {
    id: '2',
    title: 'Plumbing Repair',
    serviceType: 'Plumbing',
    status: 'Matched',
    scheduledDate: '2024-01-18',
    scheduledTime: '2:00 PM',
    address: '456 Boulevard des Laurentides, Laval, QC',
    instructions: 'Kitchen sink is backing up, may need drain snake.',
    photoVerification: true,
    provider: {
      name: 'Jean Plombier',
      rating: 4.8,
      completedJobs: 147,
      verified: true
    },
    createdAt: '2024-01-12',
    estimatedCost: '$85 - $120'
  },
  {
    id: '3',
    title: 'Garden Maintenance',
    serviceType: 'Landscaping',
    status: 'Completed',
    scheduledDate: '2024-01-10',
    scheduledTime: '9:00 AM',
    address: '789 Avenue du Parc, Montreal, QC',
    instructions: 'Trim hedges and clean up fall leaves.',
    photoVerification: true,
    provider: {
      name: 'Marie Jardins',
      rating: 4.9,
      completedJobs: 203,
      verified: true
    },
    createdAt: '2024-01-08',
    estimatedCost: '$80 - $100',
    completedAt: '2024-01-10',
    finalCost: '$95'
  }
];

const ServiceBoard = () => {
  const { user } = useAuth();
  const { currentRole } = useRoleSwitch();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (currentRole !== 'customer') {
    return <Navigate to="/dashboard" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Matched':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Created':
        return <Clock className="h-4 w-4" />;
      case 'Matched':
        return <User className="h-4 w-4" />;
      case 'In Progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleCancelTicket = (ticketId: string) => {
    toast.success('Ticket cancelled successfully');
    setShowTicketModal(false);
  };

  const handleEditInstructions = () => {
    toast.success('Instructions updated');
  };

  const handleContactProvider = () => {
    toast.success('Message sent to provider');
  };

  const activeTickets = sampleTickets.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
  const completedTickets = sampleTickets.filter(t => t.status === 'Completed');

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        
        <div className="pt-16 pl-[188px] pr-[188px] pb-8">
          <div className="max-w-full">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-2">
                Service Board
              </h1>
              <p className="text-white/90 text-shadow">
                Track and manage all your service requests
              </p>
            </div>

            {/* Annette Tips */}
            <AnnetteServiceBoardTips context="general" className="mb-6" />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="fintech-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Active Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{activeTickets.length}</div>
                  <p className="text-sm text-gray-600">In progress</p>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">{completedTickets.length}</div>
                  <p className="text-sm text-gray-600">This month</p>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-amber-600 mb-1">$275</div>
                  <p className="text-sm text-gray-600">This month</p>
                </CardContent>
              </Card>

              <Card className="fintech-metric-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Avg Rating Given
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-1">4.7</div>
                  <p className="text-sm text-gray-600">To providers</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Tickets */}
            {activeTickets.length > 0 && (
              <Card className="fintech-card mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Active Tickets ({activeTickets.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="fintech-inner-box p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                              <Badge className={getStatusColor(ticket.status)}>
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1">{ticket.status}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{ticket.serviceType}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>{ticket.scheduledDate} at {ticket.scheduledTime}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{ticket.estimatedCost}</div>
                            {ticket.provider && (
                              <div className="text-xs text-gray-500 mt-1">
                                Provider: {ticket.provider.name}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{ticket.address}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {!ticket.provider && (
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {ticket.provider && (
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message Provider
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed Tickets */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Recent Completed Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No completed tickets yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="fintech-inner-box p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                              <Badge className={getStatusColor(ticket.status)}>
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1">{ticket.status}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{ticket.serviceType}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>Completed on {ticket.completedAt}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">{ticket.finalCost}</div>
                            {ticket.provider && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>{ticket.provider.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{ticket.address}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                {selectedTicket?.title}
                <Badge className={getStatusColor(selectedTicket?.status)}>
                  {getStatusIcon(selectedTicket?.status)}
                  <span className="ml-1">{selectedTicket?.status}</span>
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6">
              {/* Status Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Status Progress</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${selectedTicket.status === 'Created' || selectedTicket.status === 'Matched' || selectedTicket.status === 'In Progress' || selectedTicket.status === 'Completed' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Created</span>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className={`w-3 h-3 rounded-full ${selectedTicket.status === 'Matched' || selectedTicket.status === 'In Progress' || selectedTicket.status === 'Completed' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Matched</span>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className={`w-3 h-3 rounded-full ${selectedTicket.status === 'In Progress' || selectedTicket.status === 'Completed' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">In Progress</span>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className={`w-3 h-3 rounded-full ${selectedTicket.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Completed</span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Service Type</label>
                  <p className="text-gray-900">{selectedTicket.serviceType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Scheduled Date & Time</label>
                  <p className="text-gray-900">{selectedTicket.scheduledDate} at {selectedTicket.scheduledTime}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{selectedTicket.address}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Special Instructions</label>
                  <p className="text-gray-900">{selectedTicket.instructions}</p>
                </div>
              </div>

              {/* Provider Info */}
              {selectedTicket.provider && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Matched Provider
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{selectedTicket.provider.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{selectedTicket.provider.rating} ({selectedTicket.provider.completedJobs} jobs)</span>
                        {selectedTicket.provider.verified && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              )}

              {/* Photo Verification */}
              {selectedTicket.photoVerification && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    📸 Photo Verification Enabled
                  </h4>
                  <p className="text-sm text-gray-600">
                    This service includes before and after photos for quality assurance.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedTicket.status === 'Created' && (
                  <>
                    <Button onClick={handleEditInstructions} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Instructions
                    </Button>
                    <Button 
                      onClick={() => handleCancelTicket(selectedTicket.id)} 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Ticket
                    </Button>
                  </>
                )}
                {selectedTicket.provider && (
                  <Button onClick={handleContactProvider}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Provider
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceBoard;