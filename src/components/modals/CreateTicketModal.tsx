import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
  prefillData?: {
    category?: string;
    location?: string;
    providerId?: string;
  };
  onSuccess?: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ 
  open,
  onClose,
  prefillData, 
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    scheduledDate: '',
    scheduledTime: '',
    budget: '',
    priority: 'normal'
  });

  const serviceCategories = [
    'Cleaning',
    'Gardening',
    'Home Repairs',
    'Maintenance',
    'Moving',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Tech Support',
    'Pet Care',
    'Other'
  ];

  // Prefill form data when modal opens or prefillData changes
  useEffect(() => {
    if (open && prefillData) {
      setFormData(prev => ({
        ...prev,
        category: prefillData.category || prev.category,
        location: prefillData.location || prev.location,
      }));
    }
  }, [open, prefillData]);

  // Location placeholder logic (would ideally use GPS)
  useEffect(() => {
    if (open && !formData.location && !prefillData?.location) {
      setFormData(prev => ({
        ...prev,
        location: 'Montreal, QC' // Placeholder - would use geolocation in production
      }));
    }
  }, [open, formData.location, prefillData?.location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a service ticket.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
        toast({
          title: "Error",
          description: "Failed to get user information. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Find service provider (simplified logic)
      const { data: providers, error: providerError } = await supabase
        .from('provider_profiles')
        .select('*')
        .limit(1);

      if (providerError || !providers || providers.length === 0) {
        toast({
          title: "No providers available",
          description: "No service providers are available at this time.",
          variant: "destructive",
        });
        return;
      }

      const selectedProvider = providers[0];

      // Find or create service
      let { data: services, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('category', formData.category.toLowerCase())
        .limit(1);

      if (serviceError) {
        console.error('Service fetch error:', serviceError);
        return;
      }

      let serviceId: string;
      if (services && services.length > 0) {
        serviceId = services[0].id;
      } else {
        // Create a new service entry
        const { data: newService, error: newServiceError } = await supabase
          .from('services')
          .insert({
            title: formData.category,
            category: formData.category.toLowerCase(),
            description: `${formData.category} service`,
            base_price: parseFloat(formData.budget) || 50,
            provider_id: selectedProvider.id
          })
          .select()
          .single();

        if (newServiceError || !newService) {
          console.error('Service creation error:', newServiceError);
          return;
        }
        serviceId = newService.id;
      }

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          provider_id: selectedProvider.id,
          service_id: serviceId,
          scheduled_date: formData.scheduledDate,
          scheduled_time: formData.scheduledTime,
          service_address: formData.location,
          instructions: formData.description,
          total_amount: parseFloat(formData.budget) || null,
          priority: formData.priority,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        toast({
          title: "Error creating ticket",
          description: "Failed to create service ticket. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Ticket created successfully!",
        description: "Your service request has been submitted and will be reviewed by providers.",
      });

      // Reset form
      setFormData({
        category: '',
        title: '',
        description: '',
        location: '',
        scheduledDate: '',
        scheduledTime: '',
        budget: '',
        priority: 'normal'
      });

      onClose();
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="modal-stable modal-content-stable bg-background border border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Service Ticket
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Service Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type..." />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of what you need..."
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Service Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Address where service is needed..."
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Service Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you need done in detail..."
              rows={4}
              required
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (CAD)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="100"
              min="0"
              step="0.01"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Flexible timing</SelectItem>
                <SelectItem value="normal">Normal - Standard priority</SelectItem>
                <SelectItem value="high">High - Urgent attention needed</SelectItem>
                <SelectItem value="emergency">Emergency - ASAP required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.category || !formData.title || !formData.description}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;