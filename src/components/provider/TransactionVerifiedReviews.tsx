
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, CheckCircle, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  verified_transaction: boolean;
  booking_id: string;
  reviewer: {
    full_name: string;
    network_count: number;
  };
  booking: {
    service: {
      title: string;
    };
  };
}

interface CompletedBooking {
  id: string;
  service: {
    title: string;
  };
  scheduled_date: string;
  total_amount: number;
}

interface TransactionVerifiedReviewsProps {
  providerId: string;
  providerUserId: string;
}

const TransactionVerifiedReviews: React.FC<TransactionVerifiedReviewsProps> = ({
  providerId,
  providerUserId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedBookings, setCompletedBookings] = useState<CompletedBooking[]>([]);
  const [canWriteReview, setCanWriteReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [networkCount, setNetworkCount] = useState(0);

  useEffect(() => {
    fetchReviews();
    fetchNetworkCount();
    if (user) {
      checkCompletedBookings();
    }
  }, [user, providerId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          verified_transaction,
          booking_id,
          reviewer:reviewer_id (
            full_name,
            network_count
          ),
          booking:booking_id (
            service:service_id (
              title
            )
          )
        `)
        .eq('provider_id', providerId)
        .eq('verified_transaction', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworkCount = async () => {
    try {
      const { data, error } = await supabase
        .from('network_connections')
        .select('id')
        .or(`customer_id.eq.${providerUserId},provider_id.eq.${providerUserId}`);

      if (error) throw error;
      setNetworkCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching network count:', error);
    }
  };

  const checkCompletedBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          scheduled_date,
          total_amount,
          service:service_id (
            title
          )
        `)
        .eq('customer_id', user.id)
        .eq('provider_id', providerId)
        .eq('status', 'completed');

      if (error) throw error;

      // Filter out bookings that already have reviews
      const existingReviewBookingIds = reviews.map(r => r.booking_id);
      const availableBookings = (data || []).filter(
        booking => !existingReviewBookingIds.includes(booking.id)
      );

      setCompletedBookings(availableBookings);
      setCanWriteReview(availableBookings.length > 0);
    } catch (error) {
      console.error('Error checking completed bookings:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !selectedBooking || newReview.rating === 0) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          booking_id: selectedBooking,
          reviewer_id: user.id,
          provider_id: providerId,
          rating: newReview.rating,
          comment: newReview.comment,
          verified_transaction: true
        });

      if (error) throw error;

      toast({
        title: "Review submitted successfully",
        description: "Your review has been posted and messaging is now unlocked.",
      });

      setShowReviewForm(false);
      setNewReview({ rating: 0, comment: '' });
      setSelectedBooking('');
      fetchReviews();
      checkCompletedBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with Network Count */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-green-600" />
              <span>Transaction-Verified Reviews</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Network: {networkCount}
              </Badge>
              <Badge variant="secondary">
                {reviews.length} Reviews
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600">Only from completed services</p>
            </div>
            <div className="flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">100% Transaction Verified</span>
                </div>
                <p className="text-sm text-green-700">
                  All reviews are from customers who completed and paid for services
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Section */}
      {canWriteReview && !showReviewForm && (
        <Card className="fintech-card border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  You can review this provider
                </h3>
                <p className="text-sm text-blue-700">
                  You have {completedBookings.length} completed service(s) that can be reviewed
                </p>
              </div>
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Write Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select the service you want to review:
              </label>
              <select
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Choose a completed service...</option>
                {completedBookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.service.title} - {new Date(booking.scheduled_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this service provider..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSubmitReview}
                disabled={!selectedBooking || newReview.rating === 0}
                className="fintech-button-primary"
              >
                Submit Review & Unlock Messaging
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="fintech-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.reviewer.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.reviewer.full_name}</span>
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(review.created_at).toLocaleDateString()}
                        <span>•</span>
                        <span>{review.booking.service.title}</span>
                        {review.reviewer.network_count > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>Network: {review.reviewer.network_count}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="fintech-card">
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transaction-verified reviews yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                Reviews will appear here after customers complete services.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransactionVerifiedReviews;
