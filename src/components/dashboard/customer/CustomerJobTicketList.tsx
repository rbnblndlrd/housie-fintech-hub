import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useBookingsContext } from '@/contexts/BookingsContext';
import { Calendar, Clock, MapPin, Eye, X, Plus, AlertTriangle, Edit, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CreateTicketModal from '@/components/modals/CreateTicketModal';
import AnnetteBanner from './AnnetteBanner';
import { getDisplayNameForBooking } from '@/utils/serviceCategories';
import { detectServiceFromKeywords } from '@/utils/mysteryJobDetector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CustomerJobTicketList = () => {
  const { bookings, loading, refetch } = useBookingsContext();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState('');

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  // Count mystery jobs in filtered results
  const mysteryJobCount = useMemo(() => {
    return filteredBookings.filter(booking => !booking.hasLinkedService).length;
  }, [filteredBookings]);

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

  const handleCancelRequest = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Request Cancelled",
        description: "Your booking request has been successfully cancelled.",
      });

      // Refresh bookings and close modal
      await refetch();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditInstructions = () => {
    setEditedInstructions(selectedBooking?.instructions || selectedBooking?.description || '');
    setIsEditingInstructions(true);
  };

  const handleSaveInstructions = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ instructions: editedInstructions })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: "Instructions Updated",
        description: "Your booking instructions have been successfully updated.",
      });

      // Update the selected booking in local state
      setSelectedBooking({ ...selectedBooking, instructions: editedInstructions });
      setIsEditingInstructions(false);
      
      // Refresh bookings
      await refetch();
    } catch (error) {
      console.error('Error updating instructions:', error);
      toast({
        title: "Error",
        description: "Failed to update instructions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingInstructions(false);
    setEditedInstructions('');
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
    <TooltipProvider>
      {/* Show Annette Banner if any mystery jobs exist */}
      {mysteryJobCount > 0 && <AnnetteBanner mysteryJobCount={mysteryJobCount} />}
      
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
              {filteredBookings.map((booking) => {
                const detection = detectServiceFromKeywords(booking.custom_title, booking.instructions);
                
                return (
                  <div key={booking.id} className="fintech-inner-box p-4 relative">
                    {/* Mystery Job Badge */}
                    {!booking.hasLinkedService && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="absolute top-2 right-2 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                          >
                            ⚠️ Mystery Job
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            💬 Annette: "{detection.annetteMessage}"
                            {detection.suggestion && (
                              <span className="block mt-1 font-medium text-orange-600">
                                Suggestion: {detection.suggestion}
                              </span>
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                     <div className="flex items-center justify-between">
                       <div className="flex-1 pr-20"> {/* Add padding to avoid badge overlap */}
                         <div className="flex items-center gap-3 mb-2">
                           <h3 className="font-medium">
                             {getDisplayNameForBooking(booking)}
                           </h3>
                           {booking.status === 'pending' && !booking.provider && (
                             <div className="inline-flex" title="Needs routing to provider">
                               <span className="text-xs text-muted-foreground">💬 Needs routing</span>
                             </div>
                           )}
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
                                    <p>{getDisplayNameForBooking(selectedBooking)}</p>
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
                                <label className="text-sm font-medium text-muted-foreground">Instructions</label>
                                {isEditingInstructions ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={editedInstructions}
                                      onChange={(e) => setEditedInstructions(e.target.value)}
                                      placeholder="Enter instructions for this booking..."
                                      rows={4}
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={handleSaveInstructions}>
                                        <Save className="h-4 w-4 mr-1" />
                                        Save
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <p>{selectedBooking.description || selectedBooking.instructions || 'No instructions provided'}</p>
                                )}
                              </div>
                              <div className="flex gap-2 pt-4">
                                {selectedBooking.status === 'pending' && (
                                  <Button 
                                    variant="outline" 
                                    className="text-red-600"
                                    onClick={() => handleCancelRequest(selectedBooking.id)}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel Request
                                  </Button>
                                )}
                                {!isEditingInstructions && (
                                  <Button variant="outline" onClick={handleEditInstructions}>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit Instructions
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                       </Dialog>
                       </div>
                     </div>
                  </div>
                );
              })}
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
    </TooltipProvider>
  );
};

export default CustomerJobTicketList;