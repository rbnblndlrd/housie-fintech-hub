
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Camera, X, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    comment: string;
    photos: File[];
    allowPortfolioUse: boolean;
  }) => void;
  onClose: () => void;
  onLearnMore: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onClose,
  onLearnMore
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [allowPortfolioUse, setAllowPortfolioUse] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      toast({
        title: "Too many photos",
        description: "Please select up to 3 photos only",
        variant: "destructive"
      });
      return;
    }
    setPhotos(files);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      rating,
      comment,
      photos,
      allowPortfolioUse
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <CardTitle className="text-xl font-bold">Share Your Experience</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={onLearnMore}
            className="text-orange-600 hover:text-orange-700 p-2 -mx-2 mt-2"
          >
            <Info className="h-4 w-4 mr-2" />
            💡 REVIEWS EARN REWARDS - LEARN MORE
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <h3 className="font-semibold mb-3">How was your experience?</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tell others about your experience (optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about the service quality, timeliness, professionalism..."
              rows={4}
              className="resize-none"
            />
            {rating === 5 && comment.trim() && (
              <p className="text-sm text-green-600 mt-1">
                🎉 5-star review with details earns bonus rewards!
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Share photos of completed work? (optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Tap to add photos (up to 3)
                </p>
              </label>
            </div>
            
            {photos.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-green-600 mb-2">
                  {photos.length} photo{photos.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="portfolio-permission"
                    checked={allowPortfolioUse}
                    onChange={(e) => setAllowPortfolioUse(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="portfolio-permission" className="text-sm text-gray-600">
                    Allow provider to use in portfolio
                  </label>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Submit Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
