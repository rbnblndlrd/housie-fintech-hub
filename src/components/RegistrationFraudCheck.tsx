
import React, { useEffect, useState } from 'react';
import { useFraudDetection } from '@/hooks/useFraudDetection';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RegistrationFraudCheckProps {
  userId: string;
  email: string;
  onComplete: (success: boolean) => void;
}

const RegistrationFraudCheck: React.FC<RegistrationFraudCheckProps> = ({
  userId,
  email,
  onComplete
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [result, setResult] = useState<any>(null);
  const { performFraudCheck } = useFraudDetection();
  const { toast } = useToast();

  useEffect(() => {
    const performCheck = async () => {
      try {
        // Get user's IP for fraud detection
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        const fraudResult = await performFraudCheck({
          action_type: 'registration',
          user_id: userId,
          ip_address: ipData.ip,
          user_agent: navigator.userAgent,
          metadata: {
            email: email,
            registration_time: new Date().toISOString()
          }
        });

        setResult(fraudResult);

        if (fraudResult?.action === 'block') {
          toast({
            title: "Inscription non autorisée",
            description: "Votre inscription ne peut pas être complétée pour des raisons de sécurité.",
            variant: "destructive",
          });
          onComplete(false);
        } else if (fraudResult?.action === 'require_verification') {
          toast({
            title: "Vérification requise",
            description: "Une vérification supplémentaire est nécessaire. Vérifiez votre email.",
          });
          onComplete(true); // Allow registration but require verification
        } else if (fraudResult?.action === 'review') {
          toast({
            title: "Compte en cours d'examen",
            description: "Votre compte sera examiné dans les 24 heures.",
          });
          onComplete(true);
        } else {
          // Allow registration
          onComplete(true);
        }
      } catch (error) {
        console.error('Registration fraud check error:', error);
        // Don't block registration on fraud check failure
        onComplete(true);
      } finally {
        setIsChecking(false);
      }
    };

    performCheck();
  }, [userId, email, performFraudCheck, onComplete, toast]);

  if (!isChecking && (!result || result.action === 'allow')) {
    return null; // Don't show anything for successful registrations
  }

  return (
    <Card className="mb-4">
      <CardContent className="py-4">
        {isChecking ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Shield className="h-5 w-5 animate-pulse" />
            <span>Vérification de sécurité en cours...</span>
          </div>
        ) : result?.action === 'review' ? (
          <div className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Compte créé - Examen de sécurité en cours</span>
          </div>
        ) : result?.action === 'require_verification' ? (
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Vérification supplémentaire requise</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Vérification de sécurité réussie</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationFraudCheck;
