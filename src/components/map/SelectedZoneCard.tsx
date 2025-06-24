
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, TrendingDown, Minus, Home, Sprout, Heart, Dog, Truck, Snowflake, Sun, Leaf, MapPin } from 'lucide-react';

interface SelectedZoneCardProps {
  selectedZone: any;
  onClose: () => void;
}

// Get current season for dynamic updates
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

const getSeasonIcon = (season: string) => {
  switch (season) {
    case 'spring': return <Leaf className="h-3 w-3 text-green-500" />;
    case 'summer': return <Sun className="h-3 w-3 text-yellow-500" />;
    case 'fall': return <Leaf className="h-3 w-3 text-orange-500" />;
    default: return <Snowflake className="h-3 w-3 text-blue-500" />;
  }
};

const getServiceIcon = (service: string) => {
  switch (service) {
    case 'cleaning': return <Home className="h-4 w-4 text-blue-500" />;
    case 'lawncare': return <Sprout className="h-4 w-4 text-green-500" />;
    case 'wellness': return <Heart className="h-4 w-4 text-pink-500" />;
    case 'pet': return <Dog className="h-4 w-4 text-orange-500" />;
    case 'moving': return <Truck className="h-4 w-4 text-purple-500" />;
    default: return <Home className="h-4 w-4 text-gray-500" />;
  }
};

const getDemandLevel = (demand: number) => {
  if (demand >= 80) return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
  if (demand >= 60) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
  if (demand >= 40) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  return { level: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' };
};

const getTrendIcon = (trending: 'up' | 'down' | 'stable') => {
  switch (trending) {
    case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
    case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
    default: return <Minus className="h-3 w-3 text-gray-400" />;
  }
};

// Seasonal modifiers for services
const getSeasonalModifier = (service: string, season: string) => {
  const modifiers = {
    winter: {
      cleaning: { modifier: '+20%', reason: 'Holiday cleaning, indoor focus' },
      lawncare: { modifier: '-80%', reason: 'Snow removal replaces lawn care' },
      wellness: { modifier: '+15%', reason: 'Indoor wellness focus' },
      pet: { modifier: '+10%', reason: 'More indoor pet care' },
      moving: { modifier: '-30%', reason: 'Fewer winter moves' }
    },
    spring: {
      cleaning: { modifier: '+40%', reason: 'Spring cleaning season' },
      lawncare: { modifier: '+60%', reason: 'Lawn revival season' },
      wellness: { modifier: '+25%', reason: 'Spring wellness prep' },
      pet: { modifier: '+30%', reason: 'Outdoor pet activities' },
      moving: { modifier: '+50%', reason: 'Peak moving season' }
    },
    summer: {
      cleaning: { modifier: '+0%', reason: 'Baseline demand' },
      lawncare: { modifier: '+80%', reason: 'Peak lawn maintenance' },
      wellness: { modifier: '+20%', reason: 'Summer wellness focus' },
      pet: { modifier: '+25%', reason: 'Active pet season' },
      moving: { modifier: '+30%', reason: 'High moving activity' }
    },
    fall: {
      cleaning: { modifier: '+30%', reason: 'Back-to-school deep clean' },
      lawncare: { modifier: '+40%', reason: 'Fall cleanup season' },
      wellness: { modifier: '+10%', reason: 'Wellness prep for winter' },
      pet: { modifier: '+15%', reason: 'Pre-winter pet prep' },
      moving: { modifier: '+20%', reason: 'School-related moves' }
    }
  };

  return modifiers[season]?.[service] || { modifier: '+0%', reason: 'Baseline demand' };
};

const SelectedZoneCard: React.FC<SelectedZoneCardProps> = ({ selectedZone, onClose }) => {
  if (!selectedZone) return null;

  const currentSeason = getCurrentSeason();
  const seasonName = currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1);

  // Service demand data with seasonal adjustments
  const services = [
    { 
      key: 'cleaning', 
      name: 'Cleaning Services', 
      demand: selectedZone.keyServices?.cleaning?.demand || 75,
      trending: selectedZone.keyServices?.cleaning?.trending || 'up',
      avgRate: selectedZone.keyServices?.cleaning?.avgRate || 45,
      context: selectedZone.zoneType === 'residential' ? 'High apartment turnover' : 'Commercial focus'
    },
    { 
      key: 'lawncare', 
      name: 'Lawn Care', 
      demand: selectedZone.keyServices?.lawncare?.demand || 45,
      trending: selectedZone.keyServices?.lawncare?.trending || 'stable',
      avgRate: selectedZone.keyServices?.lawncare?.avgRate || 35,
      context: selectedZone.zoneType === 'residential' ? 'Suburban yards' : 'Limited outdoor space'
    },
    { 
      key: 'wellness', 
      name: 'Wellness/Massage', 
      demand: selectedZone.zoneType === 'premium' ? 85 : 55,
      trending: 'up',
      avgRate: selectedZone.zoneType === 'premium' ? 120 : 75,
      context: selectedZone.zoneType === 'premium' ? 'Affluent clientele' : 'Growing market'
    },
    { 
      key: 'pet', 
      name: 'Pet Services', 
      demand: selectedZone.zoneType === 'residential' ? 70 : 40,
      trending: 'up',
      avgRate: 40,
      context: selectedZone.zoneType === 'residential' ? 'Family neighborhood' : 'Limited pet ownership'
    },
    { 
      key: 'moving', 
      name: 'Moving Services', 
      demand: selectedZone.keyServices?.moving?.demand || 60,
      trending: selectedZone.keyServices?.moving?.trending || 'stable',
      avgRate: selectedZone.keyServices?.moving?.avgRate || 120,
      context: selectedZone.vacancyRate < 1 ? 'High turnover' : 'Moderate activity'
    }
  ];

  return (
    <div className="absolute top-4 right-4 z-30 w-96">
      <Card className="fintech-card shadow-2xl border-2">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{selectedZone.name}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {selectedZone.zoneType || 'Mixed'} Zone
              </Badge>
              <Badge 
                variant="secondary" 
                className={`${selectedZone.demandLevel === 'high' ? 'bg-red-100 text-red-800' : 
                           selectedZone.demandLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-gray-100 text-gray-800'}`}
              >
                {selectedZone.demandLevel || 'Medium'} Demand
              </Badge>
            </div>
          </div>

          {/* Market Overview */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-xl text-green-600">${selectedZone.avgRent || 2100}</div>
                <div className="text-gray-600">Avg Rent</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-blue-600">{selectedZone.vacancyRate || 1.5}%</div>
                <div className="text-gray-600">Vacancy Rate</div>
              </div>
            </div>
          </div>

          {/* Current Season Banner */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 border-b">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              {getSeasonIcon(currentSeason)}
              <span>Current Season: {seasonName}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Seasonal demand adjustments are applied below
            </p>
          </div>

          {/* Service Breakdown */}
          <div className="p-4">
            <h4 className="font-semibold text-sm mb-3">Service Demand Breakdown</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {services.map(service => {
                const demandInfo = getDemandLevel(service.demand);
                const seasonalInfo = getSeasonalModifier(service.key, currentSeason);
                
                return (
                  <div key={service.key} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(service.key)}
                        <span className="font-medium text-sm">{service.name}</span>
                        {getTrendIcon(service.trending)}
                      </div>
                      <Badge className={`${demandInfo.bg} ${demandInfo.color} text-xs`}>
                        {demandInfo.level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Base: {service.demand}% demand</span>
                      <span className="font-medium">${service.avgRate}/hr</span>
                    </div>
                    
                    <div className="text-xs text-gray-700 mb-1">
                      📍 {service.context}
                    </div>
                    
                    <div className="bg-blue-50 rounded p-2 text-xs">
                      <div className="flex items-center gap-1 font-medium text-blue-800">
                        <span>🗓️ {seasonName} Impact: {seasonalInfo.modifier}</span>
                      </div>
                      <div className="text-blue-600 mt-1">{seasonalInfo.reason}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <Button className="w-full fintech-button-primary">
              <MapPin className="h-4 w-4 mr-2" />
              Target This Zone
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedZoneCard;
