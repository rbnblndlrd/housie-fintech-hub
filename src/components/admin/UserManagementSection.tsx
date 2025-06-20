import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/adminService';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import UserStatsCards from './user-management/UserStatsCards';
import UserManagementTable from './user-management/UserManagementTable';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  user_role?: string;
  can_provide?: boolean;
  city?: string;
  province?: string;
  subscription_tier?: string;
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
  const [updatingSubscription, setUpdatingSubscription] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const checkAdminStatus = async () => {
    try {
      setAdminCheckLoading(true);
      
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const isUserAdmin = await adminService.checkAdminStatus(user.id);
      setIsAdmin(isUserAdmin);
      console.log('Admin status:', isUserAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckLoading(false);
    }
  };

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
          subscription_tier,
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

  const updateUserSubscription = async (userId: string, newTier: string) => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Privilèges administrateur requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingSubscription(userId);
      
      // OPTIMISTIC UPDATE: Update UI immediately
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, subscription_tier: newTier } : user
      ));

      const result = await adminService.updateUserSubscription(userId, newTier);

      if (!result.success) {
        // Revert optimistic update on error
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, subscription_tier: user.subscription_tier } : user
        ));
        toast({
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour l'abonnement",
          variant: "destructive",
        });
        return;
      }

      // IMMEDIATE REFRESH: Refresh users list after successful update
      await fetchUsers();

      toast({
        title: "Succès",
        description: `Abonnement mis à jour vers ${newTier}`,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      // Revert optimistic update on error
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, subscription_tier: user.subscription_tier } : user
      ));
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setUpdatingSubscription(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Privilèges administrateur requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setDeleting(userId);
      
      const result = await adminService.deleteUser(userId);

      if (!result.success) {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });

      // IMMEDIATE REFRESH: Refresh users list after successful deletion
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

  // REAL-TIME: Set up Supabase realtime subscriptions using the hook
  useRealtimeSubscription({
    table: 'users',
    event: '*',
    schema: 'public',
    enabled: isAdmin,
    onUpdate: (payload) => {
      console.log('Real-time user change detected:', payload);
      
      // Refresh users list when any change is detected
      fetchUsers();
      
      // Show toast for real-time updates
      if (payload.eventType === 'UPDATE') {
        toast({
          title: "Mise à jour en temps réel",
          description: "Les données utilisateur ont été mises à jour",
        });
      } else if (payload.eventType === 'INSERT') {
        toast({
          title: "Nouveau utilisateur",
          description: "Un nouvel utilisateur s'est inscrit",
        });
      } else if (payload.eventType === 'DELETE') {
        toast({
          title: "Utilisateur supprimé",
          description: "Un utilisateur a été supprimé",
        });
      }
    }
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (!adminCheckLoading) {
      fetchUsers();
    }
  }, [adminCheckLoading]);

  if (adminCheckLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Vérification des privilèges administrateur...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les privilèges administrateur requis pour accéder à cette section.</p>
        </div>
      </div>
    );
  }

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
      <UserStatsCards
        totalUsers={totalUsers}
        verifiedProviders={verifiedProviders}
        pendingProviders={pendingProviders}
        newUsersLast30Days={newUsersLast30Days}
      />

      <UserManagementTable
        users={users}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onRefresh={fetchUsers}
        onUpdateSubscription={updateUserSubscription}
        onDeleteUser={deleteUser}
        updatingSubscription={updatingSubscription}
        deleting={deleting}
      />
    </div>
  );
};

export default UserManagementSection;
