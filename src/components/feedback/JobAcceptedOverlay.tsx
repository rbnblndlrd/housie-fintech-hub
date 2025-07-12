import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';

interface JobAcceptedOverlayProps {
  visible: boolean;
  jobTitle: string;
  jobPrice: string;
  onClose: () => void;
}

const JobAcceptedOverlay: React.FC<JobAcceptedOverlayProps> = ({
  visible,
  jobTitle,
  jobPrice,
  onClose
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible && !show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-auto">
      <Card className={`fintech-card border-green-500 bg-green-50/95 backdrop-blur-sm transition-all duration-300 ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-green-800">Job Accepted!</h4>
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
              <p className="text-sm text-green-700 mb-2">
                ✅ Added to Dashboard and Bookings
              </p>
              <div className="text-sm font-medium text-green-800">
                <span className="text-green-600">{jobPrice}</span> - {jobTitle}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobAcceptedOverlay;