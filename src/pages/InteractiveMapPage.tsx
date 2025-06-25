
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from '@/components/Header';
import HeatZoneMap from '@/components/HeatZoneMap';
import InteractiveMapRightPanel from '@/components/map/InteractiveMapRightPanel';
import InteractiveMapBottomPanel from '@/components/map/InteractiveMapBottomPanel';
import DraggableLayoutSystem from '@/components/map/DraggableLayoutSystem';
import { usePremiumLayout } from '@/hooks/usePremiumLayout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  Star
} from 'lucide-react';

const InteractiveMapPage = () => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const { isPremium, loadSavedLayout, saveLayout } = usePremiumLayout();
  const [showHeatZones, setShowHeatZones] = useState(true);
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [demandThreshold, setDemandThreshold] = useState([0]);

  console.log('🗺️ InteractiveMapPage render:', { user: !!user, currentRole, isPremium });

  const handleHeatZonesToggle = (checked: boolean) => {
    setShowHeatZones(checked);
    console.log('Heat zones visibility changed:', checked);
    
    toast({
      title: checked ? "Heat Zones Enabled" : "Heat Zones Disabled",
      description: checked 
        ? "Now showing market demand by Montreal neighborhood" 
        : "Heat zones are now hidden from the map",
    });
  };

  // Emergency Jobs Panel Content
  const emergencyJobsContent = (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-red-600">4</span>
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
    </div>
  );

  // Market Insights Panel Content
  const marketInsightsContent = (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-gray-600 mb-2 block">Service Type</Label>
        <Select value={selectedProfession} onValueChange={setSelectedProfession}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="handyman">Handyman</SelectItem>
            <SelectItem value="lawncare">Lawn Care</SelectItem>
            <SelectItem value="moving">Moving</SelectItem>
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
          onCheckedChange={handleHeatZonesToggle}
        />
      </div>
      <p className="text-xs text-gray-600">
        {showHeatZones ? 'Showing' : 'Hiding'} market demand by neighborhood
      </p>
    </div>
  );

  // Quick Actions Panel Content
  const quickActionsContent = (
    <div className="space-y-2">
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
    </div>
  );

  // Regional Trends Card Content
  const regionalTrendsContent = (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">↗ 15%</div>
          <div className="text-xs text-gray-600">Demand Growth</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">2.3 hrs</div>
          <div className="text-xs text-gray-600">Avg Response</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">4.8★</div>
          <div className="text-xs text-gray-600">Area Rating</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Cleaning Services</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">High Demand</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Handyman Work</span>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">Medium Demand</Badge>
        </div>
      </div>
    </div>
  );

  // Location Analytics Content
  const locationAnalyticsContent = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-gray-600">Demand</span>
          </div>
          <div className="font-medium text-green-600">High</div>
        </div>

        <div className="bg-gray-50 p-2 rounded">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3 text-blue-600" />
            <span className="text-gray-600">Avg Rate</span>
          </div>
          <div className="font-medium text-blue-600">$45/hr</div>
        </div>
      </div>

      <div className="p-2 bg-green-50 rounded border border-green-200">
        <div className="text-xs text-green-700 font-medium mb-1">
          Market Insight
        </div>
        <p className="text-xs text-green-600">
          High demand for services in Plateau-Mont-Royal area.
        </p>
      </div>
    </div>
  );

  // Recent Activity Content
  const recentActivityContent = (
    <div className="space-y-2">
      {[
        { title: 'Apartment Cleaning', location: 'Plateau-Mont-Royal', time: '5 min ago', status: 'new' },
        { title: 'Handyman Service', location: 'Downtown', time: '12 min ago', status: 'applied' },
        { title: 'Lawn Care', location: 'Westmount', time: '1 hr ago', status: 'confirmed' }
      ].map((activity, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-medium">{activity.title}</div>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  activity.status === 'new' ? 'border-green-200 text-green-700' :
                  activity.status === 'applied' ? 'border-blue-200 text-blue-700' :
                  'border-purple-200 text-purple-700'
                }`}
              >
                {activity.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {activity.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activity.time}
              </span>
            </div>
          </div>
          <Button size="sm" variant="ghost">
            <Star className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );

  // Define default box layout
  const defaultBoxes = [
    {
      id: 'emergency-jobs',
      title: '🚨 Urgent Jobs Available',
      content: emergencyJobsContent,
      position: 'right' as const,
      minimized: false,
      order: 1
    },
    {
      id: 'market-insights',
      title: '📊 Market Insights',
      content: marketInsightsContent,
      position: 'right' as const,
      minimized: false,
      order: 2
    },
    {
      id: 'quick-actions',
      title: '⚡ Quick Actions',
      content: quickActionsContent,
      position: 'right' as const,
      minimized: false,
      order: 3
    },
    {
      id: 'regional-trends',
      title: '📈 Regional Market Trends',
      content: regionalTrendsContent,
      position: 'bottom' as const,
      minimized: false,
      order: 4
    },
    {
      id: 'location-analytics',
      title: '📍 Location Analytics',
      content: locationAnalyticsContent,
      position: 'bottom' as const,
      minimized: false,
      order: 5
    },
    {
      id: 'recent-activity',
      title: '⚡ Recent Activity',
      content: recentActivityContent,
      position: 'bottom' as const,
      minimized: false,
      order: 6
    }
  ];

  const [boxes, setBoxes] = useState(() => loadSavedLayout(defaultBoxes));

  const handleLayoutChange = (newBoxes: typeof boxes) => {
    setBoxes(newBoxes);
    saveLayout(newBoxes);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 h-screen">
        <DraggableLayoutSystem
          boxes={boxes}
          onLayoutChange={handleLayoutChange}
          isPremium={isPremium}
        >
          <HeatZoneMap 
            userRole={currentRole} 
            showHeatZones={showHeatZones}
          />
        </DraggableLayoutSystem>
      </div>
    </div>
  );
};

export default InteractiveMapPage;
