
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import FeeCalculator from './FeeCalculator';
import PaymentButton from './PaymentButton';

interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
}

interface Provider {
  id: string;
  business_name: string;
  hourly_rate: number;
  user: {
    city: string;
    province: string;
  };
}

interface BookingFormProps {
  service: Service;
  provider: Provider;
  onBookingComplete: (bookingId: string) => void;
  onCancel: () => void;
}

interface BookingData {
  date: string;
  time: string;
  duration: number;
  address: string;
  instructions: string;
}

const BookingForm = ({ service, provider, onBookingComplete, onCancel }: BookingFormProps) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    duration: 1,
    address: '',
    instructions: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const basePrice = service.pricing_type === 'hourly' ? provider.hourly_rate * bookingData.duration : service.base_price;

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour effectuer une réservation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          service_id: service.id,
          provider_id: provider.id,
          scheduled_date: bookingData.date,
          scheduled_time: bookingData.time,
          duration_hours: bookingData.duration,
          service_address: bookingData.address,
          instructions: bookingData.instructions,
          total_amount: basePrice,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Booking creation error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la réservation.",
          variant: "destructive",
        });
        return;
      }

      setBookingId(booking.id);
      setShowPayment(true);

      toast({
        title: "Réservation créée!",
        description: "Procédez maintenant au paiement pour confirmer votre réservation.",
      });

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    if (bookingId) {
      onBookingComplete(bookingId);
      navigate('/booking-success');
    }
  };

  if (showPayment && bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setShowPayment(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Modifier la réservation
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Summary */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>
                  {provider.business_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(bookingData.date).toLocaleDateString('fr-CA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{bookingData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{bookingData.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <div className="space-y-6">
              <FeeCalculator baseAmount={basePrice} />
              
              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle>Finaliser le paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentButton
                    bookingId={bookingId}
                    amount={basePrice * 1.06} // Include 6% HOUSIE fee
                    serviceName={service.title}
                    providerName={provider.business_name}
                    onPaymentComplete={handlePaymentComplete}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux services
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Service Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>
                  {provider.business_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.user.city}, {provider.user.province}</span>
                </div>
                
                <FeeCalculator baseAmount={basePrice} className="mt-4" />
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Détails de la réservation</CardTitle>
                <CardDescription>
                  Complétez les informations pour votre réservation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date souhaitée</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                          className="pl-10"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Heure préférée</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="time"
                          type="time"
                          value={bookingData.time}
                          onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration (for hourly services) */}
                  {service.pricing_type === 'hourly' && (
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée estimée (heures)</Label>
                      <Select 
                        value={bookingData.duration.toString()} 
                        onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la durée" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 8].map((hour) => (
                            <SelectItem key={hour} value={hour.toString()}>
                              {hour} heure{hour > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Service Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse du service</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <Textarea
                        id="address"
                        placeholder="Entrez l'adresse complète où le service doit être effectué"
                        value={bookingData.address}
                        onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                        className="pl-10"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions spéciales (optionnel)</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Décrivez toute instruction spéciale ou détail important pour le prestataire"
                      value={bookingData.instructions}
                      onChange={(e) => setBookingData(prev => ({ ...prev, instructions: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 text-lg rounded-xl"
                    >
                      {isLoading ? "Création en cours..." : "Continuer vers le paiement"}
                    </Button>
                  </div>
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
