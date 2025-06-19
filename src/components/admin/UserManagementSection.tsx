
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Filter, UserCheck, UserX, Mail, Phone, MapPin, Calendar, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  user_role?: string;
  can_provide?: boolean;
  city?: string;
  province?: string;
  created_at: string;
  provider_profile?: {
    verified?: boolean;
    total_bookings?: number;
    average_rating?: number;
  };
}

const UserManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          phone,
          user_role,
          can_provide,
          city,
          province,
          created_at,
          provider_profiles (
            verified,
            total_bookings,
            average_rating
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        });
        return;
      }

      const formattedUsers = data?.map(user => ({
        ...user,
        provider_profile: user.provider_profiles?.[0] || null
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setDeleting(userId);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getStatusBadge = (user: User) => {
    if (user.can_provide && user.provider_profile) {
      if (user.provider_profile.verified) {
        return <CreamBadge variant="success">Prestataire Vérifié</CreamBadge>;
      } else {
        return <CreamBadge variant="warning">Prestataire En Attente</CreamBadge>;
      }
    }
    return <CreamBadge variant="info">Client</CreamBadge>;
  };

  const getTypeBadge = (user: User) => {
    return user.can_provide 
      ? <CreamBadge variant="default">Prestataire</CreamBadge>
      : <CreamBadge variant="info">Client</CreamBadge>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'providers') return matchesSearch && user.can_provide;
    if (filterStatus === 'customers') return matchesSearch && !user.can_provide;
    
    return matchesSearch;
  });

  // Calculate stats from real data
  const totalUsers = users.length;
  const verifiedProviders = users.filter(u => u.can_provide && u.provider_profile?.verified).length;
  const pendingProviders = users.filter(u => u.can_provide && !u.provider_profile?.verified).length;
  const newUsersLast30Days = users.filter(u => {
    const created = new Date(u.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return created > thirtyDaysAgo;
  }).length;

  return (
    <div className="space-y-8">
      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs Totaux</p>
                <p className="text-3xl font-black text-gray-900">{totalUsers.toLocaleString()}</p>
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
                <p className="text-3xl font-black text-gray-900">{verifiedProviders.toLocaleString()}</p>
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
                <p className="text-3xl font-black text-gray-900">{pendingProviders.toLocaleString()}</p>
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
                <p className="text-3xl font-black text-gray-900">{newUsersLast30Days.toLocaleString()}</p>
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
              <Button 
                variant="outline" 
                onClick={fetchUsers}
                disabled={loading}
                className="rounded-xl border-gray-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 rounded-xl border-gray-200"
                />
              </div>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl bg-white"
              >
                <option value="all">Tous</option>
                <option value="providers">Prestataires</option>
                <option value="customers">Clients</option>
              </select>
            </div>
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
                    <TableHead className="font-semibold text-gray-700">Localisation</TableHead>
                    <TableHead className="font-semibold text-gray-700">Réservations</TableHead>
                    <TableHead className="font-semibold text-gray-700">Note</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
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
                                  onClick={() => deleteUser(user.id)}
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
                  ))}
                  {filteredUsers.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
    </div>
  );
};

export default UserManagementSection;
