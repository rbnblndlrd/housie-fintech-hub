import { useState, useCallback } from 'react';
import { BroadcastScope, BroadcastEventType, createBroadcastEvent, updateBroadcastPreferences } from '@/utils/broadcastEngine';
import { CanonMetadata } from '@/utils/canonHelper';

interface UseBroadcastConsentReturn {
  showConsentModal: boolean;
  pendingBroadcast: PendingBroadcast | null;
  requestBroadcastConsent: (
    eventType: BroadcastEventType,
    content: string,
    canonMetadata: CanonMetadata
  ) => void;
  handleConsent: (consent: boolean, scope: BroadcastScope, rememberChoice: boolean) => Promise<void>;
  closeConsentModal: () => void;
}

interface PendingBroadcast {
  eventType: BroadcastEventType;
  content: string;
  canonMetadata: CanonMetadata;
}

export const useBroadcastConsent = (): UseBroadcastConsentReturn => {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingBroadcast, setPendingBroadcast] = useState<PendingBroadcast | null>(null);

  const requestBroadcastConsent = useCallback((
    eventType: BroadcastEventType,
    content: string,
    canonMetadata: CanonMetadata
  ) => {
    // Only show consent for Canon insights with decent confidence
    if (canonMetadata.trust !== 'canon' || (canonMetadata.confidence || 0) < 0.7) {
      return;
    }

    setPendingBroadcast({
      eventType,
      content,
      canonMetadata
    });
    setShowConsentModal(true);
  }, []);

  const handleConsent = useCallback(async (
    consent: boolean,
    scope: BroadcastScope,
    rememberChoice: boolean
  ) => {
    if (!pendingBroadcast) return;

    if (consent) {
      // Create the broadcast event
      await createBroadcastEvent(
        pendingBroadcast.eventType,
        pendingBroadcast.content,
        pendingBroadcast.canonMetadata,
        scope
      );
    }

    // Update preferences if user chose to remember
    if (rememberChoice) {
      await updateBroadcastPreferences({
        auto_broadcast_achievements: consent,
        public_echo_participation: consent
      });
    }

    // Close modal and clear pending broadcast
    setShowConsentModal(false);
    setPendingBroadcast(null);
  }, [pendingBroadcast]);

  const closeConsentModal = useCallback(() => {
    setShowConsentModal(false);
    setPendingBroadcast(null);
  }, []);

  return {
    showConsentModal,
    pendingBroadcast,
    requestBroadcastConsent,
    handleConsent,
    closeConsentModal
  };
};