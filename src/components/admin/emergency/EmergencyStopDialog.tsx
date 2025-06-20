
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Shield } from 'lucide-react';

interface EmergencyStopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

const EmergencyStopDialog: React.FC<EmergencyStopDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'EMERGENCY STOP' || !reason.trim()) return;
    
    setIsConfirming(true);
    try {
      await onConfirm(reason);
      onOpenChange(false);
      setReason('');
      setConfirmText('');
    } finally {
      setIsConfirming(false);
    }
  };

  const canConfirm = confirmText === 'EMERGENCY STOP' && reason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Emergency Stop Confirmation
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This will immediately disable all expensive features and external API calls. 
            Use this only in case of emergency to prevent unexpected costs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">What will be disabled:</h4>
                <ul className="text-sm text-red-800 mt-2 space-y-1">
                  <li>• Claude AI and OpenAI APIs</li>
                  <li>• AI Assistant features</li>
                  <li>• External integrations</li>
                  <li>• Maps and location services</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason for emergency stop *</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Unexpected high API costs, system malfunction..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirm">Type "EMERGENCY STOP" to confirm *</Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="EMERGENCY STOP"
              className="mt-1 font-mono"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canConfirm || isConfirming}
            className="bg-red-600 hover:bg-red-700"
          >
            {isConfirming ? 'Activating...' : 'EMERGENCY STOP'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyStopDialog;
