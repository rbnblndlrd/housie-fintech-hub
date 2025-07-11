import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, Award, MessageCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EnhancedReviewFlowProps {
  bookingId: string;
  onComplete: () => void;
  onClose: () => void;
}

const COMMENDATION_OPTIONS = [
  { id: 'punctual', label: 'Punctual', icon: '⏰' },
  { id: 'quality', label: 'Above & Beyond', icon: '⭐' },
  { id: 'friendly', label: 'Friendly', icon: '😊' },
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'reliable', label: 'Reliable', icon: '🤝' },
  { id: 'clean', label: 'Clean Work', icon: '✨' }
];

export const EnhancedReviewFlow: React.FC<EnhancedReviewFlowProps> = ({
  bookingId,
  onComplete,
  onClose
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedCommendations, setSelectedCommendations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          provider_profiles!inner(
            user_id,
            business_name,
            users!provider_profiles_user_id_fkey(full_name)
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    }
  };

  const toggleCommendation = (commendationId: string) => {
    setSelectedCommendations(prev => 
      prev.includes(commendationId)
        ? prev.filter(id => id !== commendationId)
        : [...prev, commendationId].slice(0, 3) // Max 3 commendations
    );
  };

  const handleSubmit = async () => {
    if (!user || !booking) return;

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters for your review');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          reviewer_id: user.id,
          provider_id: booking.provider_id,
          rating,
          comment: comment.trim(),
          verified_transaction: true
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

      // Check if both parties have reviewed to unlock messaging
      const { data: existingReviews } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId);

      const bothReviewed = existingReviews && existingReviews.length >= 2;

      toast.success(
        bothReviewed 
          ? 'Review submitted! Messaging unlocked and credibility connection established!'
          : 'Review submitted! Thank you for your feedback.'
      );

      onComplete();

    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking) {
    return <div className="p-4">Loading...</div>;
  }

  const providerName = booking.provider_profiles?.business_name || 
                      booking.provider_profiles?.users?.full_name || 
                      'Provider';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Rate Your Experience
          </CardTitle>
          <p className="text-sm text-gray-600">
            How was your service with {providerName}?
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Rating Stars */}
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 0 && 'Click to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Commendations */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              Commendations (Choose up to 3)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {COMMENDATION_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedCommendations.includes(option.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleCommendation(option.id)}
                  className="justify-start"
                  disabled={!selectedCommendations.includes(option.id) && selectedCommendations.length >= 3}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <h4 className="font-medium mb-3">Your Review</h4>
            <Textarea
              placeholder="Share details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters (minimum 10)
            </p>
          </div>

          {/* Credibility Incentive */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-700 mb-1">
                    Unlock Messaging & Build Credibility!
                  </p>
                  <p className="text-sm text-purple-600">
                    Leaving a review builds your Credibility Score and unlocks direct messaging 
                    with {providerName} for future bookings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};