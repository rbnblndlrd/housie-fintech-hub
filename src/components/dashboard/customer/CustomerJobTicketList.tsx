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
      case 'pending': return 'secondary';
      case 'scheduled': return 'default';
      case 'in_progress': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
            <div className="space-y-3">
              {filteredBookings.map((booking, index) => {
                const detection = detectServiceFromKeywords(booking.custom_title, booking.instructions);
                const title = getDisplayNameForBooking(booking) || 'Service Request';
                const description = booking.description || booking.instructions;
                const truncatedDescription = description ? 
                  (description.length > 100 ? description.substring(0, 100) + '...' : description) : null;
                
                return (
                  <div 
                    key={booking.id} 
                    className={`rounded-xl bg-card p-4 sm:p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border transition-all duration-300 hover:shadow-md animate-fade-in ${
                      booking.status === 'scheduled' ? 'border-blue-200 bg-blue-50/30' : 'border-border'
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {/* Left Section - Main Info */}
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h3 className="text-base font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                              {title}
                            </h3>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{title}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {!booking.hasLinkedService && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 text-xs">
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
                        
                        <Badge variant="outline" className={`text-xs ${getStatusColorClass(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                        
                        {booking.status === 'pending' && !booking.provider && (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            💬 Needs routing
                          </Badge>
                        )}
                      </div>
                      
                      {/* Meta Information */}
                      <div className="flex items-center gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(booking.date || booking.scheduled_date || new Date().toISOString())}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{booking.time || booking.scheduled_time || 'TBD'}</span>
                        </div>
                        
                        {(booking.location || booking.service_address) && (
                          <div className="flex items-center gap-1 max-w-[200px]">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate">
                                  {(booking.location || booking.service_address)?.substring(0, 25)}
                                  {(booking.location || booking.service_address)?.length > 25 && '...'}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{booking.location || booking.service_address}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                      
                      {/* Description Preview */}
                      {truncatedDescription && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-sm text-muted-foreground italic">
                              {truncatedDescription}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{description}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    
                    {/* Right Section - Actions */}
                    <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
                      {booking.total_amount && (
                        <span className="font-semibold text-lg text-foreground">
                          ${booking.total_amount}
                        </span>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setSelectedBooking(booking)}
                            className="whitespace-nowrap"
                          >
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  <Badge variant="outline" className={getStatusColorClass(selectedBooking.status)}>
                                    {selectedBooking.status.replace('_', ' ')}
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
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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