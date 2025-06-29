
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestReviewsSectionProps {
  onCreateReview: (rating: number) => void;
  disabled: boolean;
}

const TestReviewsSection: React.FC<TestReviewsSectionProps> = ({ 
  onCreateReview, 
  disabled 
}) => {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Test Reviews
      </h3>
      <div className="flex flex-wrap gap-2">
        {ratings.map((rating) => (
          <Button
            key={rating}
            onClick={() => onCreateReview(rating)}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            {rating} Star{rating !== 1 ? 's' : ''}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TestReviewsSection;
