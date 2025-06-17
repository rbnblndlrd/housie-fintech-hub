
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, DollarSign } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  title: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category: string;
}

interface Provider {
  id: string;
  business_name: string;
  hourly_rate: number;
  service_radius_km: number;
}

interface BookingFormProps {
  service: Service;
  provider: Provider;
  onBookingComplete: (bookingId: string) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  service, 
  provider, 
  onBookingComplete, 
  onCancel 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(2);
  const [serviceAddress, setServiceAddress] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate total amount including HOUSIE's 6% fee
  const baseAmount = service.pricing_type === 'hourly' 
    ? (provider.hourly_rate || service.base_price) * duration
    : service.base_price;
  
  const housieFeePct = 0.06; // 6% transaction fee
  const husieFee = baseAmount * housieFeePct;
  const totalAmount = baseAmount + husieFee;

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour réserver ce service.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime || !serviceAddress.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create booking in database
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          provider_id: provider.id,
          service_id: service.id,
          scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
          scheduled_time: selectedTime,
          duration_hours: duration,
          total_amount: totalAmount,
          service_address: serviceAddress,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw bookingError;
      }

      console.log('Booking created:', booking);

      // Call Stripe payment function
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: {
          booking_id: booking.id,
          amount: Math.round(totalAmount * 100), // Convert to cents
          service_name: service.title,
          provider_name: provider.business_name
        }
      });

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        throw paymentError;
      }

      // Redirect to Stripe Checkout
      if (paymentData?.url) {
        window.location.href = paymentData.url;
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Erreur de réservation",
        description: "Une erreur est survenue lors de la création de votre réservation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Réserver ce service
          </CardTitle>
          <CardDescription>
            {service.title} avec {provider.business_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                {service.pricing_type === 'hourly' ? 'Tarif horaire' : 'Prix fixe'}
              </span>
              <span className="font-medium">
                {service.pricing_type === 'hourly' 
                  ? `${provider.hourly_rate || service.base_price}$/h`
                  : `${service.base_price}$`
                }
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date souhaitée *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Heure souhaitée *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Choisir une heure" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration (only for hourly services) */}
          {service.pricing_type === 'hourly' && (
            <div className="space-y-2">
              <Label>Durée estimée (heures)</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 8].map((hours) => (
                    <SelectItem key={hours} value={hours.toString()}>
                      {hours} heure{hours > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Service Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresse du service *</Label>
            <Input
              id="address"
              placeholder="123 Rue Example, Ville, Province"
              value={serviceAddress}
              onChange={(e) => setServiceAddress(e.target.value)}
            />
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="requests">Demandes spéciales</Label>
            <Textarea
              id="requests"
              placeholder="Précisions sur le service souhaité..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
            />
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-purple-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Récapitulatif des coûts</h4>
            <div className="flex justify-between text-sm">
              <span>Service ({service.pricing_type === 'hourly' ? `${duration}h` : 'Prix fixe'})</span>
              <span>{baseAmount.toFixed(2)}$</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Frais HOUSIE (6%)</span>
              <span>{husieFee.toFixed(2)}$</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{totalAmount.toFixed(2)}$</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Annuler
            </Button>
            <Button 
              onClick={handleBookNow} 
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Traitement..." : "Réserver maintenant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
