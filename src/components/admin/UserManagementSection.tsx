
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, UserCheck, UserX, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const UserManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock user data
  const users = [
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '(514) 555-0123',
      type: 'provider',
      status: 'verified',
      joinDate: '2024-01-15',
      location: 'Montréal, QC',
      totalBookings: 147,
      rating: 4.8,
      revenue: 15240
    },
    {
      id: '2',
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '(418) 555-0456',
      type: 'customer',
      status: 'active',
      joinDate: '2024-02-20',
      location: 'Québec, QC',
      totalBookings: 23,
      rating: null,
      revenue: 0
    },
    {
      id: '3',
      name: 'Sophie Tremblay',
      email: 'sophie.tremblay@email.com',
      phone: '(450) 555-0789',
      type: 'provider',
      status: 'pending',
      joinDate: '2024-06-10',
      location: 'Laval, QC',
      totalBookings: 0,
      rating: null,
      revenue: 0
    },
    {
      id: '4',
      name: 'Pierre Gagnon',
      email: 'pierre.gagnon@email.com',
      phone: '(819) 555-0321',
      type: 'customer',
      status: 'active',
      joinDate: '2024-03-05',
      location: 'Gatineau, QC',
      totalBookings: 8,
      rating: null,
      revenue: 0
    },
    {
      id: '5',
      name: 'Claudette Bouchard',
      email: 'claudette.bouchard@email.com',
      phone: '(514) 555-0654',
      type: 'provider',
      status: 'verified',
      joinDate: '2024-01-30',
      location: 'Montréal, QC',
      totalBookings: 89,
      rating: 4.6,
      revenue: 9870
    }
  ];

  const getStatusBadge = (status, type) => {
    if (type === 'provider') {
      switch (status) {
        case 'verified':
          return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Vérifié</Badge>;
        case 'pending':
          return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En attente</Badge>;
        case 'rejected':
          return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejeté</Badge>;
        default:
          return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactif</Badge>;
      }
    } else {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Actif</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    return type === 'provider' 
      ? <Badge variant="outline" className="border-purple-200 text-purple-800">Prestataire</Badge>
      : <Badge variant="outline" className="border-blue-200 text-blue-800">Client</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs Totaux</p>
                <p className="text-3xl font-black text-gray-900">15,847</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Prestataires Vérifiés</p>
                <p className="text-3xl font-black text-gray-900">3,246</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">En Attente d'Approbation</p>
                <p className="text-3xl font-black text-gray-900">127</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Nouveaux (30j)</p>
                <p className="text-3xl font-black text-gray-900">489</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              Gestion des Utilisateurs
            </CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 rounded-xl border-gray-200"
                />
              </div>
              <Button variant="outline" className="rounded-xl border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Utilisateur</TableHead>
                  <TableHead className="font-semibold text-gray-700">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                  <TableHead className="font-semibold text-gray-700">Localisation</TableHead>
                  <TableHead className="font-semibold text-gray-700">Réservations</TableHead>
                  <TableHead className="font-semibold text-gray-700">Note</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(user.type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status, user.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {user.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{user.totalBookings}</div>
                    </TableCell>
                    <TableCell>
                      {user.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-gray-900">{user.rating}</span>
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
                        {user.status === 'pending' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-lg">
                            Approuver
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementSection;
