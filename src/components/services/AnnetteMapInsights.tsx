import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types/service';
import { Sparkles, TrendingUp, MapPin, Users, Star, Clock, DollarSign, Award } from 'lucide-react';
import { 
  getAnnetteSuggestionsForFilters, 
  detectServiceClusters, 
  FilterContext,
  AnnetteInsight 
} from '@/utils/annetteInsights';

interface AnnetteMapInsightsProps {
  services: Service[];
  selectedLocation: string;
  activeFilters: number;
  filters: FilterContext;
  onInsightClick?: (insight: string) => void;
}

const AnnetteMapInsights: React.FC<AnnetteMapInsightsProps> = ({
  services,
  selectedLocation,
  activeFilters,
  filters,
  onInsightClick
}) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [insights, setInsights] = useState<AnnetteInsight[]>([]);

  useEffect(() => {
    generateSmartInsights();
  }, [services, selectedLocation, activeFilters, filters]);

  const generateSmartInsights = () => {
    // Detect clusters by proximity and category
    const clusters = detectServiceClusters(services);
    
    // Generate insights using centralized logic
    const newInsights = getAnnetteSuggestionsForFilters(services, filters, clusters);
    
    // Add icons to insights
    const insightsWithIcons = newInsights.map(insight => ({
      ...insight,
      icon: getIconForInsightType(insight.type)
    }));

    setInsights(insightsWithIcons);
    setCurrentInsight(0); // Reset to first insight when insights change
  };

  const getIconForInsightType = (type: string) => {
    switch (type) {
      case 'cluster':
        return <Users className="h-4 w-4" />;
      case 'hidden_gem':
        return <Star className="h-4 w-4" />;
      case 'price_tip':
        return <DollarSign className="h-4 w-4" />;
      case 'availability':
        return <Clock className="h-4 w-4" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4" />;
      case 'category_specific':
        return <Award className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const cycleInsights = () => {
    if (insights.length > 0) {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }
  };

  // Rotate insights every 8 seconds (increased from 5 seconds)
  useEffect(() => {
    if (insights.length > 1) {
      const interval = setInterval(cycleInsights, 8000);
      return () => clearInterval(interval);
    }
  }, [insights.length]);

  if (insights.length === 0) return null;

  const currentInsightData = insights[currentInsight];

  const handleInsightClick = () => {
    if (onInsightClick) {
      onInsightClick(currentInsightData.action);
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'cluster':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'hidden_gem':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'price_tip':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'availability':
        return 'from-orange-50 to-red-50 border-orange-200';
      case 'category_specific':
        return 'from-purple-50 to-violet-50 border-purple-200';
      default:
        return 'from-purple-50 to-blue-50 border-purple-200';
    }
  };

  return (
    <Card className={`fintech-card mb-6 bg-gradient-to-r ${getInsightColor(currentInsightData.type)} transition-all duration-500`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 transition-all duration-300">
              {currentInsightData.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {currentInsightData.title}
                </h4>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  Annette's Insight
                </Badge>
                {currentInsightData.category && (
                  <Badge variant="outline" className="text-xs">
                    {currentInsightData.category}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {currentInsightData.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleInsightClick}
                className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
              >
                {currentInsightData.action}
              </Button>
            </div>
          </div>
          
          {/* Enhanced insight counter with progress indication */}
          {insights.length > 1 && (
            <div className="flex flex-col items-center gap-2 ml-2">
              <div className="flex items-center gap-1">
                {insights.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentInsight ? 'bg-purple-600 scale-125' : 'bg-purple-200 hover:bg-purple-300'
                    }`}
                    onClick={() => setCurrentInsight(index)}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {currentInsight + 1} of {insights.length}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnetteMapInsights;