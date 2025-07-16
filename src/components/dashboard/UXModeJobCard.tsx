import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  Wrench, 
  Camera, 
  Calendar,
  Settings,
  Zap,
  Palette,
  Package,
  Timer,
  Brain,
  Vault,
  FileText,
  Star
} from 'lucide-react';
import { UXModeDefinition } from '@/types/uxModes';

interface Job {
  id: string;
  title: string;
  customer?: string;
  address?: string;
  priority?: string;
  status?: string;
  scheduledTime?: string;
  estimatedDuration?: string;
  total_amount?: number;
  service_type?: string;
}

interface UXModeJobCardProps {
  job: Job;
  mode: UXModeDefinition;
  onAction: (jobId: string, action: string) => void;
  className?: string;
}

export function UXModeJobCard({ job, mode, onAction, className = '' }: UXModeJobCardProps) {
  const getCardStyle = () => {
    switch (mode.cardStyle) {
      case 'compact':
        return 'p-3';
      case 'detailed':
        return 'p-5';
      case 'checklist':
        return 'p-4 space-y-3';
      case 'timeline':
        return 'p-4 border-l-4 border-primary/30';
      case 'gallery':
        return 'p-4 bg-gradient-to-br from-background to-muted/30';
      case 'diagnostic':
        return 'p-4 border border-amber-200 bg-amber-50/50';
      default:
        return 'p-4';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': case 'emergency': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'start-gps': return <Navigation className="h-4 w-4" />;
      case 'mark-complete': return <CheckCircle className="h-4 w-4" />;
      case 'view-client': return <User className="h-4 w-4" />;
      case 'start-session': return <Timer className="h-4 w-4" />;
      case 'start-diagnostic': return <Wrench className="h-4 w-4" />;
      case 'log-fix': return <FileText className="h-4 w-4" />;
      case 'check-gear': return <Package className="h-4 w-4" />;
      case 'go-live': return <Zap className="h-4 w-4" />;
      case 'estimate-load': return <Package className="h-4 w-4" />;
      case 'start-move': return <Navigation className="h-4 w-4" />;
      case 'view-vault': return <Vault className="h-4 w-4" />;
      case 'config-agent': return <Brain className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'start-gps': return 'Start GPS';
      case 'mark-complete': return 'Complete';
      case 'view-client': return 'Client Profile';
      case 'start-session': return 'Start Session';
      case 'start-diagnostic': return 'Diagnose';
      case 'log-fix': return 'Log Fix';
      case 'check-gear': return 'Check Gear';
      case 'go-live': return 'Go Live';
      case 'estimate-load': return 'Estimate Load';
      case 'start-move': return 'Start Move';
      case 'view-vault': return 'Open Vault';
      case 'config-agent': return 'Config Agent';
      default: return action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const renderModeSpecificContent = () => {
    switch (mode.id) {
      case 'route-hero':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Route optimized • Next: {job.address}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">GPS Ready</Badge>
              <Badge variant="outline" className="text-xs">Checklist: 0/5</Badge>
            </div>
          </div>
        );
      
      case 'client-room':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Client: {job.customer} • Session: {job.estimatedDuration}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Ambiance Set
              </Badge>
              <Badge variant="outline" className="text-xs">Regular Client</Badge>
            </div>
          </div>
        );
      
      case 'fixit-fieldboard':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>Issue: {job.service_type} • Diagnostic needed</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800">
                Parts TBD
              </Badge>
              <Badge variant="outline" className="text-xs">Photos Required</Badge>
            </div>
          </div>
        );
      
      case 'showtime-panel':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Event: {job.title} • Crew: 3 people</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs text-green-800 bg-green-100">
                Gear Ready
              </Badge>
              <Badge variant="outline" className="text-xs">T-30 mins</Badge>
            </div>
          </div>
        );
      
      case 'heavy-hauler':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Load: ~2.5 tons • Route: {job.estimatedDuration}</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs text-orange-800 bg-orange-100">
                Fragile Items
              </Badge>
              <Badge variant="outline" className="text-xs">GPS Tracked</Badge>
            </div>
          </div>
        );
      
      case 'agent-build-mode':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>Agent: {job.title} • Vault: Connected</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs text-purple-800 bg-purple-100">
                Canon Mode
              </Badge>
              <Badge variant="outline" className="text-xs">Training Active</Badge>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={`fintech-card hover:shadow-md transition-all duration-200 ${className}`}>
      <CardContent className={getCardStyle()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{job.scheduledTime || '9:00 AM'}</span>
              {job.priority && (
                <Badge className={getPriorityColor(job.priority)}>
                  {job.priority}
                </Badge>
              )}
            </div>
          </div>
          {job.total_amount && (
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                ${job.total_amount}
              </div>
              <div className="text-xs text-muted-foreground">
                {job.estimatedDuration || '2h'}
              </div>
            </div>
          )}
        </div>

        {/* Mode-specific content */}
        {renderModeSpecificContent()}

        {/* Customer info */}
        {job.customer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <User className="h-4 w-4" />
            <span>{job.customer}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
          {mode.primaryActions.map((action, index) => (
            <Button
              key={action}
              size="sm"
              variant={index === 0 ? "default" : "outline"}
              onClick={() => onAction(job.id, action)}
              className="flex items-center gap-2"
            >
              {getActionIcon(action)}
              <span className="hidden sm:inline">{getActionLabel(action)}</span>
            </Button>
          ))}
        </div>

        {/* Secondary actions */}
        {mode.secondaryActions && mode.secondaryActions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {mode.secondaryActions.map(action => (
              <Button
                key={action}
                size="sm"
                variant="ghost"
                onClick={() => onAction(job.id, action)}
                className="flex items-center gap-1 text-xs"
              >
                {getActionIcon(action)}
                <span className="hidden md:inline">{getActionLabel(action)}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}