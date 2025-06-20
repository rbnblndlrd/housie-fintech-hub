
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { LiveUsersMap } from '../LiveUsersMap';

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

interface LiveUsersMapCardProps {
  sessions: UserSession[];
}

const LiveUsersMapCard: React.FC<LiveUsersMapCardProps> = ({ sessions }) => {
  return (
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
  );
};

export default LiveUsersMapCard;
