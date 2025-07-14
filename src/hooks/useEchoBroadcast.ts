import { useState } from 'react';
import { createCanonEcho, EchoLocation, EchoVisibility, EchoSource } from '@/utils/canonEchoEngine';
import { CanonMetadata } from '@/utils/canonHelper';
import { useToast } from '@/hooks/use-toast';

interface PendingEchoBroadcast {
  message: string;
  canonMetadata: CanonMetadata;
  source?: EchoSource;
  suggestedLocation?: EchoLocation;
  job_id?: string;
  stamp_id?: string;
  prestige_title_id?: string;
}

export const useEchoBroadcast = () => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [pendingBroadcast, setPendingBroadcast] = useState<PendingEchoBroadcast | null>(null);
  const { toast } = useToast();

  const requestEchoBroadcast = (
    message: string,
    canonMetadata: CanonMetadata,
    options: {
      source?: EchoSource;
      suggestedLocation?: EchoLocation;
      job_id?: string;
      stamp_id?: string;
      prestige_title_id?: string;
    } = {}
  ) => {
    setPendingBroadcast({
      message,
      canonMetadata,
      source: options.source,
      suggestedLocation: options.suggestedLocation || 'profile',
      job_id: options.job_id,
      stamp_id: options.stamp_id,
      prestige_title_id: options.prestige_title_id
    });
    setShowBroadcastModal(true);
  };

  const handleBroadcastConfirm = async (
    location: EchoLocation,
    visibility: EchoVisibility
  ) => {
    if (!pendingBroadcast) return;

    try {
      const echoId = await createCanonEcho(
        pendingBroadcast.message,
        pendingBroadcast.canonMetadata,
        {
          source: pendingBroadcast.source || 'custom',
          location,
          visibility,
          tags: ['revolver_action', pendingBroadcast.canonMetadata.trust],
          job_id: pendingBroadcast.job_id,
          stamp_id: pendingBroadcast.stamp_id,
          prestige_title_id: pendingBroadcast.prestige_title_id
        }
      );

      if (echoId) {
        // Show Annette confirmation
        const locationMap = {
          'profile': 'your profile',
          'city-board': 'the city board',
          'map': 'the map',
          'none': 'your private logs'
        };
        
        const confirmationMessage = visibility === 'public' 
          ? `📡 Echo broadcasted to ${locationMap[location]}! The world can see your shine now, sugar! ✨`
          : `🤫 Echo saved to ${locationMap[location]}. Sometimes the best achievements are for your eyes only.`;

        toast({
          title: "Echo Broadcasted",
          description: confirmationMessage,
          duration: 3000
        });

        console.log(`🎤 Annette: ${confirmationMessage}`);
      } else {
        throw new Error('Failed to create echo');
      }
    } catch (error) {
      console.error('Error broadcasting echo:', error);
      toast({
        title: "Broadcast Failed",
        description: "Oops! Something went wrong with the broadcast. Try again, honey!",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      closeBroadcastModal();
    }
  };

  const closeBroadcastModal = () => {
    setShowBroadcastModal(false);
    setPendingBroadcast(null);
  };

  return {
    showBroadcastModal,
    pendingBroadcast,
    requestEchoBroadcast,
    handleBroadcastConfirm,
    closeBroadcastModal
  };
};