
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Mail, Phone, MapPin, Trash2, RefreshCw } from 'lucide-react';
import { getStatusBadge, getTypeBadge, getSubscriptionBadge } from './UserBadges';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  can_provide?: boolean;
  city?: string;
  province?: string;
  subscription_tier?: string;
  provider_profile?: {
    verified?: boolean;
    total_bookings?: number;
    average_rating?: number;
  };
}

interface UserTableRowProps {
  user: User;
  onUpdateSubscription: (userId: string, newTier: string) => void;
  onDeleteUser: (userId: string) => void;
  updatingSubscription: string | null;
  deleting: string | null;
}

const UserTableRow = ({
  user,
  onUpdateSubscription,
  onDeleteUser,
  updatingSubscription,
  deleting
}: UserTableRowProps) => {
  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell>
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{user.full_name}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
          {user.phone && (
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {user.phone}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {getTypeBadge(user)}
      </TableCell>
      <TableCell>
        {getStatusBadge(user)}
      </TableCell>
      <TableCell>
        <Select
          value={user.subscription_tier || 'free'}
          onValueChange={(value) => onUpdateSubscription(user.id, value)}
          disabled={updatingSubscription === user.id}
        >
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue>
              {updatingSubscription === user.id ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                getSubscriptionBadge(user.subscription_tier)
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="h-3 w-3" />
          {user.city && user.province ? `${user.city}, ${user.province}` : '—'}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-semibold text-gray-900">
          {user.provider_profile?.total_bookings || 0}
        </div>
      </TableCell>
      <TableCell>
        {user.provider_profile?.average_rating ? (
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900">
              {user.provider_profile.average_rating.toFixed(1)}
            </span>
            <span className="text-yellow-500">★</span>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-lg">
            Voir
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                disabled={deleting === user.id}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.full_name}</strong> ?
                  Cette action est irréversible et supprimera toutes les données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDeleteUser(user.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
