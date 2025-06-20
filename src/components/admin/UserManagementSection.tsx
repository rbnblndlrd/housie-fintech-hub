
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
    try {
      setUpdatingSubscription(userId);
      
      const { error } = await supabase
        .from('users')
        .update({ subscription_tier: newTier })
        .eq('id', userId);

      if (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'abonnement",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, subscription_tier: newTier } : user
      ));

      toast({
        title: "Succès",
        description: `Abonnement mis à jour vers ${newTier}`,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
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
