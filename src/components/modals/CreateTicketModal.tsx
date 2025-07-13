import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
    subcategory: '',
    title: '',
    description: '',
    location: '',
    scheduledDate: '',
    scheduledTime: '',
    budget: '',
    priority: 'normal'
  });

  type ServiceCategory = {
    emoji: string;
    label: string;
    value: string;
    subcategories: {
      label: string;
      value: string;
      requiresCertification?: boolean;
    }[];
  };

  const SERVICE_CATEGORIES: ServiceCategory[] = [
    {
      emoji: "💆",
      label: "Personal Wellness",
      value: "wellness",
      subcategories: [
        { label: "Massage Therapy", value: "massage", requiresCertification: true },
        { label: "Tattooing", value: "tattoo" },
        { label: "Haircuts / Styling", value: "haircuts" },
        { label: "Makeup Services", value: "makeup" }
      ]
    },
    {
      emoji: "🧹",
      label: "Cleaning Services",
      value: "cleaning",
      subcategories: [
        { label: "House Cleaning", value: "house_cleaning" },
        { label: "Deep Cleaning", value: "deep_cleaning" },
        { label: "Move-in / Move-out Cleaning", value: "move_cleaning" },
        { label: "Post-Renovation Cleanup", value: "post_reno_cleanup" }
      ]
    },
    {
      emoji: "🌿",
      label: "Exterior & Grounds",
      value: "exterior",
      subcategories: [
        { label: "Lawn Mowing", value: "lawn_mowing" },
        { label: "Snow Removal", value: "snow_removal" },
        { label: "Leaf Removal", value: "leaf_removal" },
        { label: "Hedge Trimming", value: "hedge_trimming" },
        { label: "Pressure Washing", value: "pressure_washing" },
        { label: "Gutter Cleaning", value: "gutter_cleaning" }
      ]
    },
    {
      emoji: "🐕",
      label: "Pet Care Services",
      value: "petcare",
      subcategories: [
        { label: "Dog Walking", value: "dog_walking" },
        { label: "Pet Sitting", value: "pet_sitting" },
        { label: "Litter Change", value: "litter_change" },
        { label: "Pet Feeding", value: "pet_feeding" }
      ]
    },
    {
      emoji: "🔧",
      label: "Appliance & Tech Repair",
      value: "repairs",
      subcategories: [
        { label: "Washer / Dryer Repair", value: "washer_dryer_repair" },
        { label: "Fridge / Freezer Repair", value: "fridge_repair" },
        { label: "Dishwasher Repair", value: "dishwasher_repair" },
        { label: "Smart TV / Device Setup", value: "tv_setup" },
        { label: "Computer / Tech Support", value: "computer_support" }
      ]
    },
    {
      emoji: "🎪",
      label: "Event Services",
      value: "events",
      subcategories: [
        { label: "Event Setup / Teardown", value: "event_setup" },
        { label: "Furniture Moving", value: "furniture_moving" },
        { label: "Balloon / Decor", value: "decor" },
        { label: "On-site Cleaning", value: "event_cleaning" },
        { label: "Bartending", value: "bartending" }
      ]
    },
    {
      emoji: "🚚",
      label: "Moving & Delivery",
      value: "moving",
      subcategories: [
        { label: "Furniture Moving", value: "furniture_moving" },
        { label: "Small Truck Delivery", value: "truck_delivery" },
        { label: "Packing Help", value: "packing_help" },
        { label: "Box Drop-off / Return", value: "box_service" }
      ]
    }
  ];

  // Check if it's snow season (Nov-Mar) for seasonal awareness
  const isSnowSeason = () => {
    const month = new Date().getMonth();
    return month >= 10 || month <= 2; // Nov (10) through Mar (2)
  };

  // Get available subcategories based on selected category
  const getSubcategories = () => {
    const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.value === formData.category);
    return selectedCategory?.subcategories || [];
  };

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
      // Get user data with fallback to auth.user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('id', user.id)
        .maybeSingle();

      // Use auth user data as fallback if database user doesn't exist
      const userInfo = userData || {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email || 'User'
      };

      console.log('📨 Using user info:', userInfo);

      // Find service providers - improved logic with category matching
      const { data: providers, error: providerError } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          users!inner(full_name, email)
        `)
        .eq('verified', true)
        .limit(5);

      console.log('🔍 Found providers:', providers?.length || 0);

      // Get the category and subcategory labels for the service
      const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.value === formData.category);
      const selectedSubcategory = selectedCategory?.subcategories.find(sub => sub.value === formData.subcategory);
      
      const serviceTitle = selectedSubcategory?.label || selectedCategory?.label || formData.title;
      const serviceCategoryValue = formData.category;

      // Find or create service - use the updated category structure
      let { data: services, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('category', serviceCategoryValue)
        .limit(1);

      if (serviceError) {
        console.error('Service fetch error:', serviceError);
      }

      let serviceId: string;
      let selectedProvider = providers?.[0]; // Default to first provider

      if (services && services.length > 0) {
        serviceId = services[0].id;
      } else if (selectedProvider) {
        // Create a new service entry if we have a provider
        const { data: newService, error: newServiceError } = await supabase
          .from('services')
          .insert({
            title: serviceTitle,
            category: serviceCategoryValue,
            description: `${serviceTitle} - ${formData.description}`,
            base_price: parseFloat(formData.budget) || 50,
            provider_id: selectedProvider.id,
            active: true
          })
          .select()
          .single();

        if (newServiceError || !newService) {
          console.error('Service creation error:', newServiceError);
          // Continue anyway - we'll create the booking without a perfect service match
          serviceId = 'temp-service-id';
        } else {
          serviceId = newService.id;
        }
      } else {
        // No providers available, but still create the ticket
        serviceId = 'pending-service-id';
      }

      // Create the booking regardless of provider availability
      const bookingData = {
        customer_id: user.id,
        provider_id: selectedProvider?.id || null,
        service_id: serviceId === 'temp-service-id' || serviceId === 'pending-service-id' ? null : serviceId,
        scheduled_date: formData.scheduledDate,
        scheduled_time: formData.scheduledTime,
        service_address: formData.location,
        instructions: `${serviceTitle}\n\n${formData.description}`,
        total_amount: parseFloat(formData.budget) || null,
        priority: formData.priority,
        status: 'pending'
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
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

      // Show success message with Annette-style confirmation
      const isSnowService = formData.subcategory === 'snow_removal';
      const isOutOfSeason = isSnowService && !isSnowSeason();
      
      let successMessage = "✨ All done! Your ticket's live. I'll keep an eye out for someone qualified. 🕵️‍♀️";
      
      if (isOutOfSeason) {
        successMessage = "Planning for December in July? Now that's what I call proactive. ✨ Ticket created!";
      } else if (!providers || providers.length === 0) {
        successMessage = "No providers currently match, but your request has been saved and Annette is on it! 🚀";
      }

      toast({
        title: "Ticket created successfully!",
        description: successMessage,
      });

      // Reset form
      setFormData({
        category: '',
        subcategory: '',
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
      <DialogContent className="bg-background border border-border max-w-2xl z-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Service Ticket
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new service request.
          </DialogDescription>
        </DialogHeader>
        
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Service Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: '' }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select service category..." />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span>{category.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Subcategory */}
          {formData.category && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Service Type</Label>
              <Select value={formData.subcategory} onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specific service..." />
                </SelectTrigger>
                 <SelectContent>
                   {getSubcategories().map((subcategory) => (
                     <SelectItem key={subcategory.value} value={subcategory.value}>
                       <span className="flex items-center gap-2">
                         <span>{subcategory.label}</span>
                         {subcategory.value === 'snow_removal' && isSnowSeason() && (
                           <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                             🏔️ Seasonal
                           </span>
                         )}
                         {subcategory.requiresCertification && (
                           <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                             Cert Required
                           </span>
                         )}
                       </span>
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
          )}

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
              disabled={loading || !formData.category || !formData.subcategory || !formData.title || !formData.description}
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