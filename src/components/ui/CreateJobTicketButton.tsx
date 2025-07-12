import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnhancedBookingForm } from '@/components/booking/EnhancedBookingForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateJobTicketButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export const CreateJobTicketButton: React.FC<CreateJobTicketButtonProps> = ({
  variant = 'default',
  size = 'default',
  className,
  showIcon = true,
  fullWidth = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTicket = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create a job ticket",
        variant: "destructive"
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitBooking = async (bookingData: any) => {
    setIsSubmitting(true);
    try {
      console.log('Creating job ticket with data:', bookingData);
      
      // TODO: Implement actual booking creation logic
      // This would call the supabase booking creation endpoint
      
      toast({
        title: "Job ticket created!",
        description: "Your job has been posted and providers will be notified.",
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create job ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Don't render if not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleCreateTicket}
        variant={variant}
        size={size}
        className={cn(
          "bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200",
          fullWidth && "w-full",
          className
        )}
      >
        {showIcon && <Plus className="w-4 h-4 mr-2" />}
        Create Job Ticket
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <Briefcase className="w-6 h-6 text-orange-500" />
              <span>Create New Job Ticket</span>
            </DialogTitle>
          </DialogHeader>
          
          <EnhancedBookingForm
            onSubmit={handleSubmitBooking}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            className="mt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};