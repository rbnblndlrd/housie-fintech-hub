
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useFraudDetection } from '@/hooks/useFraudDetection';

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
  const { performFraudCheck } = useFraudDetection();

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP:', error);
      return null;
    }
  };

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
      // Get user's IP for fraud detection
      const ipAddress = await getClientIP();

      // Perform fraud check before payment
      console.log('Performing fraud check for payment...');
      const fraudResult = await performFraudCheck({
        action_type: 'payment',
        user_id: user.id,
        ip_address: ipAddress,
        user_agent: navigator.userAgent,
        metadata: {
          booking_id: bookingId,
          amount: amount,
          service_name: serviceName,
          provider_name: providerName
        }
      });

      if (!fraudResult) {
        throw new Error('Fraud check failed');
      }

      // Handle different fraud detection actions
      if (fraudResult.action === 'block') {
        toast({
          title: "Paiement non autorisé",
          description: "Votre transaction ne peut pas être traitée pour des raisons de sécurité. Contactez le support.",
          variant: "destructive",
        });
        return;
      }

      if (fraudResult.action === 'require_verification') {
        toast({
          title: "Vérification de sécurité requise",
          description: "Une vérification supplémentaire est nécessaire avant le paiement. Vérifiez votre email.",
          variant: "destructive",
        });
        return;
      }

      if (fraudResult.action === 'review') {
        toast({
          title: "Paiement en cours d'examen",
          description: "Votre paiement est en cours d'examen. Nous vous contacterons sous peu.",
        });
        // Continue with payment creation but don't redirect to Stripe yet
      }

      // If fraud check passes, proceed with payment
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
        // Show security message for high-risk payments
        if (fraudResult.risk_score > 40) {
          toast({
            title: "Paiement sécurisé",
            description: "Votre transaction a été vérifiée. Redirection vers le paiement sécurisé...",
          });
        }
        
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
    <div className="space-y-3">
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Vérification en cours...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Payer {amount.toFixed(2)}$ CAD
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Shield className="h-3 w-3" />
        <span>Paiement sécurisé avec vérification anti-fraude</span>
      </div>
    </div>
  );
};

export default PaymentButton;
