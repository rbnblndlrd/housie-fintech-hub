
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, CreditCard, Star, Calendar, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  booking_id?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_booking',
    title: 'Nouvelle réservation',
    message: 'Vous avez reçu une nouvelle réservation pour le service de nettoyage de bureau. Le client souhaite programmer l\'intervention pour demain matin.',
    read: false,
    created_at: new Date().toISOString(),
    booking_id: 'booking-1',
  },
  {
    id: '2',
    type: 'booking_confirmed',
    title: 'Réservation confirmée',
    message: 'Votre réservation pour l\'entretien du jardin a été confirmée par le prestataire. Rendez-vous prévu vendredi à 14h.',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    booking_id: 'booking-2',
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Paiement reçu',
    message: 'Vous avez reçu un paiement de 150€ pour votre service de nettoyage. Le montant sera crédité sur votre compte sous 2-3 jours ouvrés.',
    read: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    booking_id: 'booking-3',
  },
  {
    id: '4',
    type: 'review_received',
    title: 'Nouvel avis client',
    message: 'Un client a laissé un avis 5 étoiles pour votre service de construction. "Excellent travail, très professionnel et ponctuel!"',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    type: 'booking_cancelled',
    title: 'Réservation annulée',
    message: 'La réservation prévue pour lundi prochain a été annulée par le client. Vous pouvez maintenant accepter d\'autres demandes pour ce créneau.',
    read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    booking_id: 'booking-5',
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'booking_confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment_received':
        return <CreditCard className="h-5 w-5 text-emerald-500" />;
      case 'review_received':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'booking_cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary">
      <Header />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-2xl">Notifications</CardTitle>
                  {unreadCount > 0 && (
                    <Badge variant="destructive">
                      {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune notification pour le moment</p>
                </div>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatDistanceToNow(new Date(notification.created_at), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2 ml-4"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
