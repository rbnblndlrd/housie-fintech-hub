import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Clock, Shield, UserPlus } from 'lucide-react';

interface Cluster {
  id: string;
  title: string;
  service_type: string;
  location: string;
  requires_verification: boolean;
}

interface JoinClusterModalProps {
  cluster: Cluster;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const JoinClusterModal: React.FC<JoinClusterModalProps> = ({
  cluster,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: 'Alpha' + Math.floor(Math.random() * 100),
    unit_id: '',
    preferred_time_blocks: [] as string[],
    special_instructions: ''
  });

  const timeBlockOptions = [
    'Early Morning (6-9 AM)',
    'Morning (9-12 PM)', 
    'Afternoon (12-5 PM)',
    'Evening (5-8 PM)'
  ];

  const handleTimeBlockToggle = (blockId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferred_time_blocks: checked 
        ? [...prev.preferred_time_blocks, blockId]
        : prev.preferred_time_blocks.filter(id => id !== blockId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate joining cluster
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Joined Successfully!",
        description: `You've joined "${cluster.title}". You'll be notified when it's activated.`
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join cluster. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Join Cluster
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cluster Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              {cluster.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {cluster.service_type} • {cluster.location}
            </p>
            {cluster.requires_verification && (
              <Badge variant="outline" className="mt-2 flex items-center gap-1 w-fit">
                <Shield className="h-3 w-3" />
                Verification Required
              </Badge>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder="Your display name for this cluster"
                required
              />
              <p className="text-xs text-muted-foreground">
                This name will be visible to other participants and the organizer
              </p>
            </div>

            {/* Unit ID */}
            <div className="space-y-2">
              <Label htmlFor="unit_id">Unit/Apartment ID (Optional)</Label>
              <Input
                id="unit_id"
                value={formData.unit_id}
                onChange={(e) => setFormData(prev => ({ ...prev, unit_id: e.target.value }))}
                placeholder="e.g., 3A, Unit 12, etc."
              />
              <p className="text-xs text-muted-foreground">
                Only shared with provider after job acceptance
              </p>
            </div>

            {/* Time Block Preferences */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time Blocks
              </Label>
              <div className="space-y-2">
                {timeBlockOptions.map(block => (
                  <div key={block} className="flex items-center space-x-2">
                    <Checkbox
                      id={block}
                      checked={formData.preferred_time_blocks.includes(block)}
                      onCheckedChange={(checked) => handleTimeBlockToggle(block, checked as boolean)}
                    />
                    <Label htmlFor={block} className="text-sm font-normal">
                      {block}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="special_instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Joining...' : 'Join Cluster'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinClusterModal;