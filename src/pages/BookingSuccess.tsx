
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

interface BookingDetails {
  id: string;
  service: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  price: number;
  providerPhone: string;
  providerEmail: string;
}

const BookingSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock booking data
    const mockBooking: BookingDetails = {
      id: id || '1',
      service: 'Nettoyage résidentiel professionnel',
      provider: 'Marie Dubois',
      date: '2024-01-25',
      time: '10:00',
      location: 'Montréal, QC',
      price: 120,
      providerPhone: '514-555-0123',
      providerEmail: 'marie@example.com'
    };
    
    setBooking(mockBooking);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Booking not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Réservation Confirmée!
            </h1>
            <p className="text-gray-600">
              Votre réservation a été confirmée avec succès
            </p>
          </div>

          {/* Booking Details */}
          <Card className="fintech-card mb-6">
            <CardHeader>
              <CardTitle>Détails de la réservation</CardTitle>
              <p className="text-sm text-gray-500">Numéro de confirmation: #{booking.id}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Info */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{booking.service}</h3>
                <p className="text-sm text-gray-600">Prestataire: {booking.provider}</p>
                <p className="text-lg font-bold text-green-600 mt-2">${booking.price}</p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-medium text-gray-900">{booking.time}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-medium text-gray-900">{booking.location}</p>
                </div>
              </div>

              {/* Provider Contact */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Contact du prestataire</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{booking.providerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{booking.providerEmail}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            <Button
              onClick={() => navigate('/booking-history')}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Voir mes réservations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
