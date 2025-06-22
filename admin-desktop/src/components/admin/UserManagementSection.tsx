
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { UserCheck, UserX, Shield, AlertTriangle } from "lucide-react";

const UserManagementSection = () => {
  // Mock data for demo purposes
  const users = [
    { id: 1, name: "Alice Brown", email: "alice@example.com", role: "provider", status: "active", verified: true },
    { id: 2, name: "Bob Wilson", email: "bob@example.com", role: "customer", status: "pending", verified: false },
    { id: 3, name: "Carol Davis", email: "carol@example.com", role: "provider", status: "suspended", verified: true }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.verified ? (
                    <UserCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <UserX className="h-4 w-4 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{user.role}</Badge>
                  <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                {user.status === 'suspended' ? (
                  <Button variant="default" size="sm">
                    Unsuspend
                  </Button>
                ) : (
                  <Button variant="destructive" size="sm">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementSection;
