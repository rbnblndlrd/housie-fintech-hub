
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';

interface BulkUserDeletionProps {
  users: Array<{
    id: string;
    email: string;
    full_name: string;
  }>;
  onUsersDeleted: () => void;
}

const BulkUserDeletion = ({ users, onUsersDeleted }: BulkUserDeletionProps) => {
  const [deleting, setDeleting] = useState(false);
  const [deletionResults, setDeletionResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({});
  const { toast } = useToast();

  // Target users to delete in order
  const targetEmails = [
    'mrdouleur1@gmail.com',
    'laurentlamarre4@gmail.com', 
    'laurentlamarre1@gmail.com',
    '7utile@gmail.com' // Delete last since it's admin
  ];

  const targetUsers = users.filter(user => targetEmails.includes(user.email));

  const handleBulkDeletion = async () => {
    setDeleting(true);
    const results: Record<string, 'success' | 'error' | 'pending'> = {};
    
    // Initialize all as pending
    targetUsers.forEach(user => {
      results[user.email] = 'pending';
    });
    setDeletionResults({ ...results });

    try {
      // Delete users one by one in order
      for (const user of targetUsers) {
        try {
          console.log(`Deleting user: ${user.email} (${user.id})`);
          
          const result = await adminService.deleteUser(user.id);
          
          if (result.success) {
            results[user.email] = 'success';
            console.log(`✅ Successfully deleted: ${user.email}`);
            
            toast({
              title: "User Deleted",
              description: `Successfully deleted ${user.email}`,
            });
          } else {
            results[user.email] = 'error';
            console.error(`❌ Failed to delete ${user.email}:`, result.error);
            
            toast({
              title: "Deletion Failed",
              description: `Failed to delete ${user.email}: ${result.error}`,
              variant: "destructive",
            });
          }
        } catch (error) {
          results[user.email] = 'error';
          console.error(`❌ Error deleting ${user.email}:`, error);
          
          toast({
            title: "Deletion Error",
            description: `Error deleting ${user.email}`,
            variant: "destructive",
          });
        }
        
        setDeletionResults({ ...results });
        
        // Small delay between deletions
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Final success message
      const successCount = Object.values(results).filter(r => r === 'success').length;
      const errorCount = Object.values(results).filter(r => r === 'error').length;
      
      if (successCount > 0) {
        toast({
          title: "Bulk Deletion Complete",
          description: `Successfully deleted ${successCount} users${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
      }

      // Refresh the users list
      setTimeout(() => {
        onUsersDeleted();
      }, 2000);

    } catch (error) {
      console.error('Bulk deletion error:', error);
      toast({
        title: "Bulk Deletion Failed",
        description: "An unexpected error occurred during bulk deletion",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (targetUsers.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center text-green-700">
            <p className="font-medium">✅ Target users not found</p>
            <p className="text-sm">The specified users may have already been deleted.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Bulk User Deletion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-red-600">
            <p className="font-medium">Users to be deleted (in order):</p>
            <ul className="mt-2 space-y-1">
              {targetUsers.map((user, index) => (
                <li key={user.id} className="flex items-center gap-2">
                  <span className="text-xs bg-red-100 px-2 py-1 rounded">{index + 1}</span>
                  <span>{user.email}</span>
                  <span className="text-gray-500">({user.full_name})</span>
                  {deletionResults[user.email] && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      deletionResults[user.email] === 'success' ? 'bg-green-100 text-green-700' :
                      deletionResults[user.email] === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {deletionResults[user.email] === 'success' ? '✅ Deleted' :
                       deletionResults[user.email] === 'error' ? '❌ Failed' :
                       '⏳ Deleting...'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Deleting Users...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All {targetUsers.length} Users
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Bulk User Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {targetUsers.length} user accounts and all their associated data:
                    <ul className="mt-2 list-disc list-inside">
                      {targetUsers.map(user => (
                        <li key={user.id}>{user.email}</li>
                      ))}
                    </ul>
                    <strong className="block mt-2 text-red-600">This action cannot be undone!</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleBulkDeletion}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete All Users
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUserDeletion;
