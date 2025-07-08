import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Award,
  Crown,
  Heart,
  Settings,
  Quote
} from 'lucide-react';

interface PrestigeShowcaseCardProps {
  profile: UnifiedUserProfile;
  isEditing: boolean;
}

const PrestigeShowcaseCard: React.FC<PrestigeShowcaseCardProps> = ({ profile, isEditing }) => {
  const [selectedDisplay, setSelectedDisplay] = useState('Quality Expert');

  // Mock data for achievements
  const achievements = [
    { name: 'Trusted Member', icon: Award, color: 'text-blue-600', earned: true },
    { name: 'Quality Expert', icon: Star, color: 'text-yellow-600', earned: true },
    { name: 'Reliable Pro', icon: Trophy, color: 'text-green-600', earned: true },
    { name: 'Community Favorite', icon: Heart, color: 'text-red-600', earned: false }
  ];

  const featuredReview = {
    rating: 5,
    text: "Exceptional service! Professional, on-time, and went above and beyond expectations. Highly recommend!",
    customerName: "Sarah M.",
    date: "Nov 2024"
  };

  const latestAchievement = achievements.find(a => a.earned && a.name === selectedDisplay) || achievements[1];
  const overallRating = profile.average_rating || 4.8;

  return (
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

        {/* Chosen Recognition Display */}
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Recognition Display</p>
            {selectedDisplay === 'Quality Expert' && <Star className="h-4 w-4 text-yellow-500" />}
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
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Featured Review</p>
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrestigeShowcaseCard;