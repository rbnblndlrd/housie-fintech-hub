
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Users, MapPin, Activity, Eye, MessageCircle } from "lucide-react";

const LiveUsersSection = () => {
  // Mock data for demo purposes
  const liveUsers = [
    { id: 1, name: "John Doe", location: "Toronto, ON", status: "active", lastSeen: "2 min ago" },
    { id: 2, name: "Jane Smith", location: "Vancouver, BC", status: "booking", lastSeen: "5 min ago" },
    { id: 3, name: "Mike Johnson", location: "Montreal, QC", status: "browsing", lastSeen: "1 min ago" }
  ];

  const handleViewUser = (userId: number, userName: string) => {
    console.log(`Viewing live user: ${userName} (ID: ${userId})`);
    // In a real app, this would show detailed user session information
  };

  const handleContactUser = (userId: number, userName: string) => {
    console.log(`Contacting live user: ${userName} (ID: ${userId})`);
    // In a real app, this would open a chat or messaging interface
  };

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
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Badge variant={user.status === 'active' ? 'default' : user.status === 'booking' ? 'secondary' : 'outline'}>
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveUsersSection;
