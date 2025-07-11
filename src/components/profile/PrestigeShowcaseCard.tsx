import React, { useState, useEffect } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Star, 
  Award,
  Crown,
  Heart,
  Settings,
  Quote,
  Info
} from 'lucide-react';

interface PrestigeShowcaseCardProps {
  profile: UnifiedUserProfile;
  isEditing: boolean;
}

const PrestigeShowcaseCard: React.FC<PrestigeShowcaseCardProps> = ({ profile, isEditing }) => {
  const [selectedDisplay, setSelectedDisplay] = useState('Quality Expert');
  const [featuredReview, setFeaturedReview] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  // Achievement logic with proper thresholds
  const achievements = [
    { 
      name: 'Trusted Member', 
      icon: Award, 
      color: 'text-blue-600', 
      earned: profile.verified || false,
      description: 'Profile verified and trusted by HOUSIE'
    },
    { 
      name: 'Quality Expert', 
      icon: Star, 
      color: 'text-yellow-600', 
      earned: (profile.average_rating || 0) >= 4.7 && (profile.total_reviews || 0) >= 5,
      description: 'Earned 4.7+ star rating with 5+ reviews'
    },
    { 
      name: 'Reliable Pro', 
      icon: Trophy, 
      color: 'text-green-600', 
      earned: (profile.total_bookings || 0) >= 10,
      description: 'Successfully completed 10+ bookings'
    },
    { 
      name: 'Community Favorite', 
      icon: Heart, 
      color: 'text-red-600', 
      earned: (profile.community_rating_points || 0) >= 50,
      description: 'Earned 50+ community rating points'
    }
  ];

  // Fetch real featured review
  useEffect(() => {
    const fetchFeaturedReview = async () => {
      if (!profile.user_id) return;
      
      setLoadingReview(true);
      try {
        // Get provider profile ID first
        const { data: providerProfile } = await supabase
          .from('provider_profiles')
          .select('id')
          .eq('user_id', profile.user_id)
          .single();

        if (providerProfile) {
          const { data: reviews } = await supabase
            .from('reviews')
            .select(`
              rating,
              comment,
              created_at,
              reviewer_id
            `)
            .eq('provider_id', providerProfile.id)
            .gte('rating', 4.5)
            .not('comment', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1);

          if (reviews && reviews.length > 0) {
            const review = reviews[0];
            setFeaturedReview({
              rating: review.rating,
              text: review.comment,
              customerName: 'Customer', // Anonymous for privacy
              date: new Date(review.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })
            });
          }
        }
      } catch (error) {
        console.error('Error fetching featured review:', error);
      }
      setLoadingReview(false);
    };

    fetchFeaturedReview();
  }, [profile.user_id]);

  const latestAchievement = achievements.find(a => a.earned && a.name === selectedDisplay) || achievements[1];
  const overallRating = profile.average_rating || 4.8;

  return (
    <TooltipProvider>
      <Card className="bg-slate-50 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Prestige Showcase
            </CardTitle>
            {isEditing && (
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Choose Display
              </Button>
            )}
          </div>
        </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Latest Achievement */}
        <div className="p-3 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 border border-yellow-200/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100/80 rounded-full">
              <latestAchievement.icon className={`h-4 w-4 ${latestAchievement.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Latest Achievement</p>
              <p className="text-xs text-muted-foreground">{latestAchievement.name}</p>
            </div>
          </div>
        </div>

        {/* Chosen Recognition Display with Hover Tooltip */}
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Recognition Display</p>
            <div className="flex items-center gap-2">
              {selectedDisplay === 'Quality Expert' && <Star className="h-4 w-4 text-yellow-500" />}
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {achievements.find(a => a.name === selectedDisplay)?.description || 
                     'Achievement earned through excellent service'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-100/80 text-yellow-800 border-yellow-200">
            {selectedDisplay} ⭐
          </Badge>
        </div>

        {/* Overall Star Rating */}
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Overall Rating</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.floor(overallRating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({profile.total_reviews || 0} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">{overallRating}</div>
              <div className="text-xs text-muted-foreground">out of 5</div>
            </div>
          </div>
        </div>

        {/* Featured Customer Review */}
        <div className="p-3 bg-blue-50/30 border border-blue-200/50 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <Quote className="h-3 w-3 text-blue-600 mt-0.5 shrink-0" />
            <div className="w-full">
              <p className="text-sm font-medium text-foreground mb-1">Featured Review</p>
              {loadingReview ? (
                <div className="animate-pulse">
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ) : featuredReview ? (
                <>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "{featuredReview.text}"
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      - {featuredReview.customerName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {featuredReview.date}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Complete your first booking to showcase customer reviews
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};

export default PrestigeShowcaseCard;