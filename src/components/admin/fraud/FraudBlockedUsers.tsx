
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ban } from 'lucide-react';

interface UserBlock {
  id: string;
  user_id: string;
  reason: string;
  block_type: string;
  is_active: boolean;
  blocked_at: string;
  expires_at: string | null;
  users?: {
    full_name: string;
    email: string;
  } | null;
}

interface FraudBlockedUsersProps {
  userBlocks: UserBlock[];
  onUnblockUser: (blockId: string) => void;
}

const FraudBlockedUsers: React.FC<FraudBlockedUsersProps> = ({ userBlocks, onUnblockUser }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Users Management</CardTitle>
        <CardDescription>
          Manage user blocks and restrictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {userBlocks.map((block) => (
              <div key={block.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Ban className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">
                      {block.users?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600">{block.users?.email}</p>
                    <p className="text-sm text-gray-600">Reason: {block.reason}</p>
                    <p className="text-xs text-gray-500">
                      Blocked: {new Date(block.blocked_at).toLocaleString()}
                    </p>
                    {block.expires_at && (
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(block.expires_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">{block.block_type}</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUnblockUser(block.id)}
                  >
                    Unblock
                  </Button>
                </div>
              </div>
            ))}
            {userBlocks.length === 0 && (
              <p className="text-center text-gray-500 py-8">No blocked users</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FraudBlockedUsers;
