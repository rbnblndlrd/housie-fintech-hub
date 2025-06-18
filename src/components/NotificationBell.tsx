
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreamPill } from '@/components/ui/cream-pill';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'new_booking',
    title: 'Nouvelle réservation',
    message: 'Vous avez reçu une nouvelle réservation pour le service de nettoyage.',
    read: false,
    created_at: new Date().toISOString(),
    booking_id: 'booking-1',
  },
  {
    id: '2',
    type: 'booking_confirmed',
    title: 'Réservation confirmée',
    message: 'Votre réservation a été confirmée par le prestataire.',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    booking_id: 'booking-2',
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Paiement reçu',
    message: 'Vous avez reçu un paiement de 150€ pour votre service.',
    read: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    booking_id: 'booking-3',
  },
  {
    id: '4',
    type: 'review_received',
    title: 'Nouvel avis',
    message: 'Un client a laissé un avis 5 étoiles pour votre service.',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <CreamPill 
              variant="notification" 
              size="default"
              className="absolute -top-1 -right-1"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </CreamPill>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
