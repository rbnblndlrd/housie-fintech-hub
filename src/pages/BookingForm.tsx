
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Calendar, Clock, MapPin, Upload, X, Image } from 'lucide-react';
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

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
    duration: '1',
    instructions: '',
    photos: [] as File[],
    photoRequirements: false
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newPhotos = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
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
      photo_count: formData.photos.length.toString(),
      photos_required: formData.photoRequirements.toString()
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
                        Date souhaitée *
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
                        Heure souhaitée *
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
                      Adresse du service *
                    </Label>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                      placeholder="123 Rue Example, Montreal, QC"
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Label>Durée estimée (heures)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
                      min="0.5"
                      step="0.5"
                      className="mt-1"
                    />
                  </div>

                  {/* Instructions */}
                  <div>
                    <Label>Instructions spéciales</Label>
                    <Textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData(prev => ({...prev, instructions: e.target.value}))}
                      placeholder="Détails additionnels, accès, préférences..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Upload className="h-4 w-4" />
                      Photos de référence (optionnel)
                    </Label>
                    
                    {/* Drag and Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Glissez vos photos ici ou 
                          <label className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium ml-1">
                            parcourir
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, HEIC jusqu'à 10MB chacune
                        </p>
                      </div>
                    </div>

                    {/* Photo Previews */}
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {photo.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={uploading}
                  >
                    {uploading ? 'Traitement...' : 'Continuer vers le paiement'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
