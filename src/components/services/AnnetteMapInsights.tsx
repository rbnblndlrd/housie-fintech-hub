import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types/service';
import { Sparkles, TrendingUp, MapPin, Users, Star, Clock } from 'lucide-react';

interface AnnetteMapInsightsProps {
  services: Service[];
  selectedLocation: string;
  activeFilters: number;
  onInsightClick?: (insight: string) => void;
}

const AnnetteMapInsights: React.FC<AnnetteMapInsightsProps> = ({
  services,
  selectedLocation,
  activeFilters,
  onInsightClick
}) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [insights, setInsights] = useState<Array<{
    type: 'cluster' | 'hidden_gem' | 'price_tip' | 'availability' | 'trending';
    title: string;
    description: string;
    action: string;
    icon: React.ReactNode;
    priority: number;
  }>>([]);

  useEffect(() => {
    generateInsights();
  }, [services, selectedLocation, activeFilters]);

  const generateInsights = () => {
    const newInsights = [];

    // Cluster detection
    const locationGroups = services.reduce((acc, service) => {
      const city = service.provider?.user?.city || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clusters = Object.entries(locationGroups).filter(([_, count]) => count >= 3);
    if (clusters.length > 0) {
      const [topCity, count] = clusters[0];
      newInsights.push({
        type: 'cluster' as const,
        title: `${count} providers clustered in ${topCity}`,
        description: "Group booking could save you 15-20% on total costs!",
        action: "Explore cluster deals",
        icon: <Users className="h-4 w-4" />,
        priority: 1
      });
    }

    // Hidden gems (high rating, low booking count)
    const hiddenGems = services.filter(service => 
      service.provider?.average_rating && service.provider.average_rating >= 4.8 &&
      service.provider?.total_bookings && service.provider.total_bookings < 10
    );

    if (hiddenGems.length > 0) {
      newInsights.push({
        type: 'hidden_gem' as const,
        title: `Found ${hiddenGems.length} hidden gem${hiddenGems.length !== 1 ? 's' : ''}`,
        description: "New providers with perfect ratings and competitive rates!",
        action: "Show hidden gems",
        icon: <Star className="h-4 w-4" />,
        priority: 2
      });
    }

    // Price optimization
    const avgPrice = services.reduce((sum, s) => sum + (s.provider?.hourly_rate || s.base_price || 0), 0) / services.length;
    const budgetFriendly = services.filter(s => (s.provider?.hourly_rate || s.base_price || 0) < avgPrice * 0.8);
    
    if (budgetFriendly.length > 0) {
      newInsights.push({
        type: 'price_tip' as const,
        title: `${budgetFriendly.length} budget-friendly options`,
        description: `Average savings of $${Math.round(avgPrice * 0.2)}/hour compared to market average.`,
        action: "Filter by best value",
        icon: <TrendingUp className="h-4 w-4" />,
        priority: 3
      });
    }

    // Availability insights
    const availableToday = services.filter(s => s.provider?.verified); // Mock availability
    if (availableToday.length > 0) {
      newInsights.push({
        type: 'availability' as const,
        title: `${availableToday.length} providers available today`,
        description: "Need it done fast? These verified providers can start immediately.",
        action: "Book for today",
        icon: <Clock className="h-4 w-4" />,
        priority: 4
      });
    }

    // Location-specific insights
    if (selectedLocation !== 'all') {
      newInsights.push({
        type: 'trending' as const,
        title: `Trending in ${selectedLocation}`,
        description: "Most popular services this week: Cleaning, Handyman, Moving",
        action: "See trending",
        icon: <Sparkles className="h-4 w-4" />,
        priority: 5
      });
    }

    setInsights(newInsights.sort((a, b) => a.priority - b.priority));
  };

  const cycleInsights = () => {
    if (insights.length > 0) {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }
  };

  useEffect(() => {
    if (insights.length > 1) {
      const interval = setInterval(cycleInsights, 5000);
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

  return (
    <Card className="fintech-card mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
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
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {currentInsightData.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleInsightClick}
                className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
              >
                {currentInsightData.action}
              </Button>
            </div>
          </div>
          
          {/* Insight counter */}
          {insights.length > 1 && (
            <div className="flex items-center gap-1 ml-2">
              {insights.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentInsight ? 'bg-purple-600' : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnetteMapInsights;