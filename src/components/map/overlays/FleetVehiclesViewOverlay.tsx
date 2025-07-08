
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Truck, Users, MapPin, Eye, Navigation, Crosshair, X, GripVertical } from 'lucide-react';
import { FleetVehicle } from '@/hooks/useFleetVehicles';

interface FleetVehiclesViewOverlayProps {
  position: string;
  visible: boolean;
  minimized: boolean;
  draggable: boolean;
  onMinimize: () => void;
  fleetVehicles: FleetVehicle[];
  followFleet: boolean;
  onToggleFollowFleet: (enabled: boolean) => void;
  onCenterOnFleet: () => void;
  onFocusVehicle: (vehicleId: string) => void;
}

export const FleetVehiclesViewOverlay: React.FC<FleetVehiclesViewOverlayProps> = ({
  position,
  visible,
  minimized,
  draggable,
  onMinimize,
  fleetVehicles,
  followFleet,
  onToggleFollowFleet,
  onCenterOnFleet,
  onFocusVehicle
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-close after 10 seconds if not interacted with
    if (visible && !minimized) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => onMinimize(), 300);
      }, 10000);
      
      setAutoCloseTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [visible, minimized, onMinimize]);

  const handleUserInteraction = () => {
    // Clear auto-close timer on user interaction
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onMinimize(), 200);
  };

  if (!visible) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-600';
      case 'en-route': return 'bg-blue-600';
      case 'on-job': return 'bg-orange-600';
      case 'returning': return 'bg-purple-600';
      case 'offline': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'en-route': return 'En Route';
      case 'on-job': return 'On Job';
      case 'returning': return 'Returning';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const activeVehicles = fleetVehicles.filter(v => v.status !== 'offline');
  const availableCount = fleetVehicles.filter(v => v.status === 'available').length;
  const busyCount = fleetVehicles.filter(v => ['on-job', 'en-route'].includes(v.status)).length;

  if (minimized) {
    return (
      <div className={`absolute ${position} z-40`}>
        <Button
          variant="default"
          size="sm"
          onClick={onMinimize}
          className="bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600 flex items-center gap-2"
        >
          <Truck className="h-4 w-4" />
          Fleet ({activeVehicles.length})
        </Button>
      </div>
    );
  }

  return (
    <Card 
      className={`bg-white/95 backdrop-blur-sm border shadow-lg min-w-[340px] max-w-[400px] pointer-events-auto transition-all duration-300 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      onMouseEnter={handleUserInteraction}
      onClick={handleUserInteraction}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4" data-draggable-header={draggable}>
          <div className="flex items-center gap-2">
            {draggable && (
              <GripVertical 
                className="h-4 w-4 text-gray-400 cursor-grab" 
                data-grip="true"
              />
            )}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fleet Vehicles</h3>
              <p className="text-xs text-gray-500">{activeVehicles.length} Active</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-6 w-6 p-0"
              title="Minimize"
            >
              ➖
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-red-100"
              title="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Fleet Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{availableCount}</div>
            <div className="text-xs text-green-700">Available</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{busyCount}</div>
            <div className="text-xs text-orange-700">Busy</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{activeVehicles.length}</div>
            <div className="text-xs text-blue-700">Total</div>
          </div>
        </div>

        {/* Fleet Controls */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Follow Fleet</span>
            </div>
            <Switch
              checked={followFleet}
              onCheckedChange={onToggleFollowFleet}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onCenterOnFleet}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs"
              size="sm"
            >
              <Crosshair className="h-3 w-3 mr-1" />
              Center on Fleet
            </Button>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {fleetVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: vehicle.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{vehicle.driverName}</span>
                    <Badge 
                      variant="secondary"
                      className={`text-xs ${getStatusColor(vehicle.status)} text-white`}
                    >
                      {getStatusLabel(vehicle.status)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {vehicle.vehicleNumber}
                  </div>
                  {vehicle.currentJob && (
                    <div className="text-xs text-blue-600 mt-1">
                      {vehicle.currentJob}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFocusVehicle(vehicle.id)}
                className="h-8 w-8 p-0"
                title="Focus on vehicle"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Auto-close indicator */}
        {!isClosing && autoCloseTimer && (
          <div className="mt-3 pt-2 border-t">
            <p className="text-xs text-gray-500 text-center">
              Auto-closing in a few seconds. Click to keep open.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FleetVehiclesViewOverlay;
