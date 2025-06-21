
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Search } from 'lucide-react';
import FraudManagementActions from '../FraudManagementActions';

interface ReviewQueueItem {
  id: string;
  user_id: string;
  fraud_session_id: string;
  action_type: string;
  risk_score: number;
  priority: string;
  status: string;
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  } | null;
}

interface FraudReviewQueueProps {
  reviewQueue: ReviewQueueItem[];
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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  const filteredReviewQueue = reviewQueue.filter(item => {
    const matchesSearch = !searchTerm || 
      item.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Review Queue</CardTitle>
        <CardDescription>
          Transactions requiring manual review due to elevated risk scores
        </CardDescription>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredReviewQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">
                      {item.users?.full_name || 'Unknown User'} • {item.action_type}
                    </p>
                    <p className="text-sm text-gray-600">{item.users?.email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Risk: {item.risk_score}</Badge>
                  <Badge variant={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  <Badge variant={item.status === 'pending' ? 'secondary' : 'default'}>
                    {item.status}
                  </Badge>
                  {item.status === 'pending' && (
                    <FraudManagementActions 
                      reviewItem={item} 
                      onUpdate={onUpdate}
                    />
                  )}
                </div>
              </div>
            ))}
            {filteredReviewQueue.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                {searchTerm || statusFilter !== 'all' ? 'No matching items found' : 'No items in review queue'}
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FraudReviewQueue;
