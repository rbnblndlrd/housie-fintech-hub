
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Activity, Clock, Eye, Globe, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LiveUsersMap } from './LiveUsersMap';
import { SessionTracker } from './SessionTracker';

interface UserSession {
  id: string;
  user_id: string | null;
  session_token: string;
  ip_address: string | null;
  user_agent: string | null;
  current_page: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  login_time: string | null;
  last_activity: string | null;
  is_active: boolean | null;
  user?: {
    full_name: string;
    email: string;
  };
}

const LiveUsersSection = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load active sessions
  const loadActiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          users:user_id (
            full_name,
            email
          )
        `)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;

      // Type the data properly
      const typedSessions = (data || []).map(session => ({
        ...session,
        ip_address: session.ip_address ? String(session.ip_address) : null,
        user: Array.isArray(session.users) ? session.users[0] : session.users
      })) as UserSession[];

      setSessions(typedSessions);
      setTotalActiveUsers(typedSessions.length);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    loadActiveSessions();

    const channel = supabase
      .channel('user-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions'
        },
        (payload) => {
          console.log('Session change:', payload);
          loadActiveSessions(); // Reload data on any change
        }
      )
      .subscribe();

    // Set up periodic cleanup
    const cleanupInterval = setInterval(async () => {
      try {
        await supabase.rpc('cleanup_inactive_sessions');
        loadActiveSessions();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }, 60000); // Every minute

    return () => {
      supabase.removeChannel(channel);
      clearInterval(cleanupInterval);
    };
  }, []);

  const maskIpAddress = (ip: string | null) => {
    if (!ip) return 'Unknown';
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    return ip.length > 8 ? `${ip.substring(0, 8)}...` : ip;
  };

  const formatDuration = (loginTime: string | null) => {
    if (!loginTime) return 'Unknown';
    const now = new Date();
    const login = new Date(loginTime);
    const diff = now.getTime() - login.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getActivityStatus = (lastActivity: string | null) => {
    if (!lastActivity) return { status: 'idle', label: 'Idle', color: 'bg-gray-500' };
    
    const now = new Date();
    const activity = new Date(lastActivity);
    const diff = now.getTime() - activity.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 2) return { status: 'online', label: 'Active', color: 'bg-green-500' };
    if (minutes < 10) return { status: 'away', label: 'Away', color: 'bg-yellow-500' };
    return { status: 'idle', label: 'Idle', color: 'bg-gray-500' };
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="fintech-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Session Tracker Component */}
      <SessionTracker />

      {/* Live Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs Actifs</p>
                <p className="text-3xl font-black text-gray-900">{totalActiveUsers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Wifi className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Connexions Québec</p>
                <p className="text-3xl font-black text-gray-900">
                  {sessions.filter(s => s.region?.includes('Quebec') || s.region?.includes('Québec')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs En Ligne</p>
                <p className="text-3xl font-black text-gray-900">
                  {sessions.filter(s => getActivityStatus(s.last_activity).status === 'online').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Villes Uniques</p>
                <p className="text-3xl font-black text-gray-900">
                  {new Set(sessions.filter(s => s.city).map(s => s.city)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simplified Live Users Map */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            Carte des Utilisateurs Actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-xl overflow-hidden">
            <LiveUsersMap sessions={sessions} />
          </div>
        </CardContent>
      </Card>

      {/* Live Users Table */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              Utilisateurs Connectés en Temps Réel
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Mise à jour en direct</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Utilisateur</TableHead>
                  <TableHead className="font-semibold text-gray-700">Page Actuelle</TableHead>
                  <TableHead className="font-semibold text-gray-700">Localisation</TableHead>
                  <TableHead className="font-semibold text-gray-700">IP Masquée</TableHead>
                  <TableHead className="font-semibold text-gray-700">Durée Session</TableHead>
                  <TableHead className="font-semibold text-gray-700">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const activityStatus = getActivityStatus(session.last_activity);
                  return (
                    <TableRow key={session.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {session.user?.full_name || 'Utilisateur Anonyme'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.user?.email || 'Non connecté'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{session.current_page || '/dashboard'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="font-medium text-sm">
                              {session.city ? `${session.city}, ${session.region}` : 'Localisation inconnue'}
                            </span>
                          </div>
                          {session.country && (
                            <div className="text-xs text-gray-500">{session.country}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {maskIpAddress(session.ip_address)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{formatDuration(session.login_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${activityStatus.color} text-white hover:${activityStatus.color}/80`}>
                          {activityStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {sessions.length === 0 && (
              <div className="text-center py-12">
                <WifiOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun utilisateur actif pour le moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveUsersSection;
