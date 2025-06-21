
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

interface EmergencyControlCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: (reason?: string) => void;
  disabled?: boolean;
  variant?: 'platform' | 'security' | 'communication' | 'recovery';
  lastActivated?: string | null;
  activatedBy?: string | null;
  requiresConfirmation?: boolean;
}

const EmergencyControlCard: React.FC<EmergencyControlCardProps> = ({
  title,
  description,
  icon,
  isActive,
  onToggle,
  disabled = false,
  variant = 'platform',
  lastActivated,
  activatedBy,
  requiresConfirmation = true
}) => {
  const [reason, setReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getVariantColors = () => {
    switch (variant) {
      case 'platform':
        return {
          card: 'border-blue-200',
          badge: isActive ? 'bg-blue-600' : 'bg-gray-400',
          button: isActive ? 'destructive' : 'default'
        };
      case 'security':
        return {
          card: 'border-red-200',
          badge: isActive ? 'bg-red-600' : 'bg-gray-400',
          button: isActive ? 'destructive' : 'secondary'
        };
      case 'communication':
        return {
          card: 'border-yellow-200',
          badge: isActive ? 'bg-yellow-600' : 'bg-gray-400',
          button: isActive ? 'destructive' : 'default'
        };
      case 'recovery':
        return {
          card: 'border-green-200',
          badge: isActive ? 'bg-green-600' : 'bg-gray-400',
          button: 'default'
        };
      default:
        return {
          card: 'border-gray-200',
          badge: isActive ? 'bg-gray-600' : 'bg-gray-400',
          button: isActive ? 'destructive' : 'default'
        };
    }
  };

  const colors = getVariantColors();

  const handleToggle = () => {
    if (!requiresConfirmation) {
      onToggle(reason || undefined);
      return;
    }

    if (isActive) {
      // If deactivating, don't require reason
      onToggle();
      setIsDialogOpen(false);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleConfirmedToggle = () => {
    onToggle(reason || undefined);
    setReason('');
    setIsDialogOpen(false);
  };

  return (
    <Card className={`${colors.card} transition-all duration-200 ${isActive ? 'shadow-lg' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <Badge className={`${colors.badge} text-white text-xs`}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{description}</p>
        
        {isActive && (lastActivated || activatedBy) && (
          <div className="text-xs text-gray-500 space-y-1">
            {lastActivated && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Activated: {new Date(lastActivated).toLocaleString()}</span>
              </div>
            )}
            {activatedBy && (
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>By: Admin</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={handleToggle}
              disabled={disabled}
            />
            <Label className="text-sm">
              {isActive ? 'Enabled' : 'Disabled'}
            </Label>
          </div>

          {variant === 'security' && isActive && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          )}
        </div>

        {requiresConfirmation && (
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Confirm Emergency Action
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to activate <strong>{title}</strong>. This action will be logged and all admin users will be notified.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for this emergency action..."
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmedToggle}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Activation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyControlCard;
