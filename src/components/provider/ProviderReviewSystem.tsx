
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Verified, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  helpfulCount: number;
  verified: boolean;
}

interface ProviderReviewSystemProps {
  providerId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview?: (review: { rating: number; comment: string; service: string }) => void;
}

const ProviderReviewSystem: React.FC<ProviderReviewSystemProps> = ({
  reviews,
  averageRating,
  totalReviews,
  onSubmitReview
}) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    service: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  const handleSubmitReview = () => {
    if (newReview.rating > 0 && newReview.comment.trim()) {
      onSubmitReview?.(newReview);
      setNewReview({ rating: 0, comment: '', service: '' });
      setShowReviewForm(false);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      default: // newest
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} ${
          i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingDistribution = () => {
    const distribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      return { star, count, percentage };
    });

    return (
      <div className="space-y-2">
        {distribution.map(({ star, count, percentage }) => (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-3">{star}</span>
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-gray-600">{count}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Badge variant="secondary">{totalReviews} reviews</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating), 'lg')}
              </div>
              <p className="text-gray-600">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Rating Distribution</h4>
              {renderRatingDistribution()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {user && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <label className="block text-sm font-medium mb-2">Service Received</label>
              <input
                type="text"
                value={newReview.service}
                onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                placeholder="e.g., House cleaning, Plumbing repair"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this provider..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} disabled={!newReview.rating || !newReview.comment.trim()}>
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <Card key={review.id} className="fintech-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.customerName}</span>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                            <Verified className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {review.date}
                        {review.service && (
                          <>
                            <span>•</span>
                            <span>{review.service}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>

                <div className="flex items-center justify-between text-sm">
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpfulCount})
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="fintech-card">
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews yet. Be the first to review this provider!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProviderReviewSystem;
