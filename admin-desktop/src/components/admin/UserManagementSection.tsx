
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { UserCheck, UserX, Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { useSupabaseData } from "../../hooks/useSupabaseData";
import { getSupabase } from "../../lib/supabase";
import { useState } from "react";

const UserManagementSection = () => {
  const { users, loading, error } = useSupabaseData();
  const [actionLoading, setActionLoading] = useState(false);

  const handleViewUser = (userId: string, userName: string) => {
    console.log(`Viewing user: ${userName} (ID: ${userId})`);
  };

  const handleSuspendUser = async (userId: string, userName: string, currentStatus: string) => {
    setActionLoading(true);
    
    try {
      const supabase = getSupabase();
      
      if (currentStatus === 'suspended') {
        console.log(`Unsuspending user: ${userName} (ID: ${userId})`);
        // In a real implementation, you would update user status
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        console.log(`✅ User ${userName} unsuspended successfully`);
      } else {
        console.log(`Suspending user: ${userName} (ID: ${userId})`);
        // In a real implementation, you would update user status
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        console.log(`✅ User ${userName} suspended successfully`);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Management
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
          <Shield className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!users || users.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No users found
            </div>
          ) : (
            users.map((user) => (
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewUser(user.id, user.name)}
                  >
                    View
                  </Button>
                  {user.status === 'suspended' ? (
                    <Button 
                      variant="default" 
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleSuspendUser(user.id, user.name, user.status)}
                    >
                      Unsuspend
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleSuspendUser(user.id, user.name, user.status)}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementSection;
