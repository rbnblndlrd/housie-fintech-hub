import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, FileText, CheckCircle, Upload, X } from 'lucide-react';
import { PhotoRequirement } from '@/hooks/useRouteOptimizer';
import { useToast } from '@/hooks/use-toast';

interface PhotoVerificationSectionProps {
  requirement: PhotoRequirement;
  onPhotoCapture: (file: File, thumbnail: string) => void;
}

const PhotoVerificationSection: React.FC<PhotoVerificationSectionProps> = ({
  requirement,
  onPhotoCapture
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const createThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('');
        return;
      }
      
      const img = document.createElement('img') as HTMLImageElement;
      
      img.onload = () => {
        canvas.width = 80;
        canvas.height = 60;
        ctx.drawImage(img, 0, 0, 80, 60);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setIsCapturing(true);
        try {
          const file = files[0];
          const thumbnail = await createThumbnail(file);
          onPhotoCapture(file, thumbnail);
          
          toast({
            title: "Photo Captured",
            description: `${requirement.label} successfully captured`,
          });
        } catch (error) {
          toast({
            title: "Capture Failed", 
            description: "Failed to process photo",
            variant: "destructive"
          });
        } finally {
          setIsCapturing(false);
        }
      }
    };
    
    input.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setIsCapturing(true);
      try {
        const file = files[0];
        const thumbnail = await createThumbnail(file);
        onPhotoCapture(file, thumbnail);
        
        toast({
          title: "Photo Uploaded",
          description: `${requirement.label} successfully uploaded`,
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to process photo", 
          variant: "destructive"
        });
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleSignature = () => {
    // Mock signature completion for demo
    const mockFile = new File(['signature'], 'signature.txt', { type: 'text/plain' });
    onPhotoCapture(mockFile, '📝');
    
    toast({
      title: "Signature Collected",
      description: `${requirement.label} completed`,
    });
  };

  const getIcon = () => {
    if (requirement.type === 'signature') {
      return <FileText className="h-4 w-4" />;
    }
    return <Camera className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center justify-between p-2 fintech-card-secondary rounded">
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded ${
          requirement.completed 
            ? 'bg-green-100 text-green-600' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {requirement.completed ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            getIcon()
          )}
        </div>
        
        <div className="flex-1">
          <span className="text-sm font-medium">{requirement.label}</span>
          {requirement.completed && requirement.thumbnail && (
            <div className="mt-1">
              {requirement.type === 'photo' ? (
                <img 
                  src={requirement.thumbnail} 
                  alt="Thumbnail"
                  className="w-8 h-6 object-cover rounded border"
                />
              ) : (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  📝 Signed
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {requirement.completed ? (
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Done
          </Badge>
        ) : (
          <div className="flex gap-1">
            {requirement.type === 'photo' ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={handleCameraCapture}
                  disabled={isCapturing}
                >
                  {isCapturing ? '...' : '📷'}
                </Button>
                <label className="cursor-pointer">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    asChild
                    disabled={isCapturing}
                  >
                    <span>📁</span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                onClick={handleSignature}
              >
                ✏️ Sign
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoVerificationSection;