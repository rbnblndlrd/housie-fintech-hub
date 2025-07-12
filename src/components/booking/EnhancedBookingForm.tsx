import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SmartPhotoVerificationChecklist } from '@/components/trust/SmartPhotoVerificationChecklist';
import { Calendar, Clock, MapPin, DollarSign, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  requiresBefore: boolean;
  requiresAfter: boolean;
  referencePhoto?: File | null;
}

interface EnhancedBookingFormProps {
  onSubmit: (bookingData: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  className
}) => {
  const [formData, setFormData] = useState({
    serviceType: '',
    address: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedHours: '',
    specialInstructions: '',
    budget: ''
  });

  const [photoVerificationEnabled, setPhotoVerificationEnabled] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData = {
      ...formData,
      photoVerificationEnabled,
      checklistItems: photoVerificationEnabled ? checklistItems : []
    };

    onSubmit(bookingData);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.serviceType && formData.address && formData.scheduledDate && formData.scheduledTime;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Booking Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(value) => updateFormField('serviceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house-cleaning">House Cleaning</SelectItem>
                  <SelectItem value="lawn-care">Lawn Care</SelectItem>
                  <SelectItem value="snow-removal">Snow Removal</SelectItem>
                  <SelectItem value="handyman">Handyman Services</SelectItem>
                  <SelectItem value="moving">Moving Services</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (CAD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="150"
                  value={formData.budget}
                  onChange={(e) => updateFormField('budget', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Service Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="123 Main St, Montreal, QC"
                value={formData.address}
                onChange={(e) => updateFormField('address', e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Preferred Date</Label>
              <Input
                id="scheduled-date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => updateFormField('scheduledDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-time">Preferred Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="scheduled-time"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => updateFormField('scheduledTime', e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated-hours">Estimated Duration (hours)</Label>
            <Select value={formData.estimatedHours} onValueChange={(value) => updateFormField('estimatedHours', value)}>
              <SelectTrigger>
                <SelectValue placeholder="How long will this take?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="6">Half day (6 hours)</SelectItem>
                <SelectItem value="8">Full day (8 hours)</SelectItem>
                <SelectItem value="custom">Custom duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Any specific requirements, access instructions, or important details..."
              value={formData.specialInstructions}
              onChange={(e) => updateFormField('specialInstructions', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Smart Photo Verification Section */}
      <SmartPhotoVerificationChecklist
        enabled={photoVerificationEnabled}
        onToggle={setPhotoVerificationEnabled}
        items={checklistItems}
        onItemsChange={setChecklistItems}
      />

      {photoVerificationEnabled && checklistItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Photo Verification Enabled</h4>
              <p className="text-sm text-blue-700 mt-1">
                This booking will require photo verification for {checklistItems.length} step{checklistItems.length !== 1 ? 's' : ''}. 
                The provider will need to upload before/after photos as specified, and Annette will validate them automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Creating Booking...' : 'Create Booking'}
        </Button>
      </div>
    </form>
  );
};