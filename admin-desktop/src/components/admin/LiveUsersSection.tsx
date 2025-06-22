
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Users, MapPin, Eye, MessageCircle, AlertCircle } from "lucide-react";
import { useSupabaseData } from "../../hooks/useSupabaseData";

const LiveUsersSection = () => {
  const { liveUsers, loading, error } = useSupabaseData();

  const handleViewUser = (userId: string, userName: string) => {
    console.log(`Viewing live user: ${userName} (ID: ${userId})`);
  };

  const handleContactUser = (userId: string, userName: string) => {
    console.log(`Contacting live user: ${userName} (ID: ${userId})`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Live Users
            <Badge variant="secondary">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading live users...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Live Users
            <Badge variant="destructive">Error</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-destructive flex items-center gap-2 justify-center">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Live Users
          <Badge variant="secondary">{liveUsers?.length || 0} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!liveUsers || liveUsers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No active users found
            </div>
          ) : (
            liveUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{user.lastSeen}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewUser(user.id, user.name)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactUser(user.id, user.name)}
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveUsersSection;
