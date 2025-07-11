import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Share2, Trophy, Star, ThumbsUp } from 'lucide-react';

const SocialContent = () => {
  const recentReviews = [
    {
      customer: 'Marie C.',
      rating: 5,
      comment: 'Excellent cleaning service! Very thorough and professional.',
      service: 'House Cleaning',
      date: '2 days ago'
    },
    {
      customer: 'John D.',
      rating: 5,
      comment: 'Fixed my sink perfectly and explained the issue clearly.',
      service: 'Plumbing Repair',
      date: '1 week ago'
    },
    {
      customer: 'Lisa M.',
      rating: 4,
      comment: 'Great work on the garden cleanup. Highly recommend!',
      service: 'Landscaping',
      date: '2 weeks ago'
    }
  ];

  const kudosReceived = [
    {
      from: 'Sarah M.',
      message: 'Thanks for the emergency snow removal last week! You saved the day!',
      type: 'kudos',
      date: '3 days ago',
      likes: 12
    },
    {
      from: 'Community',
      message: 'Congratulations on reaching 50 completed jobs in Cleaning services! 🎉',
      type: 'milestone',
      date: '1 week ago',
      likes: 24
    },
    {
      from: 'Mike T.',
      message: 'Great teamwork on the multi-unit cleaning project. Professional as always!',
      type: 'kudos',
      date: '2 weeks ago',
      likes: 8
    }
  ];

  const achievements = [
    {
      title: 'Lawncare Champion',
      description: 'Completed 25 landscaping jobs',
      date: '1 week ago',
      emoji: '🏆'
    },
    {
      title: 'Customer Favorite',
      description: 'Maintained 4.8+ rating for 30 days',
      date: '2 weeks ago',
      emoji: '⭐'
    },
    {
      title: 'Early Bird',
      description: 'Completed 10 morning jobs',
      date: '3 weeks ago',
      emoji: '🌅'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Social Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">4.9</p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">Kudos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.map((review, index) => (
              <div key={index} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{review.customer}</h3>
                    <Badge variant="secondary" className="text-xs">{review.service}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">"{review.comment}"</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Community Kudos */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Community Kudos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kudosReceived.map((kudo, index) => (
              <div key={index} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{kudo.from}</h3>
                    <Badge variant={kudo.type === 'milestone' ? 'default' : 'secondary'} className="text-xs">
                      {kudo.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{kudo.date}</span>
                </div>
                <p className="text-sm mb-3">{kudo.message}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {kudo.likes}
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg text-center">
                <div className="text-4xl mb-2">{achievement.emoji}</div>
                <h3 className="font-medium mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialContent;