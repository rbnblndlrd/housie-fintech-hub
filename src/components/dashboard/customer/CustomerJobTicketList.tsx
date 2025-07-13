import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBookingsContext } from '@/contexts/BookingsContext';
import { Calendar, Clock, MapPin, Eye, X, Plus, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTicketModal from '@/components/modals/CreateTicketModal';
import { getDisplayNameForBooking } from '@/utils/serviceCategories';

const CustomerJobTicketList = () => {
  const { bookings, loading } = useBookingsContext();
  const [filter, setFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    if (!dateString) return 'Flexible';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Flexible';
    }
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
              <Button size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create New Ticket
              </Button>
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
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="fintech-inner-box p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">
                          {getDisplayNameForBooking(booking.category, booking.subcategory, booking.serviceName)}
                        </h3>
                        {!booking.hasLinkedService && (
                          <div className="inline-flex" title="No formal service template - custom request">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          </div>
                        )}
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      {!booking.hasLinkedService && (
                        <div className="text-xs text-muted-foreground italic mb-2">
                          💬 Annette: "Hmm… this one's a little mysterious! No service template, but someone still wants it done. Must be urgent!"
                        </div>
                      )}
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
                        <DialogContent className="fintech-card max-w-2xl data-[state=open]:translate-y-0 data-[state=closed]:translate-y-0 transition-none">
                          <DialogHeader>
                            <DialogTitle>Ticket Details</DialogTitle>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Service</label>
                                  <div className="flex items-center gap-2">
                                    <p>{getDisplayNameForBooking(selectedBooking.category, selectedBooking.subcategory, selectedBooking.serviceName)}</p>
                                    {!selectedBooking.hasLinkedService && (
                                      <div className="inline-flex" title="Custom request - no template">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                      </div>
                                    )}
                                  </div>
                                  {!selectedBooking.hasLinkedService && (
                                    <p className="text-xs text-muted-foreground italic mt-1">
                                      Custom service request (no formal template)
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                                  <Badge className={getStatusColor(selectedBooking.status)}>
                                    {selectedBooking.status}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                                  <p>{selectedBooking.preferred_date ? formatDate(selectedBooking.preferred_date) : selectedBooking.scheduled_date ? formatDate(selectedBooking.scheduled_date) : 'Flexible'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                                  <p>{selectedBooking.preferred_time || selectedBooking.scheduled_time || 'Flexible'}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Location</label>
                                <p>{selectedBooking.location || selectedBooking.service_address || 'Not specified'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Description</label>
                                <p>{selectedBooking.description || selectedBooking.instructions || 'No description provided'}</p>
                              </div>
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

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
};

export default CustomerJobTicketList;