
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, MapPin, DollarSign, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BookingDetails {
  id: string;
  scheduled_date: string;  
  scheduled_time: string;
  duration_hours: number;
  total_amount: number;
  service_address: string;
  status: string;
  payment_status: string;
  service: {
    title: string;
    description: string;
    category: string;
  };
  provider: {
    business_name: string;
    user: {
      full_name: string;
      email: string;
    };
  };
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId || !user) return;

      try {
        // Update booking payment status to paid
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ 
            payment_status: 'paid',
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)
          .eq('customer_id', user.id);

        if (updateError) {
          console.error('Error updating booking:', updateError);
        }

        // Fetch booking details with related data
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            service:services(title, description, category),
            provider:provider_profiles(
              business_name,
              user:users(full_name, email)
            )
          `)
          .eq('id', bookingId)
          .eq('customer_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching booking:', error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails de votre réservation.",
            variant: "destructive",
          });
          return;
        }

        setBooking(data as BookingDetails);
        
        // Show success message
        toast({
          title: "Réservation confirmée !",
          description: "Votre paiement a été traité avec succès.",
        });

      } catch (error) {
        console.error('Booking success error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la confirmation.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Confirmation de votre réservation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Réservation introuvable</h2>
              <p className="text-gray-600 mb-6">
                Nous n'avons pas pu récupérer les détails de votre réservation.
              </p>
              <Link to="/dashboard">
                <Button>Voir mes réservations</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Réservation confirmée !</CardTitle>
            <CardDescription className="text-green-700">
              Votre paiement a été traité avec succès et votre réservation est confirmée.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de votre réservation</CardTitle>
            <CardDescription>Réservation #{booking.id.slice(0, 8)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Info */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">{booking.service.title}</h3>
                <p className="text-sm text-gray-600">{booking.service.description}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">
                  avec {booking.provider.business_name}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">
                  {new Date(booking.scheduled_date).toLocaleDateString('fr-CA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  à {booking.scheduled_time}
                  {booking.duration_hours && ` (${booking.duration_hours}h estimées)`}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Adresse du service</p>
                <p className="text-sm text-gray-600">{booking.service_address}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Montant payé</p>
                <p className="text-sm text-gray-600">{booking.total_amount}$ CAD</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-600">Statut: Confirmé</p>
                <p className="text-sm text-gray-600">Paiement: Payé</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Le prestataire sera notifié de votre réservation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Vous recevrez une confirmation par email</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm">Le prestataire vous contactera pour finaliser les détails</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Link to="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Voir mes réservations
                </Button>
              </Link>
              <Link to="/services" className="flex-1">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Réserver d'autres services
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingSuccess;
