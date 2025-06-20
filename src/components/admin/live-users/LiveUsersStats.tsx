
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, MapPin, Activity, Globe } from 'lucide-react';

interface UserSession {
  id: string;
  region: string | null;
  city: string | null;
  last_activity: string | null;
}

interface LiveUsersStatsProps {
  sessions: UserSession[];
}

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

const LiveUsersStats: React.FC<LiveUsersStatsProps> = ({ sessions }) => {
  const totalActiveUsers = sessions.length;
  const quebecUsers = sessions.filter(s => s.region?.includes('Quebec') || s.region?.includes('Québec')).length;
  const onlineUsers = sessions.filter(s => getActivityStatus(s.last_activity).status === 'online').length;
  const uniqueCities = new Set(sessions.filter(s => s.city).map(s => s.city)).size;

  return (
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
              <p className="text-3xl font-black text-gray-900">{quebecUsers}</p>
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
              <p className="text-3xl font-black text-gray-900">{onlineUsers}</p>
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
              <p className="text-3xl font-black text-gray-900">{uniqueCities}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveUsersStats;
