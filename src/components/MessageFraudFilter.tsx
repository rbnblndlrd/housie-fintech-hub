
import React, { useState } from 'react';
import { useFraudDetection } from '@/hooks/useFraudDetection';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MessageFraudFilterProps {
  message: string;
  onResult: (approved: boolean, reason?: string) => void;
  children: React.ReactNode;
}

const MessageFraudFilter: React.FC<MessageFraudFilterProps> = ({
  message,
  onResult,
  children
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const { performFraudCheck } = useFraudDetection();
  const { user } = useAuth();
  const { toast } = useToast();

  const checkMessage = async () => {
    if (!user || !message.trim()) {
      onResult(true);
      return;
    }

    setIsChecking(true);

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();

      const fraudResult = await performFraudCheck({
        action_type: 'messaging',
        user_id: user.id,
        ip_address: ipData.ip,
        user_agent: navigator.userAgent,
        metadata: {
          content: message,
          message_length: message.length
        }
      });

      if (fraudResult?.action === 'block') {
        setBlocked(true);
        toast({
          title: "Message bloqué",
          description: "Votre message contient du contenu non autorisé.",
          variant: "destructive",
        });
        onResult(false, "Message bloqué pour violation des politiques");
      } else if (fraudResult?.action === 'review') {
        toast({
          title: "Message en cours d'examen",
          description: "Votre message sera examiné avant d'être envoyé.",
        });
        onResult(true, "Message en cours d'examen");
      } else {
        onResult(true);
      }
    } catch (error) {
      console.error('Message fraud check error:', error);
      // Don't block messages on fraud check failure
      onResult(true);
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check when message changes (with debounce)
  React.useEffect(() => {
    if (message.trim() && message.length > 10) {
      const timer = setTimeout(() => {
        checkMessage();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (blocked) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Ce message ne peut pas être envoyé car il viole nos politiques de contenu.
          Veuillez modifier votre message et réessayer.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative">
      {children}
      {isChecking && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded">
          <div className="flex items-center gap-2 text-blue-600 bg-white px-3 py-1 rounded shadow">
            <Shield className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Vérification...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageFraudFilter;
