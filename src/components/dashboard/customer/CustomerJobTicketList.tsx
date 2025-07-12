import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBookingsContext } from '@/contexts/BookingsContext';
import { Calendar, Clock, MapPin, Eye, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTicketModal from '@/components/modals/CreateTicketModal';

const CustomerJobTicketList = () => {
  const { bookings, loading } = useBookingsContext();
  const [filter, setFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle>My Job Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Job Tickets
            </div>
            <div className="flex gap-2">
              <CreateTicketModal onSuccess={() => window.location.reload()}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Create New Ticket
                </Button>
              </CreateTicketModal>
            </div>
          </CardTitle>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({bookings.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({bookings.filter(b => b.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('scheduled')}
            >
              Scheduled ({bookings.filter(b => b.status === 'scheduled').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed ({bookings.filter(b => b.status === 'completed').length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {filter === 'all' ? 'No tickets found' : `No ${filter} tickets`}
              </p>
              <CreateTicketModal onSuccess={() => window.location.reload()}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              </CreateTicketModal>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="fintech-inner-box p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{booking.serviceName || 'Service Request'}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.date || new Date().toISOString())}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.time || 'TBD'}
                        </div>
                        {booking.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.location.substring(0, 30)}...
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.total_amount && (
                        <span className="font-medium">${booking.total_amount}</span>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="fintech-card max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Ticket Details</DialogTitle>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Service</label>
                                  <p>{selectedBooking.serviceName || 'Service Request'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                                  <Badge className={getStatusColor(selectedBooking.status)}>
                                    {selectedBooking.status}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                                  <p>{formatDate(selectedBooking.scheduled_date)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                                  <p>{selectedBooking.scheduled_time}</p>
                                </div>
                              </div>
                              {selectedBooking.service_address && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                                  <p>{selectedBooking.service_address}</p>
                                </div>
                              )}
                              {selectedBooking.instructions && (
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Instructions</label>
                                  <p>{selectedBooking.instructions}</p>
                                </div>
                              )}
                              <div className="flex gap-2 pt-4">
                                {selectedBooking.status === 'pending' && (
                                  <Button variant="outline" className="text-red-600">
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel Request
                                  </Button>
                                )}
                                <Button variant="outline">Edit Instructions</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default CustomerJobTicketList;