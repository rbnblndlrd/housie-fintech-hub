
import React, { useState, useCallback } from 'react';
import { Camera, Upload, X, Image, Eye, EyeOff, Settings, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import piexif from 'piexifjs';

interface PhotoUploadSectionProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  photoRequirements: {
    requirePhotos: boolean;
    showPreviewToProviders: boolean;
    requireCompletionPhotos: boolean;
  };
  onRequirementsChange: (requirements: any) => void;
  className?: string;
}

interface ProcessedPhoto {
  file: File;
  preview: string;
  blurredPreview: string;
  isPreviewPhoto: boolean;
  processing: boolean;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  photos,
  onPhotosChange,
  photoRequirements,
  onRequirementsChange,
  className = ''
}) => {
  const [processedPhotos, setProcessedPhotos] = useState<ProcessedPhoto[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const compressImage = async (file: File, maxSizeKB = 1024): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions to stay under size limit
        let { width, height } = img;
        const ratio = Math.min(1200 / width, 1200 / height);
        
        if (ratio < 1) {
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with high quality and reduce if needed
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (blob && blob.size <= maxSizeKB * 1024) {
              resolve(new File([blob], file.name, { 
                type: 'image/jpeg',
                lastModified: file.lastModified 
              }));
            } else if (quality > 0.1) {
              quality -= 0.1;
              tryCompress();
            } else {
              // If still too large, resolve with current blob
              resolve(new File([blob!], file.name, { 
                type: 'image/jpeg',
                lastModified: file.lastModified 
              }));
            }
          }, 'image/jpeg', quality);
        };
        
        tryCompress();
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const stripMetadata = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const dataView = new DataView(arrayBuffer);
          
          // Check if it's a JPEG
          if (dataView.getUint16(0) === 0xFFD8) {
            const strippedData = piexif.remove(arrayBuffer);
            const blob = new Blob([strippedData], { type: 'image/jpeg' });
            resolve(new File([blob], file.name, { 
              type: 'image/jpeg',
              lastModified: file.lastModified 
            }));
          } else {
            // Not a JPEG, return as-is
            resolve(file);
          }
        } catch (error) {
          console.warn('Could not strip metadata:', error);
          resolve(file);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  const createBlurredPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Create small, blurred version
        canvas.width = 200;
        canvas.height = 150;
        
        ctx.filter = 'blur(8px)';
        ctx.drawImage(img, 0, 0, 200, 150);
        
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const processPhoto = async (file: File): Promise<ProcessedPhoto> => {
    try {
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File too large (max 10MB)');
      }

      // Strip metadata
      const cleanedFile = await stripMetadata(file);
      
      // Compress if needed
      const compressedFile = await compressImage(cleanedFile);
      
      // Create previews
      const preview = URL.createObjectURL(compressedFile);
      const blurredPreview = await createBlurredPreview(compressedFile);
      
      return {
        file: compressedFile,
        preview,
        blurredPreview,
        isPreviewPhoto: processedPhotos.length === 0, // First photo is preview by default
        processing: false
      };
    } catch (error) {
      toast({
        title: "Photo Processing Error",
        description: error instanceof Error ? error.message : "Failed to process photo",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handlePhotoUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setUploading(true);
    
    try {
      const newProcessedPhotos: ProcessedPhoto[] = [];
      
      for (const file of fileArray) {
        if (file.type.startsWith('image/')) {
          const processed = await processPhoto(file);
          newProcessedPhotos.push(processed);
        }
      }
      
      const updatedPhotos = [...processedPhotos, ...newProcessedPhotos];
      setProcessedPhotos(updatedPhotos);
      onPhotosChange(updatedPhotos.map(p => p.file));
      
      if (newProcessedPhotos.length > 0) {
        toast({
          title: "Photos Processed",
          description: `${newProcessedPhotos.length} photo(s) processed and ready`,
        });
      }
    } catch (error) {
      console.error('Photo upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use back camera
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) handlePhotoUpload(files);
    };
    input.click();
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handlePhotoUpload(e.dataTransfer.files);
    }
  }, []);

  const removePhoto = (index: number) => {
    const updated = processedPhotos.filter((_, i) => i !== index);
    setProcessedPhotos(updated);
    onPhotosChange(updated.map(p => p.file));
  };

  const setPreviewPhoto = (index: number) => {
    const updated = processedPhotos.map((photo, i) => ({
      ...photo,
      isPreviewPhoto: i === index
    }));
    setProcessedPhotos(updated);
  };

  const togglePhotoRequirement = () => {
    const newRequirePhotos = !photoRequirements.requirePhotos;
    onRequirementsChange({
      ...photoRequirements,
      requirePhotos: newRequirePhotos,
      // If removing photo requirement, also disable completion photos
      requireCompletionPhotos: newRequirePhotos ? photoRequirements.requireCompletionPhotos : false
    });
    
    toast({
      title: newRequirePhotos ? "Photo Requirement Added" : "Photo Requirement Removed",
      description: newRequirePhotos 
        ? "Photos are now required for this booking" 
        : "Photos are now optional for this booking",
    });
  };

  return (
    <div className={className}>
      {/* Photo Requirement Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-blue-600" />
                <Label className="font-medium">Photo Requirements</Label>
              </div>
              <Badge variant={photoRequirements.requirePhotos ? "default" : "outline"}>
                {photoRequirements.requirePhotos ? "Required" : "Optional"}
              </Badge>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Photos help providers give accurate quotes but are not required for booking.
          </p>

          {showSettings && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Require Photos</Label>
                  <p className="text-sm text-gray-500">Make photos mandatory for this booking</p>
                </div>
                <Switch
                  checked={photoRequirements.requirePhotos}
                  onCheckedChange={togglePhotoRequirement}
                />
              </div>

              {processedPhotos.length > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Show Preview to Providers</Label>
                    <p className="text-sm text-gray-500">Providers see blurred preview of selected photo</p>
                  </div>
                  <Switch
                    checked={photoRequirements.showPreviewToProviders}
                    onCheckedChange={(checked) => 
                      onRequirementsChange({...photoRequirements, showPreviewToProviders: checked})
                    }
                  />
                </div>
              )}

              {processedPhotos.length > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Require Completion Photos</Label>
                    <p className="text-sm text-gray-500">Provider must submit after photos before payment release</p>
                  </div>
                  <Switch
                    checked={photoRequirements.requireCompletionPhotos}
                    onCheckedChange={(checked) => 
                      onRequirementsChange({...photoRequirements, requireCompletionPhotos: checked})
                    }
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Upload Area */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Reference Photos (optional)
        </Label>
        
        {/* Upload Interface */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <Upload className="h-10 w-10 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600 mb-2">
                Add photos to help providers understand your needs
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCameraCapture}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Browse Files
                    </span>
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, HEIC up to 10MB each • Metadata automatically removed
            </p>
          </div>
        </div>

        {/* Photo Previews */}
        {processedPhotos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Uploaded Photos ({processedPhotos.length})</Label>
              {processedPhotos.length > 1 && (
                <p className="text-sm text-gray-500">Tap to set preview photo</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {processedPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div 
                    className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      photo.isPreviewPhoto ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPreviewPhoto(index)}
                  >
                    <img
                      src={photo.preview}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                    {photo.isPreviewPhoto && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-500">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Provider Preview Demo */}
            {photoRequirements.showPreviewToProviders && processedPhotos.some(p => p.isPreviewPhoto) && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <Label className="text-blue-800 font-medium">Provider Preview</Label>
                      <p className="text-sm text-blue-700 mb-3">
                        This is what providers will see (blurred for privacy):
                      </p>
                      <div className="w-24 h-18 rounded border">
                        <img
                          src={processedPhotos.find(p => p.isPreviewPhoto)?.blurredPreview}
                          alt="Blurred preview"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Processing Indicator */}
        {uploading && (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Processing photos...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUploadSection;
