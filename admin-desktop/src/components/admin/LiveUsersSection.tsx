
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Users, MapPin, Activity } from "lucide-react";

const LiveUsersSection = () => {
  // Mock data for demo purposes
  const liveUsers = [
    { id: 1, name: "John Doe", location: "Toronto, ON", status: "active", lastSeen: "2 min ago" },
    { id: 2, name: "Jane Smith", location: "Vancouver, BC", status: "booking", lastSeen: "5 min ago" },
    { id: 3, name: "Mike Johnson", location: "Montreal, QC", status: "browsing", lastSeen: "1 min ago" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Live Users
          <Badge variant="secondary">{liveUsers.length} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liveUsers.map((user) => (
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
              <div className="text-right">
                <Badge variant={user.status === 'active' ? 'default' : user.status === 'booking' ? 'secondary' : 'outline'}>
                  {user.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{user.lastSeen}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveUsersSection;
