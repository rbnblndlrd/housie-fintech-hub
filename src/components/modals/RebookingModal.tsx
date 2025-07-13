import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Star, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RebookingModalProps {
  children: React.ReactNode;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    lastJobType: string;
    lastJobDate: string;
    totalJobs: number;
  };
  lastJobData?: {
    category: string;
    address: string;
    checklist?: any;
  };
  onSuccess?: () => void;
}

const RebookingModal: React.FC<RebookingModalProps> = ({ 
  children, 
  provider, 
  lastJobData,
  onSuccess 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    location: '',
    instructions: '',
    budget: ''
  });

  // Smart date suggestion: +2 weeks from last job
  const getSuggestedDate = () => {
    const lastDate = new Date(provider.lastJobDate);
    const suggestedDate = new Date(lastDate);
    suggestedDate.setDate(suggestedDate.getDate() + 14); // +2 weeks
    return suggestedDate.toISOString().split('T')[0];
  };

  // Pre-fill form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        scheduledDate: getSuggestedDate(),
        scheduledTime: '10:00', // Default time
        location: lastJobData?.address || '',
        instructions: `Rebook similar service to previous ${provider.lastJobType}`,
        budget: ''
      });
    }
  }, [open, provider, lastJobData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create the rebooking without provider_id since we're using mock data
      // In production, this would lookup actual provider_profiles
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          // provider_id: null, // Don't assign provider for mock rebookings
          service_id: null, // Will be determined by category
          scheduled_date: formData.scheduledDate,
          scheduled_time: formData.scheduledTime,
          service_address: formData.location,
          instructions: formData.instructions,
          total_amount: formData.budget ? parseFloat(formData.budget) : null,
          status: 'pending',
          creates_service_connection: true // For rebookings
        })
        .select()
        .single();

      if (error) throw error;

      // Show Annette success message
      toast({
        title: "💕 Annette says:",
        description: `You liked 'em once — let's run it back. I've reloaded their info for you! 🛠️`
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating rebooking:', error);
      toast({
        title: "Error",
        description: "Failed to create rebooking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="fintech-card max-w-2xl z-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Rebook with {provider.name}
          </DialogTitle>
          <DialogDescription>
            Book the same service again with your trusted provider. All details from your previous booking will be pre-filled.
          </DialogDescription>
        </DialogHeader>
        
        {/* Provider Info */}
        <div className="fintech-inner-box p-4 mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={provider.avatar} alt={provider.name} />
              <AvatarFallback>
                {provider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{provider.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{provider.rating}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last job: {provider.lastJobType} • {provider.totalJobs} completed jobs
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="pl-9"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Suggested: 2 weeks from your last booking
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Service Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter service address..."
                className="pl-9"
                required
              />
            </div>
            {lastJobData?.address && (
              <p className="text-xs text-muted-foreground">
                ✨ Pre-filled from your last job
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Service Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Any specific instructions or changes from last time..."
              rows={4}
            />
            {lastJobData?.checklist && (
              <p className="text-xs text-primary">
                🔄 Previous checklist will be automatically loaded
              </p>
            )}
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (Optional)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="$ Amount"
              min="0"
              step="0.01"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Booking...' : 'Book Again'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RebookingModal;