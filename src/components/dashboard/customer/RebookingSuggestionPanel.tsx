import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, Calendar, MessageCircle, Heart } from 'lucide-react';
import RebookingModal from '@/components/modals/RebookingModal';

const RebookingSuggestionPanel = () => {
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);
  // Mock data - in real app this would come from service_connections table
  const trustedProviders = [
    {
      id: '1',
      name: 'Jean Dubois',
      avatar: '/avatars/jean.jpg',
      rating: 4.9,
      lastJobDate: '2024-01-15',
      lastJobType: 'House Cleaning',
      totalJobs: 3,
      canMessage: true
    },
    {
      id: '2',
      name: 'Marie Tremblay',
      avatar: '/avatars/marie.jpg',
      rating: 4.8,
      lastJobDate: '2024-01-08',
      lastJobType: 'Garden Maintenance',
      totalJobs: 2,
      canMessage: true
    },
    {
      id: '3',
      name: 'Pierre Gagnon',
      avatar: '/avatars/pierre.jpg',
      rating: 4.7,
      lastJobDate: '2023-12-20',
      lastJobType: 'Home Repairs',
      totalJobs: 1,
      canMessage: false
    }
  ];

  const formatLastJob = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Trusted Providers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trustedProviders.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No trusted connections yet</p>
            <p className="text-sm text-muted-foreground">
              Complete a few jobs to build your trusted provider network
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trustedProviders.map((provider) => (
              <div key={provider.id} className="fintech-inner-box p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{provider.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{provider.rating}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <div>Last: {provider.lastJobType}</div>
                      <div>{formatLastJob(provider.lastJobDate)} • {provider.totalJobs} jobs</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <RebookingModal 
                        provider={provider}
                        lastJobData={{
                          category: provider.lastJobType,
                          address: '123 Previous Address', // Would come from last booking
                          checklist: null // Previous checklist if exists
                        }}
                        onSuccess={() => window.location.reload()}
                      >
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onMouseEnter={() => setHoveredProvider(provider.id)}
                          onMouseLeave={() => setHoveredProvider(null)}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Book Again
                        </Button>
                      </RebookingModal>
                      
                      {provider.canMessage ? (
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm" disabled>
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Complete a job and review each other to unlock messaging!</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              View All Connections
            </Button>
          </div>
        )}
        
        {/* Hover tooltip for Annette commentary */}
        {hoveredProvider && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-primary">
              💕 Annette: "You and {trustedProviders.find(p => p.id === hoveredProvider)?.name}? Match made in booking heaven!"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RebookingSuggestionPanel;