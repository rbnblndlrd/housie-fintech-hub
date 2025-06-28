
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  TrendingUp, 
  MapPin,
  Filter,
  Plus,
  Search,
  Clock,
  Activity,
  Calendar
} from 'lucide-react';

interface InteractiveMapRightPanelProps {
  currentRole: 'customer' | 'provider';
  showHeatZones: boolean;
  onHeatZonesToggle: (checked: boolean) => void;
}

const professionOptions = [
  { value: 'all', label: 'All Services' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'handyman', label: 'Handyman' },
  { value: 'lawncare', label: 'Lawn Care' },
  { value: 'moving', label: 'Moving' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'security', label: 'Security' }
];

const InteractiveMapRightPanel: React.FC<InteractiveMapRightPanelProps> = ({
  currentRole,
  showHeatZones,
  onHeatZonesToggle
}) => {
  const [selectedProfession, setSelectedProfession] = React.useState('all');
  const [demandThreshold, setDemandThreshold] = React.useState([0]);

  const emergencyJobsCount = 4;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Emergency Jobs Box */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-700 flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4" />
              🚨 Urgent Jobs Available
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-red-600">{emergencyJobsCount}</span>
              <Badge variant="destructive" className="animate-pulse">
                Same Day
              </Badge>
            </div>
            <p className="text-xs text-red-600 mb-3">
              Emergency and same-day requests available in your area
            </p>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              disabled={currentRole === 'customer'}
            >
              {currentRole === 'provider' ? 'Quick Apply' : 'Switch to Provider'}
            </Button>
          </CardContent>
        </Card>

        {/* Service Filters & Demand Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Service Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div>
              <Label className="text-xs text-gray-600 mb-2 block">Service Type</Label>
              <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {professionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-gray-600">Min Demand</Label>
                <span className="text-xs text-gray-600">{demandThreshold[0]}%</span>
              </div>
              <Slider
                value={demandThreshold}
                onValueChange={setDemandThreshold}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {currentRole === 'provider' ? (
              <>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Update Availability
                </Button>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Find Work
                </Button>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Expand Service Area
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Find Services
                </Button>
                <Button size="sm" className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Heat Zones Toggle */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Heat Zones Control
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-red-500 rounded-full"></div>
                <Label htmlFor="heat-zones-toggle" className="text-sm font-medium">
                  Heat Zones
                </Label>
              </div>
              <Switch
                id="heat-zones-toggle"
                checked={showHeatZones}
                onCheckedChange={onHeatZonesToggle}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {showHeatZones ? 'Showing' : 'Hiding'} market demand by neighborhood
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveMapRightPanel;
