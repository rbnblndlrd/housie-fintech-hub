
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Eye, Clock, WifiOff } from 'lucide-react';

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

interface LiveUsersTableProps {
  sessions: UserSession[];
}

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

const LiveUsersTable: React.FC<LiveUsersTableProps> = ({ sessions }) => {
  return (
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
  );
};

export default LiveUsersTable;
