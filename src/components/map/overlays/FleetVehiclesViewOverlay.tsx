
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Truck, Users, MapPin, Eye, Navigation, Crosshair } from 'lucide-react';
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
  if (!visible) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'en-route': return 'bg-blue-500';
      case 'on-job': return 'bg-orange-500';
      case 'returning': return 'bg-purple-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
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

  return (
    <div className={`absolute ${position} z-40 ${draggable ? 'cursor-move' : ''}`}>
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg min-w-[320px] max-w-[400px]">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fleet Vehicles</h3>
                <p className="text-xs text-gray-500">{activeVehicles.length} Active</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-6 w-6 p-0"
            >
              {minimized ? '📋' : '➖'}
            </Button>
          </div>

          {!minimized && (
            <>
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
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FleetVehiclesViewOverlay;
