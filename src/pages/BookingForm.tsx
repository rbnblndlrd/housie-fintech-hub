import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Calendar, Clock, MapPin, Upload } from 'lucide-react';
import Header from "@/components/Header";

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get service details from URL params
  const serviceId = searchParams.get('service_id');
  const providerName = searchParams.get('provider');
  const price = searchParams.get('price');
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    duration: '1',
    instructions: '',
    photos: [] as File[],
    photoRequirements: false
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to payment with booking details
    const params = new URLSearchParams({
      service_id: serviceId || '',
      provider: providerName || '',
      price: price || '',
      date: formData.date,
      time: formData.time,
      address: formData.address,
      duration: formData.duration,
      instructions: formData.instructions,
      photo_count: formData.photos.length.toString()
    });
    
    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Service Summary */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">
                      {providerName?.charAt(0)}
                    </span>
                  </div>
                  {providerName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">Service sélectionné</h3>
                    <p className="text-sm text-gray-600">Service ID: {serviceId}</p>
                    <p className="text-lg font-bold text-purple-600">{price}$ CAD</p>
                  </div>
                  
                  {/* Photo Requirements Toggle */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Camera className="h-5 w-5 text-purple-600" />
                      <Label className="font-medium">Photos requises</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="photoReq"
                        checked={formData.photoRequirements}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          photoRequirements: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <Label htmlFor="photoReq" className="text-sm">
                        Demander des photos avant/après
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Détails de la réservation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date souhaitée
                      </Label>
                      <Input
                        type="date"
                        value={formData.date}
