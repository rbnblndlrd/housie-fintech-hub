
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreamBadge } from "@/components/ui/cream-badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  DollarSign,
  CheckCircle,
  XCircle,
  RotateCcw,
  PlayCircle
} from 'lucide-react';

interface BookingCustomer {
  full_name: string;
  phone: string;
  email: string;
}

interface BookingService {
  title: string;
  category: string;
}

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  total_amount: number;
  service_address: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  customer: BookingCustomer;
  service: BookingService;
}

interface BookingCardProps {
  booking: Booking;
  onUpdateStatus: (bookingId: string, status: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdateStatus }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En Attente';
      case 'confirmed': return 'Confirmée';
      case 'in_progress': return 'En Cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const getAvailableActions = () => {
    switch (booking.status) {
      case 'pending':
        return [
          { action: 'confirmed', label: 'Accepter', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { action: 'cancelled', label: 'Décliner', icon: XCircle, color: 'from-red-500 to-red-600' }
        ];
      case 'confirmed':
        return [
          { action: 'in_progress', label: 'Commencer', icon: PlayCircle, color: 'from-purple-500 to-purple-600' },
          { action: 'cancelled', label: 'Annuler', icon: XCircle, color: 'from-red-500 to-red-600' }
        ];
      case 'in_progress':
        return [
          { action: 'completed', label: 'Terminer', icon: CheckCircle, color: 'from-green-500 to-emerald-500' }
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="fintech-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Main Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {booking.service.title}
                </h3>
                <CreamBadge variant={getStatusVariant(booking.status)}>
                  {getStatusText(booking.status)}
                </CreamBadge>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ${Number(booking.total_amount).toFixed(0)}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.duration_hours}h de service
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatDate(booking.scheduled_date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatTime(booking.scheduled_time)}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">
                {booking.service_address}
              </span>
            </div>

            {/* Customer Info */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 shadow-inner">
              <h4 className="font-medium text-gray-900 mb-3">Informations Client</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{booking.customer.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{booking.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{booking.customer.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="lg:w-64 space-y-3">
            <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
            {getAvailableActions().map((actionItem) => (
              <Button
                key={actionItem.action}
                onClick={() => onUpdateStatus(booking.id, actionItem.action)}
                className={`w-full bg-gradient-to-r ${actionItem.color} hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] text-white border-0 rounded-xl py-3 transition-all duration-200 hover:-translate-y-0.5`}
              >
                <actionItem.icon className="h-4 w-4 mr-2" />
                {actionItem.label}
              </Button>
            ))}
            
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl py-3 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_15px_-2px_rgba(0,0,0,0.15)] transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reprogrammer
              </Button>
            )}

            {/* Payment Status */}
            <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Paiement</span>
                <CreamBadge 
                  variant={booking.payment_status === 'paid' ? 'success' : 'warning'}
                >
                  {booking.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </CreamBadge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
