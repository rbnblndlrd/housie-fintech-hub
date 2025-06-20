
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCheck, RefreshCw } from 'lucide-react';
import UserTableFilters from './UserTableFilters';
import UserTableRow from './UserTableRow';

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

interface UserManagementTableProps {
  users: User[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  onRefresh: () => void;
  onUpdateSubscription: (userId: string, newTier: string) => void;
  onDeleteUser: (userId: string) => void;
  updatingSubscription: string | null;
  deleting: string | null;
}

const UserManagementTable = ({
  users,
  loading,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onRefresh,
  onUpdateSubscription,
  onDeleteUser,
  updatingSubscription,
  deleting
}: UserManagementTableProps) => {
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'providers') return matchesSearch && user.can_provide;
    if (filterStatus === 'customers') return matchesSearch && !user.can_provide;
    
    return matchesSearch;
  });

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            Gestion des Utilisateurs
          </CardTitle>
          <UserTableFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onRefresh={onRefresh}
            loading={loading}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Utilisateur</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                  <TableHead className="font-semibold text-gray-700">Abonnement</TableHead>
                  <TableHead className="font-semibold text-gray-700">Localisation</TableHead>
                  <TableHead className="font-semibold text-gray-700">Réservations</TableHead>
                  <TableHead className="font-semibold text-gray-700">Note</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onUpdateSubscription={onUpdateSubscription}
                    onDeleteUser={onDeleteUser}
                    updatingSubscription={updatingSubscription}
                    deleting={deleting}
                  />
                ))}
                {filteredUsers.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagementTable;
