
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const basePrice = service.pricing_type === 'hourly' ? provider.hourly_rate * bookingData.duration : service.base_price;
  const houseFee = basePrice * 0.06;
  const totalAmount = basePrice + houseFee;

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
          total_amount: totalAmount,
          status: 'pending',
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

      // Simulate payment processing (replace with actual Stripe integration)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update booking status to 'confirmed' after successful payment
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Booking update error:', updateError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la confirmation de la réservation.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Réservation réussie!",
        description: "Votre réservation a été effectuée avec succès.",
      });

      onBookingComplete(booking.id);
      navigate('/dashboard');

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-2 dark:text-white dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux services
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Service Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">{service.title}</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {provider.business_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.user.city}, {provider.user.province}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {service.pricing_type === 'hourly' 
                      ? `${provider.hourly_rate || service.base_price}$/heure`
                      : `${service.base_price}$ forfait`
                    }
                  </span>
                </div>

                <div className="pt-4 border-t dark:border-gray-600">
                  <h4 className="font-medium mb-2 dark:text-white">Résumé de la commande</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between dark:text-gray-300">
                      <span>Service de base</span>
                      <span>${basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between dark:text-gray-300">
                      <span>Frais HOUSIE (6%)</span>
                      <span>${houseFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t dark:border-gray-600 dark:text-white">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Détails de la réservation</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Complétez les informations pour votre réservation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="dark:text-white">Date souhaitée</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                          className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="dark:text-white">Heure préférée</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="time"
                          type="time"
                          value={bookingData.time}
                          onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                          className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration (for hourly services) */}
                  {service.pricing_type === 'hourly' && (
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="dark:text-white">Durée estimée (heures)</Label>
                      <Select 
                        value={bookingData.duration.toString()} 
                        onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: parseInt(value) }))}
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Sélectionnez la durée" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                          {[1, 2, 3, 4, 5, 6, 8].map((hour) => (
                            <SelectItem key={hour} value={hour.toString()} className="dark:text-white dark:focus:bg-gray-700">
                              {hour} heure{hour > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Service Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="dark:text-white">Adresse du service</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <Textarea
                        id="address"
                        placeholder="Entrez l'adresse complète où le service doit être effectué"
                        value={bookingData.address}
                        onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                        className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="dark:text-white">Instructions spéciales (optionnel)</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Décrivez toute instruction spéciale ou détail important pour le prestataire"
                      value={bookingData.instructions}
                      onChange={(e) => setBookingData(prev => ({ ...prev, instructions: e.target.value }))}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 text-lg"
                    >
                      {isLoading ? "Traitement en cours..." : `Payer ${totalAmount.toFixed(2)}$ et Réserver`}
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Vous serez redirigé vers Stripe pour le paiement sécurisé
                    </p>
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
