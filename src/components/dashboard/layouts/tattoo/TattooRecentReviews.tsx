import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Camera, MessageCircle } from 'lucide-react';

const TattooRecentReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      client: 'Sarah Chen',
      rating: 5,
      date: '2 days ago',
      text: 'Absolutely amazing work! The minimalist design came out exactly as I envisioned. Professional and clean studio.',
      project: 'Minimalist florals',
      hasPhoto: true
    },
    {
      id: 2,
      client: 'Mike Rodriguez',
      rating: 5,
      date: '1 week ago',
      text: 'Third session of my sleeve and loving every minute. Attention to detail is incredible.',
      project: 'Traditional sleeve',
      hasPhoto: true
    },
    {
      id: 3,
      client: 'Emma Thompson',
      rating: 4,
      date: '2 weeks ago',
      text: 'Great experience overall. The watercolor technique is phenomenal. Minor scheduling mix-up but resolved quickly.',
      project: 'Watercolor piece',
      hasPhoto: false
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Recent Reviews
          <Badge variant="secondary">4.8 avg</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="fintech-inner-box p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {review.client.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{review.client}</div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{review.date}</div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium text-foreground">Project:</span> {review.project}
            </div>
            
            <p className="text-sm leading-relaxed mb-3">
              "{review.text}"
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {review.hasPhoto && (
                  <Badge variant="outline" className="text-xs">
                    <Camera className="h-3 w-3 mr-1" />
                    Photo included
                  </Badge>
                )}
              </div>
              
              <Button size="sm" variant="ghost" className="text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No recent reviews
          </div>
        )}
        
        <div className="text-center pt-2 border-t">
          <Button size="sm" variant="ghost">
            View All Reviews (23)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooRecentReviews;