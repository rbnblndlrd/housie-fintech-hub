import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle } from 'lucide-react';

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

interface LiveUsersMapSafeProps {
  sessions: UserSession[];
}

const LiveUsersMapSafe: React.FC<LiveUsersMapSafeProps> = ({ sessions }) => {
  const sessionsWithLocation = sessions.filter(session => 
    session.latitude && session.longitude && session.city
  );

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          Live User Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Mapbox Integration</p>
            <p className="text-sm text-gray-500">
              {sessionsWithLocation.length} users with location data
            </p>
          </div>
        </div>
        
        {/* Location List as Primary Display */}
        <div className="mt-4 max-h-48 overflow-y-auto">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Active User Locations:</h4>
          <div className="space-y-2">
            {sessionsWithLocation.slice(0, 10).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg text-sm">
                <div>
                  <span className="font-medium">
                    {session.user?.full_name || 'Anonymous User'}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {session.city}, {session.region}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {session.current_page || 'Unknown page'}
                </div>
              </div>
            ))}
            {sessionsWithLocation.length > 10 && (
              <div className="text-xs text-gray-500 text-center py-2">
                ... and {sessionsWithLocation.length - 10} more users
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveUsersMapSafe;