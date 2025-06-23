
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Check, X, AlertTriangle, Search, Trash2, RefreshCw } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface FraudReviewQueueProps {
  reviewQueue: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onUpdate: () => void;
}

const FraudReviewQueue: React.FC<FraudReviewQueueProps> = ({
  reviewQueue,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onUpdate
}) => {
  const { clearFraudQueue } = useAdminData();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (actionKey: string, actionFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [actionKey]: true }));
    try {
      await actionFn();
      onUpdate();
    } catch (error) {
      console.error(`Failed to ${actionKey}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleClearQueue = async () => {
    await handleAction('clear-queue', clearFraudQueue);
  };

  const filteredQueue = reviewQueue.filter(item => {
    const matchesSearch = !searchTerm || 
      item.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.users?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reviewQueue.filter(item => item.status === 'pending').length;
  const resolvedCount = reviewQueue.filter(item => item.status === 'resolved').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Fraud Review Queue ({reviewQueue.length})
            {pendingCount > 0 && (
              <Badge variant="destructive">{pendingCount} pending</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUpdate}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={loading['clear-queue'] || resolvedCount === 0}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Resolved
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Resolved Items</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all resolved, approved, and rejected items from the fraud review queue. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearQueue}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading['clear-queue'] ? 'Clearing...' : 'Clear Queue'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by action type or user email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-xl font-bold text-orange-600">{pendingCount}</p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xl font-bold text-blue-600">
              {reviewQueue.filter(item => item.status === 'reviewing').length}
            </p>
            <p className="text-sm text-gray-600">In Review</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xl font-bold text-green-600">{resolvedCount}</p>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
        </div>

        {/* Queue Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredQueue.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' ? 
                'No items match your filters' : 
                'No items in fraud review queue'
              }
            </div>
          ) : (
            filteredQueue.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        item.risk_score >= 70 ? 'text-red-500' :
                        item.risk_score >= 40 ? 'text-orange-500' :
                        'text-yellow-500'
                      }`} />
                      <span className="font-medium">{item.action_type}</span>
                      <Badge variant={
                        item.status === 'pending' ? 'destructive' :
                        item.status === 'reviewing' ? 'secondary' :
                        item.status === 'resolved' ? 'default' :
                        'outline'
                      }>
                        {item.status}
                      </Badge>
                      <Badge variant="outline">
                        Risk: {item.risk_score}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>User: {item.users?.email || 'Unknown'}</p>
                      <p>Session: {item.fraud_session_id}</p>
                      <p>Created: {new Date(item.created_at).toLocaleString()}</p>
                      {item.review_notes && (
                        <p>Notes: {item.review_notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    {item.status === 'pending' && (
                      <>
                        <Button variant="default" size="sm">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
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

export default FraudReviewQueue;
