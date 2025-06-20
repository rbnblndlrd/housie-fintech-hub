
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface EmergencyLog {
  id: string;
  control_type: string;
  action: string;
  activated_by_user_id: string | null;
  reason: string | null;
  new_value: any;
  created_at: string;
}

const EmergencyActivationLog: React.FC = () => {
  const [logs, setLogs] = useState<EmergencyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('emergency_activation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching emergency logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Set up real-time subscription for logs
    const subscription = supabase
      .channel('emergency_logs_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'emergency_activation_logs' 
        }, 
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'activated':
      case 'enabled':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'deactivated':
      case 'disabled':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'auto_recovery':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'activated':
      case 'enabled':
        return <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>;
      case 'deactivated':
      case 'disabled':
        return <Badge variant="destructive">Disabled</Badge>;
      case 'auto_recovery':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Auto Recovery</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const formatControlType = (controlType: string) => {
    return controlType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="fintech-chart-container">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Emergency Activation Log
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No emergency activations recorded yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-0.5">
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {formatControlType(log.control_type)}
                    </span>
                    {getActionBadge(log.action)}
                  </div>
                  
                  {log.reason && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Reason:</strong> {log.reason}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                    
                    {log.activated_by_user_id && (
                      <span className="text-xs text-gray-500">
                        User: {log.activated_by_user_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyActivationLog;
