
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
    const iconProps = "h-6 w-6";
    const iconBg = "w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]";
    
    switch (type) {
      case 'new_booking':
        return <div className={`${iconBg} bg-gradient-to-r from-blue-500 to-blue-600`}><Calendar className={`${iconProps} text-white`} /></div>;
      case 'booking_confirmed':
        return <div className={`${iconBg} bg-gradient-to-r from-green-500 to-emerald-500`}><CheckCircle className={`${iconProps} text-white`} /></div>;
      case 'payment_received':
        return <div className={`${iconBg} bg-gradient-to-r from-emerald-500 to-teal-500`}><CreditCard className={`${iconProps} text-white`} /></div>;
      case 'review_received':
        return <div className={`${iconBg} bg-gradient-to-r from-yellow-500 to-orange-500`}><Star className={`${iconProps} text-white`} /></div>;
      case 'booking_cancelled':
        return <div className={`${iconBg} bg-gradient-to-r from-red-500 to-red-600`}><X className={`${iconProps} text-white`} /></div>;
      default:
        return <div className={`${iconBg} bg-gradient-to-r from-gray-500 to-gray-600`}><Clock className={`${iconProps} text-white`} /></div>;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <Header />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Notifications
            </h1>
            <p className="text-xl text-gray-600">Restez informé de toutes vos activités</p>
          </div>

          <Card className="fintech-card">
            <CardHeader className="border-b border-gray-100 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Notifications</CardTitle>
                    {unreadCount > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-[0_2px_10px_-2px_rgba(239,68,68,0.3)] mt-2">
                        {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
                {unreadCount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="rounded-2xl border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 transition-all duration-200"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Bell className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune notification</h3>
                  <p className="text-gray-600 text-lg">Aucune notification pour le moment</p>
                </div>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 cursor-pointer transition-all duration-200 ${
                          !notification.read ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-6">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-lg font-bold text-gray-900 mb-2">
                                  {notification.title}
                                </p>
                                <p className="text-base text-gray-600 leading-relaxed mb-3">
                                  {notification.message}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                  {formatDistanceToNow(new Date(notification.created_at), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0 mt-2 ml-4 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.5)]"></div>
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
