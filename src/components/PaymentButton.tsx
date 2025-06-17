
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  serviceName: string;
  providerName: string;
  onPaymentStart?: () => void;
  onPaymentComplete?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  bookingId,
  amount,
  serviceName,
  providerName,
  onPaymentStart,
  onPaymentComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour effectuer un paiement.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    onPaymentStart?.();

    try {
      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          booking_id: bookingId,
          amount: Math.round(amount * 100), // Convert to cents
          service_name: serviceName,
          provider_name: providerName,
        },
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de la création du paiement');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Traitement...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5 mr-2" />
          Payer {amount.toFixed(2)}$ CAD
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
