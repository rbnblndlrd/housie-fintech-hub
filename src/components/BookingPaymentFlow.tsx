
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, CreditCard, Calendar, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { useFraudDetection } from '@/hooks/useFraudDetection';
import PaymentButton from './PaymentButton';
import FeeCalculator from './FeeCalculator';

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
  };
  provider: {
    business_name: string;
  };
}

interface BookingPaymentFlowProps {
  booking: BookingDetails;
  onPaymentComplete?: () => void;
}

const BookingPaymentFlow: React.FC<BookingPaymentFlowProps> = ({ 
  booking, 
  onPaymentComplete 
}) => {
  const [paymentStep, setPaymentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fraudCheckResult, setFraudCheckResult] = useState<any>(null);
  const { performFraudCheck } = useFraudDetection();

  const steps = [
    { id: 1, title: "Confirmation", icon: CheckCircle },
    { id: 2, title: "Paiement", icon: CreditCard },
    { id: 3, title: "Terminé", icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === paymentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    // Perform initial fraud check when component mounts
    const performInitialFraudCheck = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        const result = await performFraudCheck({
          action_type: 'payment',
          user_id: booking.customer_id,
          ip_address: ipData.ip,
          user_agent: navigator.userAgent,
          metadata: {
            booking_id: booking.id,
            amount: booking.total_amount
          }
        });

        setFraudCheckResult(result);
      } catch (error) {
        console.error('Initial fraud check error:', error);
      }
    };

    performInitialFraudCheck();
  }, [booking, performFraudCheck]);

  const handlePaymentStart = () => {
    setIsProcessing(true);
    setPaymentStep(2);
  };

  const handlePaymentComplete = () => {
    setPaymentStep(3);
    setIsProcessing(false);
    onPaymentComplete?.();
  };

  useEffect(() => {
    if (booking.payment_status === 'paid') {
      setPaymentStep(3);
    }
  }, [booking.payment_status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show review message if booking is under review
  if (booking.status === 'pending_review') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-orange-800 mb-2">
              Réservation en cours d'examen
            </h3>
            <p className="text-orange-700 mb-4">
              Votre réservation nécessite un examen de sécurité de routine.
            </p>
            <p className="text-sm text-orange-600">
              Nous vous contacterons dans les 24 heures pour finaliser votre réservation.
              Le paiement sera requis après approbation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center text-xl">Processus de réservation</CardTitle>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id <= paymentStep;
                const isCurrent = step.id === paymentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2
                      ${isActive 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'bg-gray-200 border-gray-300 text-gray-500'
                      }
                      ${isCurrent && isProcessing ? 'animate-pulse' : ''}
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Security Check Results */}
      {fraudCheckResult && fraudCheckResult.risk_score > 30 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                Vérification de sécurité effectuée. Votre transaction est protégée.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Booking Details */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Détails de la réservation
              <Badge className={getStatusColor(booking.status)}>
                {booking.status === 'confirmed' ? 'Confirmé' : 
                 booking.status === 'pending' ? 'En attente' : 
                 booking.status === 'pending_review' ? 'En examen' : booking.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{booking.service.title}</h3>
              <p className="text-gray-600">{booking.service.description}</p>
              <p className="text-purple-600 font-medium mt-1">
                avec {booking.provider.business_name}
              </p>
            </div>

            <div className="space-y-3">
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

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Adresse du service</p>
                  <p className="text-sm text-gray-600">{booking.service_address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <div className="space-y-6">
          <FeeCalculator baseAmount={booking.total_amount} />
          
          {paymentStep < 3 && booking.payment_status !== 'paid' && (
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paiement sécurisé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentButton
                  bookingId={booking.id}
                  amount={booking.total_amount * 1.06} // Include 6% HOUSIE fee
                  serviceName={booking.service.title}
                  providerName={booking.provider.business_name}
                  onPaymentStart={handlePaymentStart}
                  onPaymentComplete={handlePaymentComplete}
                />
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Paiement sécurisé par Stripe. Vos informations sont protégées.
                </p>
              </CardContent>
            </Card>
          )}

          {(paymentStep === 3 || booking.payment_status === 'paid') && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Paiement confirmé !
                </h3>
                <p className="text-green-700">
                  Votre réservation est confirmée et le prestataire sera notifié.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentFlow;
