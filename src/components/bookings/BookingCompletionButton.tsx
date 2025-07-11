import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Camera, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ReviewFlow } from '@/components/reviews/ReviewFlow';

interface BookingCompletionButtonProps {
  bookingId: string;
  status: string;
  userRole: 'provider' | 'customer';
  onStatusUpdate: () => void;
  requiresPhotos?: boolean;
}

export const BookingCompletionButton: React.FC<BookingCompletionButtonProps> = ({
  bookingId,
  status,
  userRole,
  onStatusUpdate,
  requiresPhotos = false
}) => {
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showReviewFlow, setShowReviewFlow] = useState(false);
  const [showPhotoFlow, setShowPhotoFlow] = useState(false);

  const handleMarkComplete = async () => {
    if (!user) return;

    // Check if photos are required first
    if (requiresPhotos && status !== 'completed') {
      setShowPhotoFlow(true);
      return;
    }

    setIsCompleting(true);

    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Provider marks as completed first
      if (userRole === 'provider' && status !== 'completed') {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(
        userRole === 'provider' 
          ? 'Job marked as completed! Customer will be notified.'
          : 'Thank you for confirming completion.'
      );

      onStatusUpdate();

      // Show review flow after completion
      if (status === 'completed' || userRole === 'provider') {
        setTimeout(() => setShowReviewFlow(true), 1000);
      }

    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error('Failed to mark as complete. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handlePhotoSubmission = async (photos: File[]) => {
    if (!user) return;

    try {
      // Upload photos to storage
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${bookingId}_${userRole}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('booking-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('booking-photos')
          .getPublicUrl(fileName);

        // Update booking with photo metadata
        const photoField = userRole === 'provider' ? 'after_photos' : 'before_photos';
        
        const { data: booking } = await supabase
          .from('bookings')
          .select(photoField)
          .eq('id', bookingId)
          .single();

        const existingPhotos = booking?.[photoField] || [];
        const updatedPhotos = [...existingPhotos, { url: publicUrl, timestamp: new Date().toISOString() }];

        await supabase
          .from('bookings')
          .update({ [photoField]: updatedPhotos })
          .eq('id', bookingId);
      }

      setShowPhotoFlow(false);
      // Now proceed with completion
      handleMarkComplete();

    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos. Please try again.');
    }
  };

  const getButtonText = () => {
    if (status === 'completed') {
      return 'Leave Review';
    }
    
    if (userRole === 'provider') {
      return requiresPhotos ? 'Complete & Upload Photos' : 'Mark as Complete';
    }
    
    return 'Confirm Complete';
  };

  const getButtonIcon = () => {
    if (requiresPhotos && status !== 'completed') {
      return <Camera className="h-4 w-4" />;
    }
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <>
      <Button
        onClick={status === 'completed' ? () => setShowReviewFlow(true) : handleMarkComplete}
        disabled={isCompleting}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {isCompleting ? (
          <>
            <Clock className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {getButtonIcon()}
            <span className="ml-2">{getButtonText()}</span>
          </>
        )}
      </Button>

      {/* Photo Upload Flow */}
      {showPhotoFlow && (
        <PhotoUploadModal
          isOpen={showPhotoFlow}
          onClose={() => setShowPhotoFlow(false)}
          onSubmit={handlePhotoSubmission}
          userRole={userRole}
        />
      )}

      {/* Review Flow */}
      {showReviewFlow && (
        <ReviewFlow
          bookingId={bookingId}
          onComplete={() => {
            setShowReviewFlow(false);
            onStatusUpdate();
          }}
          onClose={() => setShowReviewFlow(false)}
        />
      )}
    </>
  );
};

// Simple Photo Upload Modal Component
const PhotoUploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (photos: File[]) => void;
  userRole: 'provider' | 'customer';
}> = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (selectedPhotos.length === 0) {
      toast.error('Please select at least one photo');
      return;
    }
    onSubmit(selectedPhotos);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Upload {userRole === 'provider' ? 'After' : 'Before'} Photos
        </h3>
        
        <div className="mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload photos to verify job completion
          </p>
        </div>

        {selectedPhotos.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {selectedPhotos.length} photo(s) selected
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Upload & Complete
          </Button>
        </div>
      </div>
    </div>
  );
};