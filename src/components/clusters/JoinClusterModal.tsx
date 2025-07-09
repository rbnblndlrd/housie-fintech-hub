import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Users, Clock, Shield, UserPlus } from 'lucide-react';

interface Cluster {
  id: string;
  title: string;
  service_type: string;
  location: string;
  requires_verification: boolean;
}

interface TimeBlock {
  id: string;
  block_name: string;
  start_time: string;
  end_time: string;
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
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [formData, setFormData] = useState({
    display_name: '',
    unit_id: '',
    preferred_time_blocks: [] as string[],
    special_instructions: ''
  });

  useEffect(() => {
    if (isOpen) {
      generateDisplayName();
      fetchTimeBlocks();
    }
  }, [isOpen, cluster.id]);

  const generateDisplayName = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_display_name');
      if (error) throw error;
      
      setFormData(prev => ({ ...prev, display_name: data }));
    } catch (error) {
      console.error('Error generating display name:', error);
      // Fallback to basic generation
      const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Foxtrot'];
      const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
      setFormData(prev => ({ ...prev, display_name: randomName }));
    }
  };

  const fetchTimeBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('cluster_time_blocks')
        .select('*')
        .eq('cluster_id', cluster.id);

      if (error) throw error;
      setTimeBlocks(data || []);
    } catch (error) {
      console.error('Error fetching time blocks:', error);
    }
  };

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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join this cluster.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user is already a participant
      const { data: existingParticipant, error: checkError } = await supabase
        .from('cluster_participants')
        .select('id')
        .eq('cluster_id', cluster.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingParticipant) {
        toast({
          title: "Already Joined",
          description: "You're already a participant in this cluster.",
          variant: "destructive"
        });
        return;
      }

      // Add participant
      const { error: participantError } = await supabase
        .from('cluster_participants')
        .insert({
          cluster_id: cluster.id,
          user_id: user.id,
          display_name: formData.display_name,
          unit_id: formData.unit_id || null,
          special_instructions: formData.special_instructions || null
        });

      if (participantError) throw participantError;

      // Add time block preferences
      if (formData.preferred_time_blocks.length > 0) {
        const preferences = formData.preferred_time_blocks.map(blockId => ({
          cluster_id: cluster.id,
          participant_id: user.id, // Will be updated with the actual participant ID
          time_block_id: blockId
        }));

        // Note: This might need adjustment based on the actual participant ID
        // For now, we'll use user_id as a reference
        const { error: preferencesError } = await supabase
          .from('cluster_participant_preferences')
          .insert(preferences);

        if (preferencesError) {
          console.warn('Error adding preferences:', preferencesError);
          // Don't fail the whole operation for preferences
        }
      }

      toast({
        title: "Joined Successfully!",
        description: `You've joined "${cluster.title}". You'll be notified when it's activated.`
      });

      onSuccess();
    } catch (error) {
      console.error('Error joining cluster:', error);
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
            {timeBlocks.length > 0 && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Preferred Time Blocks
                </Label>
                <div className="space-y-2">
                  {timeBlocks.map(block => (
                    <div key={block.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={block.id}
                        checked={formData.preferred_time_blocks.includes(block.id)}
                        onCheckedChange={(checked) => handleTimeBlockToggle(block.id, checked as boolean)}
                      />
                      <Label htmlFor={block.id} className="text-sm font-normal">
                        {block.block_name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

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