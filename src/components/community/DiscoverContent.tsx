import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Zap } from 'lucide-react';

const DiscoverContent = () => {
  const featuredCategories = [
    { name: 'Cleaning', emoji: '🧹', providers: 42 },
    { name: 'Pet Care', emoji: '🐕', providers: 28 },
    { name: 'IT Support', emoji: '💻', providers: 15 },
    { name: 'Events', emoji: '🎉', providers: 33 }
  ];

  const nearbyProviders = [
    {
      name: 'Sarah M.',
      title: 'Sparkmate',
      service: 'Cleaning Services',
      distance: '2.3km',
      rating: 4.8,
      avatar: 'SM'
    },
    {
      name: 'Mike T.',
      title: 'Fixmaster',
      service: 'Handyman',
      distance: '3.1km',
      rating: 4.6,
      avatar: 'MT'
    },
    {
      name: 'Lisa K.',
      title: 'Greenthumb',
      service: 'Landscaping',
      distance: '1.8km',
      rating: 4.9,
      avatar: 'LK'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to the Network</h2>
            <p className="text-muted-foreground">Find service providers in your community and expand your professional network</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Categories */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Featured Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.emoji}</span>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.providers} providers</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Explore</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Nearby Providers */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Near You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {provider.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{provider.name}</h3>
                      <Badge variant="secondary" className="text-xs">{provider.title}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{provider.service}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{provider.distance}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">{provider.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscoverContent;