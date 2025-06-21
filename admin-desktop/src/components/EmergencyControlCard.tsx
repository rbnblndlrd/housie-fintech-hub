
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    if (!requiresConfirmation || isActive) {
      // If deactivating or no confirmation required, toggle immediately
      onToggle();
      return;
    }

    if (showConfirmation) {
      onToggle('Desktop app emergency action');
      setShowConfirmation(false);
    } else {
      setShowConfirmation(true);
    }
  };

  return (
    <Card className={cn(colors.card, "transition-all duration-200", isActive ? "shadow-lg" : "")}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <Badge className={cn(colors.badge, "text-white text-xs")}>
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
                <span>By: Desktop Admin</span>
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

        {showConfirmation && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Confirm Emergency Action</span>
            </div>
            <p className="text-sm text-red-700 mb-3">
              You are about to activate <strong>{title}</strong>. This action will be logged.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleToggle}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyControlCard;
