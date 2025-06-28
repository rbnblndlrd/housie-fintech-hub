import React, { useState } from 'react';
import { CommendationSelector } from './CommendationSelector';
import { ReviewForm } from './ReviewForm';
import { CommunityRewardsPage } from './CommunityRewardsPage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ReviewFlowProps {
  bookingId: string;
  onComplete: () => void;
  onClose: () => void;
}

export const ReviewFlow: React.FC<ReviewFlowProps> = ({
  bookingId,
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState<'commendations' | 'review' | 'rewards'>('commendations');
  const [selectedCommendations, setSelectedCommendations] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCommendationsComplete = (commendations: string[]) => {
    setSelectedCommendations(commendations);
    setCurrentStep('review');
  };

  const handleReviewSubmit = async (reviewData: {
    rating: number;
    comment: string;
    photos: File[];
    allowPortfolioUse: boolean;
  }) => {
    if (!user) return;

    try {
      // Get booking details
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('provider_id')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      // Create review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          reviewer_id: user.id,
          provider_id: booking.provider_id,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      // Add commendations
      if (selectedCommendations.length > 0) {
        const commendationInserts = selectedCommendations.map(type => ({
          review_id: review.id,
          commendation_type: type
        }));

        const { error: commendationsError } = await supabase
          .from('review_commendations')
          .insert(commendationInserts);

        if (commendationsError) throw commendationsError;
      }

      // Upload photos if any
      if (reviewData.photos.length > 0) {
        for (const photo of reviewData.photos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${review.id}_${Date.now()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('review-photos')
            .upload(fileName, photo);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('review-photos')
            .getPublicUrl(fileName);

          await supabase
            .from('review_photos')
            .insert({
              review_id: review.id,
              photo_url: publicUrl,
              allow_portfolio_use: reviewData.allowPortfolioUse
            });
        }
      }

      // Points are now automatically awarded via database triggers
      const totalPoints = calculateExpectedPoints(reviewData.rating, reviewData.comment.trim(), selectedCommendations.length);

      toast({
        title: "Review submitted!",
        description: `Thank you for your feedback. Community points awarded automatically based on review quality!`,
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const calculateExpectedPoints = (rating: number, comment: string, commendations: number) => {
    let providerPoints = 2; // Job completion bonus
    
    // Review quality points
    if (rating >= 4.5) providerPoints += 3;
    else if (rating >= 3.5) providerPoints += 2;
    else if (rating >= 2.5) providerPoints += 1;
    else if (rating >= 1.5) providerPoints += 0;
    else providerPoints -= 1;
    
    // Excellence bonus
    if (rating === 5 && comment.length > 10) providerPoints += 2;
    
    // Commendation points
    providerPoints += commendations;
    
    return { provider: providerPoints, customer: 1 }; // Customer always gets +1
  };

  const handleLearnMore = () => {
    setCurrentStep('rewards');
  };

  const handleRewardsClose = () => {
    setCurrentStep('review');
  };

  if (currentStep === 'commendations') {
    return (
      <CommendationSelector
        onComplete={handleCommendationsComplete}
        onClose={onClose}
      />
    );
  }

  if (currentStep === 'review') {
    return (
      <ReviewForm
        onSubmit={handleReviewSubmit}
        onClose={onClose}
        onLearnMore={handleLearnMore}
      />
    );
  }

  if (currentStep === 'rewards') {
    return (
      <CommunityRewardsPage
        onClose={handleRewardsClose}
      />
    );
  }

  return null;
};
