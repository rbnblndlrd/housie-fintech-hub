
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, UserCheck, UserPlus, RefreshCw, Trash2, Edit } from 'lucide-react';
import { UserManagementService, type User, type UserStats } from '../services/userManagementService';
import { toast } from 'sonner';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('👥 Loading users...');
      
      const userData = await UserManagementService.loadUsers();
      setUsers(userData);
      
      const userStats = UserManagementService.calculateUserStats(userData);
      setStats(userStats);

      console.log('✅ Users loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load users:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (userId: string, newTier: string) => {
    try {
      setActionLoading(userId);
      await UserManagementService.updateUserSubscription(userId, newTier);
      await loadUsers(); // Refresh data
      toast.success(`Subscription updated to ${newTier}`);
    } catch (error) {
      console.error('❌ Failed to update subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(userId);
      await UserManagementService.deleteUser(userId);
      await loadUsers(); // Refresh data
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete user:', error);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'providers') return matchesSearch && user.can_provide;
    if (filterStatus === 'seekers') return matchesSearch && !user.can_provide;
    if (filterStatus === 'verified') return matchesSearch && user.provider_profile?.verified;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg">Loading user management data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>
        <Button onClick={loadUsers} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-xs text-gray-500">All registered users</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.verifiedProviders}</div>
              <div className="text-sm text-gray-600">Verified Providers</div>
              <div className="text-xs text-gray-500">Background checked</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingProviders}</div>
              <div className="text-sm text-gray-600">Pending Approval</div>
              <div className="text-xs text-gray-500">Awaiting verification</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.newUsersLast30Days}</div>
              <div className="text-sm text-gray-600">New (30d)</div>
              <div className="text-xs text-gray-500">Recent signups</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="providers">Providers</option>
              <option value="seekers">Seekers</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
            <Badge variant="outline">{filteredUsers.length} users</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{user.full_name}</span>
                    <Badge variant={user.can_provide ? 'default' : 'secondary'}>
                      {user.can_provide ? 'Provider' : 'Seeker'}
                    </Badge>
                    {user.provider_profile?.verified && (
                      <Badge className="bg-green-600 text-white">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {user.email} {user.phone && `• ${user.phone}`}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Status: {user.subscription_tier || 'free'}</span>
                    <span>Location: {user.city || 'N/A'}, {user.province || 'N/A'}</span>
                    <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                    {user.provider_profile && (
                      <span>Bookings: {user.provider_profile.total_bookings || 0}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={user.subscription_tier || 'free'}
                    onChange={(e) => handleUpdateSubscription(user.id, e.target.value)}
                    disabled={actionLoading === user.id}
                    className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log('View user:', user.id)}
                    disabled={actionLoading === user.id}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={actionLoading === user.id}
                  >
                    {actionLoading === user.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching the current filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementDashboard;
