import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Calendar, Brain, Zap } from 'lucide-react';

interface JobAcceptedOverlayProps {
  visible: boolean;
  jobTitle: string;
  jobPrice: string;
  customer?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  location?: string;
  onClose: () => void;
  onParseClick?: () => void;
  onScheduleClick?: () => void;
}

const JobAcceptedOverlay: React.FC<JobAcceptedOverlayProps> = ({
  visible,
  jobTitle,
  jobPrice,
  customer,
  priority = 'medium',
  dueDate,
  location,
  onClose,
  onParseClick,
  onScheduleClick
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      // Auto-close after 7 seconds (as specified in requirements)
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible && !show) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-auto">
      <Card className={`fintech-card border-green-500 bg-green-50/95 backdrop-blur-sm transition-all duration-300 max-w-sm ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-green-800">Job Accepted!</h4>
              </div>
              <button
                onClick={() => {
                  setShow(false);
                  setTimeout(onClose, 300);
                }}
                className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Job Info */}
            <div className="space-y-2">
              <div className="font-medium text-green-800">{jobTitle}</div>
              
              <div className="flex items-center gap-2 text-sm text-green-700">
                {dueDate && (
                  <span>{dueDate}</span>
                )}
                {customer && (
                  <>
                    {dueDate && <span>|</span>}
                    <span>{customer}</span>
                  </>
                )}
                {priority && (
                  <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                  </Badge>
                )}
              </div>

              {location && (
                <div className="text-xs text-green-600">{location}</div>
              )}

              <div className="text-sm font-medium text-green-800">
                <span className="text-green-600">{jobPrice}</span>
              </div>
            </div>

            {/* Status */}
            <div className="text-xs text-green-700 bg-green-100 rounded px-2 py-1">
              ✅ Added to Dashboard and Bookings
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onParseClick?.();
                  setShow(false);
                  setTimeout(onClose, 300);
                }}
                className="flex-1 h-8 text-xs border-green-300 text-green-700 hover:bg-green-100"
              >
                <Brain className="w-3 h-3 mr-1" />
                AI Parsing...
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onScheduleClick?.();
                  setShow(false);
                  setTimeout(onClose, 300);
                }}
                className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Schedule Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobAcceptedOverlay;