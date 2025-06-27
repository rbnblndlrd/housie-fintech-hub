
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Camera, Shield, AlertCircle } from 'lucide-react';

interface BookingSummaryProps {
  service: {
    title: string;
    pricing_type: string;
    base_price: number;
  };
  provider: {
    business_name: string;
    hourly_rate: number;
  };
  bookingData: {
    date: string;
    time: string;
    address: string;
    duration: number;
    instructions: string;
  };
  photoData: {
    photos: File[];
    requirements: {
      requirePhotos: boolean;
      showPreviewToProviders: boolean;
      requireCompletionPhotos: boolean;
    };
  };
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  provider,
  bookingData,
  photoData
}) => {
  const getPrice = () => {
    return service.pricing_type === 'hourly' 
      ? provider.hourly_rate * bookingData.duration
      : service.base_price;
  };

  const getPlatformFee = () => {
    return getPrice() * 0.06; // 6% platform fee
  };

  const getTotalPrice = () => {
    return getPrice() + getPlatformFee();
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold">
              {provider.business_name.charAt(0)}
            </span>
          </div>
          {provider.business_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Details */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <h3 className="font-medium">{service.title}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date(bookingData.date).toLocaleDateString('fr-CA')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{bookingData.time}</span>
              {service.pricing_type === 'hourly' && (
                <Badge variant="outline" className="ml-auto">
                  {bookingData.duration}h
                </Badge>
              )}
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="flex-1">{bookingData.address}</span>
            </div>
          </div>
        </div>

        {/* Photo Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-600" />
            <span className="font-medium">Photos</span>
            <Badge variant={photoData.requirements.requirePhotos ? "default" : "outline"}>
              {photoData.requirements.requirePhotos ? "Required" : "Optional"}
            </Badge>
          </div>
          
          {photoData.photos.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {photoData.photos.length} photo(s) uploaded
              </p>
              
              {photoData.requirements.showPreviewToProviders && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Shield className="h-3 w-3" />
                  <span>Blurred preview visible to providers</span>
                </div>
              )}
              
              {photoData.requirements.requireCompletionPhotos && (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>Completion photos required before payment release</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No photos uploaded</p>
          )}
        </div>

        {/* Instructions */}
        {bookingData.instructions && (
          <div className="space-y-2">
            <span className="font-medium text-sm">Special Instructions</span>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {bookingData.instructions}
            </p>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Service Price</span>
            <span>${getPrice().toFixed(2)} CAD</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Platform Fee (6%)</span>
            <span>${getPlatformFee().toFixed(2)} CAD</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)} CAD</span>
          </div>
        </div>

        {/* Photo Privacy Notice */}
        {photoData.photos.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Photo Privacy</p>
                <ul className="space-y-1">
                  <li>• Full photos only shared when you accept a provider</li>
                  {photoData.requirements.showPreviewToProviders && (
                    <li>• Providers see blurred previews for context</li>
                  )}
                  <li>• You control what providers can see</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
