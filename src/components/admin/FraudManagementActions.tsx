
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Ban, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface FraudManagementActionsProps {
  reviewItem: any;
  onUpdate: () => void;
}

const FraudManagementActions: React.FC<FraudManagementActionsProps> = ({ reviewItem, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcessReview = async () => {
    if (!action || !reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select an action and provide a reason.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Update review queue item
      const { error: reviewError } = await supabase
        .from('review_queue')
        .update({
          status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending',
          reviewed_at: new Date().toISOString(),
          review_notes: reason,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', reviewItem.id);

      if (reviewError) throw reviewError;

      // If blocking user, create user block record
      if (action === 'block') {
        const { error: blockError } = await supabase
          .from('user_blocks')
          .insert({
            user_id: reviewItem.user_id,
            reason: reason,
            block_type: 'review_pending',
            fraud_session_id: reviewItem.fraud_session_id
          });

        if (blockError) throw blockError;
      }

      toast({
        title: "Review Processed",
        description: `Review item has been ${action}ed successfully.`,
      });

      setIsDialogOpen(false);
      setAction('');
      setReason('');
      onUpdate();
    } catch (error) {
      console.error('Error processing review:', error);
      toast({
        title: "Error",
        description: "Failed to process review item.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'approve':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reject':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'block':
        return <Ban className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Shield className="h-4 w-4 mr-1" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Fraud Alert</DialogTitle>
          <DialogDescription>
            Process this fraud alert for user: {reviewItem.users?.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Risk Score</p>
            <Badge variant="destructive">{reviewItem.risk_score}</Badge>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Action Type</p>
            <Badge variant="outline">{reviewItem.action_type}</Badge>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Decision</p>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">
                  <div className="flex items-center gap-2">
                    {getActionIcon('approve')}
                    Approve
                  </div>
                </SelectItem>
                <SelectItem value="reject">
                  <div className="flex items-center gap-2">
                    {getActionIcon('reject')}
                    Reject
                  </div>
                </SelectItem>
                <SelectItem value="block">
                  <div className="flex items-center gap-2">
                    {getActionIcon('block')}
                    Block User
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Reason</p>
            <Textarea
              placeholder="Explain your decision..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcessReview} 
            disabled={isProcessing || !action || !reason.trim()}
          >
            {isProcessing ? 'Processing...' : 'Submit Decision'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FraudManagementActions;
