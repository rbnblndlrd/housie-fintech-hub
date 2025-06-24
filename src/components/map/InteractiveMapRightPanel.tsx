
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
  Users, 
  DollarSign,
  MapPin,
  AlertTriangle,
  Filter
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
  const userArea = "Plateau-Mont-Royal";
  const marketDemand = "High";
  const avgRate = currentRole === 'provider' ? 45 : 50;
  const competition = "Medium";

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

        {/* Location Analytics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Your Area:</span>
                <span className="text-sm font-medium">{userArea}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600">Demand</span>
                </div>
                <div className="font-medium text-green-600">{marketDemand}</div>
              </div>

              <div className="bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-600">Avg Rate</span>
                </div>
                <div className="font-medium text-blue-600">${avgRate}/hr</div>
              </div>

              <div className="bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-orange-600" />
                  <span className="text-gray-600">Competition</span>
                </div>
                <div className="font-medium text-orange-600">{competition}</div>
              </div>

              <div className="bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <AlertTriangle className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600">Opportunity</span>
                </div>
                <div className="font-medium text-green-600">High</div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
              <div className="text-xs text-green-700 font-medium mb-1">
                Market Insight
              </div>
              <p className="text-xs text-green-600">
                {currentRole === 'provider' 
                  ? 'High demand for handyman services. Consider expanding to this area.' 
                  : 'Great area with reliable service providers. Average response time: 2 hours.'
                }
              </p>
            </div>
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
