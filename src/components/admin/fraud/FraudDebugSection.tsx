
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Database, CloudIcon, Activity, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FraudDebugSection = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    try {
      // Test 1: Check fraud_logs table
      console.log('🔍 Testing fraud_logs table...');
      const { data: fraudLogs, error: fraudLogsError } = await supabase
        .from('fraud_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      results.tests.fraudLogs = {
        status: fraudLogsError ? 'error' : 'success',
        count: fraudLogs?.length || 0,
        error: fraudLogsError?.message,
        data: fraudLogs
      };

      // Test 2: Check review_queue table
      console.log('🔍 Testing review_queue table...');
      const { data: reviewQueue, error: reviewQueueError } = await supabase
        .from('review_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      results.tests.reviewQueue = {
        status: reviewQueueError ? 'error' : 'success',
        count: reviewQueue?.length || 0,
        error: reviewQueueError?.message,
        data: reviewQueue
      };

      // Test 3: Check user_blocks table
      console.log('🔍 Testing user_blocks table...');
      const { data: userBlocks, error: userBlocksError } = await supabase
        .from('user_blocks')
        .select('*')
        .eq('is_active', true)
        .order('blocked_at', { ascending: false })
        .limit(5);

      results.tests.userBlocks = {
        status: userBlocksError ? 'error' : 'success',
        count: userBlocks?.length || 0,
        error: userBlocksError?.message,
        data: userBlocks
      };

      // Test 4: Check users table access
      console.log('🔍 Testing users table...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name, created_at')
        .limit(3);

      results.tests.users = {
        status: usersError ? 'error' : 'success',
        count: users?.length || 0,
        error: usersError?.message
      };

      // Test 5: Try to call fraud detection edge function
      console.log('🔍 Testing fraud-detection edge function...');
      try {
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('fraud-detection', {
          body: {
            action_type: 'login',
            user_id: 'test-user-id',
            ip_address: '127.0.0.1',
            metadata: { test: true }
          }
        });

        results.tests.edgeFunction = {
          status: edgeError ? 'error' : 'success',
          error: edgeError?.message,
          response: edgeData
        };
      } catch (edgeErr: any) {
        results.tests.edgeFunction = {
          status: 'error',
          error: edgeErr.message
        };
      }

      // Test 6: Check payment_attempts table
      console.log('🔍 Testing payment_attempts table...');
      const { data: paymentAttempts, error: paymentError } = await supabase
        .from('payment_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      results.tests.paymentAttempts = {
        status: paymentError ? 'error' : 'success',
        count: paymentAttempts?.length || 0,
        error: paymentError?.message
      };

      console.log('📊 Diagnostic results:', results);
      setDebugData(results);

      toast({
        title: "Diagnostics Complete",
        description: "Check the debug panel for detailed results",
      });

    } catch (error) {
      console.error('❌ Diagnostic error:', error);
      results.tests.overall = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      setDebugData(results);

      toast({
        title: "Diagnostic Error",
        description: "Failed to run some diagnostic tests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectFraudLog = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Creating direct fraud log entry...');
      
      const testData = {
        session_id: crypto.randomUUID(),
        user_id: 'test-user-debug',
        action_type: 'booking',
        risk_score: 85,
        action_taken: 'review',
        risk_factors: {
          user_behavior: 30,
          device_risk: 20,
          ip_risk: 15,
          payment_risk: 20,
          content_risk: 0,
          velocity_risk: 0
        },
        reasons: ['DEBUG: Manual test entry', 'High risk score for testing'],
        metadata: { debug: true, timestamp: new Date().toISOString() }
      };

      const { data, error } = await supabase
        .from('fraud_logs')
        .insert(testData)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to insert test fraud log:', error);
        toast({
          title: "Insert Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Successfully inserted test fraud log:', data);
        toast({
          title: "Test Entry Created",
          description: "Direct fraud log entry created successfully",
        });
      }

    } catch (error) {
      console.error('❌ Direct fraud log test error:', error);
      toast({
        title: "Test Failed",
        description: "Failed to create direct fraud log entry",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Fraud Detection Debug Panel
          </CardTitle>
          <CardDescription>
            Diagnostic tools to identify issues in the fraud detection system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={runDiagnostics}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
              Run Full Diagnostics
            </Button>
            <Button
              onClick={testDirectFraudLog}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Test Direct DB Insert
            </Button>
          </div>

          {debugData && (
            <div className="space-y-4 mt-6">
              <div className="text-sm text-gray-600">
                Last run: {new Date(debugData.timestamp).toLocaleString()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(debugData.tests).map(([testName, result]: [string, any]) => (
                  <Card key={testName} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{testName.replace(/([A-Z])/g, ' $1')}</h4>
                      <Badge variant={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    
                    {result.count !== undefined && (
                      <p className="text-sm text-gray-600">Count: {result.count}</p>
                    )}
                    
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">Error: {result.error}</p>
                    )}
                    
                    {result.response && (
                      <details className="mt-2">
                        <summary className="text-sm cursor-pointer">Response Data</summary>
                        <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-32">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </details>
                    )}
                    
                    {result.data && result.data.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-sm cursor-pointer">Sample Data ({result.data.length} items)</summary>
                        <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-32">
                          {JSON.stringify(result.data.slice(0, 2), null, 2)}
                        </pre>
                      </details>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudDebugSection;
