
import React from 'react';
import { ChatBubble } from './chat/ChatBubble';
import { NotificationBubbles } from './chat/NotificationBubbles';
import { useEnhancedNotifications } from '@/hooks/useEnhancedNotifications';

export const ChatAssistant = () => {
  // Initialize enhanced notification system
  useEnhancedNotifications();

  return (
    <>
      <ChatBubble />
      <NotificationBubbles />
    </>
  );
};

export default ChatAssistant;
