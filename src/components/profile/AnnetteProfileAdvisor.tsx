import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UnifiedUserProfile } from '@/types/userProfile';
import { 
  User, 
  CheckCircle, 
  Star, 
  FileText, 
  Camera,
  Settings,
  Sparkles
} from 'lucide-react';

interface AnnetteProfileAdvisorProps {
  profile: UnifiedUserProfile;
  isProvider: boolean;
}

const AnnetteProfileAdvisor: React.FC<AnnetteProfileAdvisorProps> = ({ profile, isProvider }) => {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    const calculateCompletion = () => {
      let completed = 0;
      let total = isProvider ? 8 : 6; // More requirements for providers
      
      // Basic profile info
      if (profile.full_name) completed++;
      if (profile.bio || profile.description) completed++;
      if (profile.profile_image_url) completed++;
      if (profile.location) completed++;
      
      // Provider-specific
      if (isProvider) {
        if (profile.business_name) completed++;
        if (profile.hourly_rate && profile.hourly_rate > 0) completed++;
        if (profile.verified) completed++;
        if (profile.years_experience && profile.years_experience > 0) completed++;
      } else {
        // Customer-specific
        if (profile.phone) completed++;
        if (profile.website) completed++;
      }
      
      const percentage = Math.round((completed / total) * 100);
      setCompletionPercentage(percentage);
      
      // Generate Annette's suggestion
      if (percentage < 50) {
        setSuggestion("Your profile needs some love! Start with a profile photo and bio to make a great first impression.");
      } else if (percentage < 75) {
        if (isProvider) {
          setSuggestion("You're getting there! Adding verification will unlock bookings from elite customers.");
        } else {
          setSuggestion("Looking good! Complete your contact details to connect with top providers.");
        }
      } else if (percentage < 100) {
        setSuggestion("Almost perfect! Just a few more details and you'll have a complete professional profile.");
      } else {
        setSuggestion("Your profile is complete! You're ready to get the most out of HOUSIE.");
      }
    };

    calculateCompletion();
  }, [profile, isProvider]);

  const getColorClass = (percentage: number) => {
    if (percentage < 50) return 'text-red-600';
    if (percentage < 75) return 'text-orange-600';
    if (percentage < 100) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-primary/20 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Annette's Profile Insight</p>
              <span className={`text-sm font-bold ${getColorClass(completionPercentage)}`}>
                {completionPercentage}% complete
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {suggestion}
            </p>
            <div className="flex items-center gap-3">
              <Progress 
                value={completionPercentage} 
                className="flex-1 h-2"
              />
              <Button variant="outline" size="sm" className="text-xs px-3">
                Improve Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnetteProfileAdvisor;