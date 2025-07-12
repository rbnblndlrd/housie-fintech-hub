import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, CheckCircle, AlertTriangle, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistStep {
  id: string;
  title: string;
  description?: string;
  requiresBefore: boolean;
  requiresAfter: boolean;
  referencePhoto?: string;
  beforePhoto?: File | null;
  afterPhoto?: File | null;
  beforePhotoUploaded: boolean;
  afterPhotoUploaded: boolean;
  isValidated: boolean;
  annetteComment?: string;
  customerApproved?: boolean;
}

interface ProviderSmartChecklistProps {
  bookingId: string;
  steps: ChecklistStep[];
  onStepsUpdate: (steps: ChecklistStep[]) => void;
  canCustomerApprove?: boolean;
  className?: string;
}

export const ProviderSmartChecklist: React.FC<ProviderSmartChecklistProps> = ({
  bookingId,
  steps,
  onStepsUpdate,
  canCustomerApprove = false,
  className
}) => {
  const [uploadingStepId, setUploadingStepId] = useState<string | null>(null);

  const completedSteps = steps.filter(step => {
    const beforeComplete = !step.requiresBefore || step.beforePhotoUploaded;
    const afterComplete = !step.requiresAfter || step.afterPhotoUploaded;
    return beforeComplete && afterComplete && (step.isValidated || step.customerApproved);
  }).length;

  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const handlePhotoUpload = async (stepId: string, type: 'before' | 'after', file: File) => {
    setUploadingStepId(stepId);
    
    try {
      // Simulate photo validation with metadata checks
      const mockValidation = await new Promise<{ isValid: boolean; comment?: string }>((resolve) => {
        setTimeout(() => {
          // Random validation for demo - in real app this would check GPS, timestamp, etc.
          const isValid = Math.random() > 0.3;
          const comment = isValid 
            ? "✅ Photo verified: timestamp and location match."
            : "⚠️ Photo validation issues: location mismatch or invalid timestamp. Customer can override if needed.";
          
          resolve({ isValid, comment });
        }, 2000);
      });

      const updatedSteps = steps.map(step => {
        if (step.id === stepId) {
          const updates: Partial<ChecklistStep> = {
            isValidated: mockValidation.isValid,
            annetteComment: mockValidation.comment
          };

          if (type === 'before') {
            updates.beforePhoto = file;
            updates.beforePhotoUploaded = true;
          } else {
            updates.afterPhoto = file;
            updates.afterPhotoUploaded = true;
          }

          return { ...step, ...updates };
        }
        return step;
      });

      onStepsUpdate(updatedSteps);
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setUploadingStepId(null);
    }
  };

  const handleCustomerApproval = (stepId: string) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, customerApproved: true } : step
    );
    onStepsUpdate(updatedSteps);
  };

  const getStepStatus = (step: ChecklistStep) => {
    const beforeComplete = !step.requiresBefore || step.beforePhotoUploaded;
    const afterComplete = !step.requiresAfter || step.afterPhotoUploaded;
    
    if (!beforeComplete || !afterComplete) {
      return { status: 'pending', color: 'bg-gray-100 text-gray-700', icon: Camera };
    }
    
    if (step.customerApproved) {
      return { status: 'approved', color: 'bg-green-100 text-green-700', icon: CheckCircle };
    }
    
    if (step.isValidated) {
      return { status: 'validated', color: 'bg-blue-100 text-blue-700', icon: CheckCircle };
    }
    
    return { status: 'needs_review', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle };
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Photo Verification Checklist
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {completedSteps}/{totalSteps} Complete
          </Badge>
        </div>
        <Progress value={progressPercentage} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step);
          const isUploading = uploadingStepId === step.id;
          
          return (
            <div key={step.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Step {index + 1}</span>
                    <Badge className={stepStatus.color}>
                      <stepStatus.icon className="w-3 h-3 mr-1" />
                      {stepStatus.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mt-1">{step.title}</h4>
                  {step.description && (
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  )}
                </div>
              </div>

              {/* Reference Photo */}
              {step.referencePhoto && (
                <div className="border-2 border-dashed border-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Reference Photo (for guidance)</span>
                  </div>
                  <img 
                    src={step.referencePhoto} 
                    alt="Reference" 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
              )}

              {/* Photo Upload Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step.requiresBefore && (
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Before Photo</span>
                      {step.beforePhotoUploaded && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {!step.beforePhotoUploaded ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(step.id, 'before', file);
                          }}
                          className="hidden"
                          id={`before-${step.id}`}
                          disabled={isUploading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={isUploading}
                          asChild
                        >
                          <label htmlFor={`before-${step.id}`}>
                            <Upload className="w-4 h-4 mr-1" />
                            {isUploading ? 'Uploading...' : 'Upload Before'}
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs text-green-600">
                        ✅ Before photo uploaded
                      </div>
                    )}
                  </div>
                )}

                {step.requiresAfter && (
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">After Photo</span>
                      {step.afterPhotoUploaded && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {!step.afterPhotoUploaded ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(step.id, 'after', file);
                          }}
                          className="hidden"
                          id={`after-${step.id}`}
                          disabled={isUploading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={isUploading}
                          asChild
                        >
                          <label htmlFor={`after-${step.id}`}>
                            <Upload className="w-4 h-4 mr-1" />
                            {isUploading ? 'Uploading...' : 'Upload After'}
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs text-green-600">
                        ✅ After photo uploaded
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Annette Validation Comment */}
              {step.annetteComment && (
                <div className={cn(
                  "p-3 rounded-lg text-sm",
                  step.isValidated 
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                )}>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div>
                      <div className="font-medium text-xs">Annette AI Validation:</div>
                      <div>{step.annetteComment}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Override Button */}
              {!step.isValidated && !step.customerApproved && step.annetteComment && canCustomerApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCustomerApproval(step.id)}
                  className="w-full"
                >
                  Approve This Step Anyway
                </Button>
              )}
            </div>
          );
        })}

        {steps.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No verification steps configured for this booking.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};