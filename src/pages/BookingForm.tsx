
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import PhotoUploadSection from "@/components/booking/PhotoUploadSection";
import BookingSummary from "@/components/booking/BookingSummary";

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get service details from URL params
  const serviceId = searchParams.get('service_id');
  const providerName = searchParams.get('provider');
  const price = searchParams.get('price');
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    duration: 1,
    instructions: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoRequirements, setPhotoRequirements] = useState({
    requirePhotos: false,
    showPreviewToProviders: true,
    requireCompletionPhotos: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock service and provider data (in real app, this would come from API)
  const serviceData = {
    title: `Service #${serviceId}`,
    pricing_type: 'fixed', // or 'hourly'
    base_price: parseInt(price || '0')
  };

  const providerData = {
    business_name: providerName || 'Unknown Provider',
    hourly_rate: parseInt(price || '0')
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.date || !formData.time || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate photo requirements
    if (photoRequirements.requirePhotos && photos.length === 0) {
      toast({
        title: "Photos Required",
        description: "Please upload at least one photo or change photo requirements",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Navigate to payment with booking details
    const params = new URLSearchParams({
      service_id: serviceId || '',
      provider: providerName || '',
      price: price || '',
      date: formData.date,
      time: formData.time,
      address: formData.address,
      duration: formData.duration.toString(),
      instructions: formData.instructions,
      photo_count: photos.length.toString(),
      photos_required: photoRequirements.requirePhotos.toString(),
      show_preview: photoRequirements.showPreviewToProviders.toString(),
      completion_photos: photoRequirements.requireCompletionPhotos.toString()
    });
    
    // In a real app, you would save the photos to a server/database here
    console.log('Photos to upload:', photos);
    console.log('Photo requirements:', photoRequirements);
    
    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form - Left Side (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Booking Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Preferred Date *
                        </Label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Preferred Time *
                        </Label>
                        <Input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Service Address *
                      </Label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                        placeholder="123 Example Street, Montreal, QC"
                        required
                        className="mt-1"
                      />
                    </div>

                    {/* Duration (only for hourly services) */}
                    {serviceData.pricing_type === 'hourly' && (
                      <div>
                        <Label>Estimated Duration (hours)</Label>
                        <Input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({...prev, duration: parseInt(e.target.value)}))}
                          min="1"
                          max="8"
                          className="mt-1"
                        />
                      </div>
                    )}

                    {/* Instructions */}
                    <div>
                      <Label>Special Instructions (optional)</Label>
                      <Textarea
                        value={formData.instructions}
                        onChange={(e) => setFormData(prev => ({...prev, instructions: e.target.value}))}
                        placeholder="Any special requirements, access instructions, or details about the job..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Photo Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <PhotoUploadSection
                    photos={photos}
                    onPhotosChange={setPhotos}
                    photoRequirements={photoRequirements}
                    onRequirementsChange={setPhotoRequirements}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 min-w-48"
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </div>
            </div>

            {/* Booking Summary - Right Side (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingSummary
                  service={serviceData}
                  provider={providerData}
                  bookingData={formData}
                  photoData={{
                    photos,
                    requirements: photoRequirements
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
