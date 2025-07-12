import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Upload, Camera, AlertTriangle, FileText, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FallbackPhotoSubmissionProps {
  bookingId: string;
  checklistItemId: string;
  itemTitle: string;
  itemDescription?: string;
  requiredType: 'before' | 'after' | 'both';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FallbackPhotoSubmission: React.FC<FallbackPhotoSubmissionProps> = ({
  bookingId,
  checklistItemId,
  itemTitle,
  itemDescription,
  requiredType,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoSelect = (file: File) => {
    setSelectedPhoto(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedPhoto || !justification.trim() || !user) {
      toast.error('Please provide both a photo and justification');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photo to storage
      const fileExt = selectedPhoto.name.split('.').pop();
      const fileName = `fallback_${bookingId}_${checklistItemId}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('booking-photos')
        .upload(fileName, selectedPhoto);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('booking-photos')
        .getPublicUrl(fileName);

      // Create fallback record
      const { error: fallbackError } = await supabase
        .from('photo_checklist_fallbacks')
        .insert({
          booking_id: bookingId,
          checklist_item_id: checklistItemId,
          submitted_by: user.id,
          reason: justification.trim(),
          fallback_photo_url: publicUrl
        });

      if (fallbackError) throw fallbackError;

      toast.success('Fallback photo submitted for client approval');
      onSuccess();
      onClose();
      
      // Reset form
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setJustification('');

    } catch (error) {
      console.error('Error submitting fallback photo:', error);
      toast.error('Failed to submit fallback photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoSelect(file);
    }
  };

  const getRequiredText = () => {
    switch (requiredType) {
      case 'before':
        return 'Required: Before photo';
      case 'after':
        return 'Required: After photo';
      case 'both':
        return 'Required: Before & after photos';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Submit Fallback Photo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Context Information */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">{itemTitle}</h4>
                  {itemDescription && (
                    <p className="text-sm text-amber-700 mt-1">{itemDescription}</p>
                  )}
                  <Badge variant="outline" className="mt-2 text-amber-700 border-amber-300">
                    {getRequiredText()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Fallback Photo</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-4">
              {!photoPreview ? (
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a fallback photo that shows the current state
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="fallback-photo"
                  />
                  <Label htmlFor="fallback-photo" asChild>
                    <Button variant="outline" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Select Photo
                    </Button>
                  </Label>
                </div>
              ) : (
                <div className="space-y-3">
                  <img 
                    src={photoPreview} 
                    alt="Fallback preview" 
                    className="w-full max-h-48 object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        {selectedPhoto?.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPhoto(null);
                        setPhotoPreview(null);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Justification */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Justification Required</Label>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why the required photo couldn't be taken (e.g., 'Client was asleep and I couldn't access the area for before photo', 'Equipment blocked access until service was completed')"
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This explanation will be shown to the client for approval. Be specific and honest.
            </p>
          </div>

          {/* Process Explanation */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Your fallback photo and explanation are submitted</li>
                    <li>2. The client receives an Annette notification</li>
                    <li>3. Client can approve or reject your fallback</li>
                    <li>4. If approved, the checklist item is marked complete</li>
                    <li>5. All decisions are logged for audit purposes</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!selectedPhoto || !justification.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Fallback
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};