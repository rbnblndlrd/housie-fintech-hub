
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, AlertTriangle, Activity, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserRiskProfileCardProps {
  userId: string;
  userEmail: string;
  userName: string;
  riskScore: number;
}

const UserRiskProfileCard: React.FC<UserRiskProfileCardProps> = ({
  userId,
  userEmail,
  userName,
  riskScore
}) => {
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [fraudLogs, setFraudLogs] = useState<any[]>([]);
  const [paymentAttempts, setPaymentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load fraud logs
      const { data: fraudData } = await supabase
        .from('fraud_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load payment attempts
      const { data: paymentData } = await supabase
        .from('payment_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load user sessions
      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      setFraudLogs(fraudData || []);
      setPaymentAttempts(paymentData || []);
      setUserActivity(sessionData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'destructive';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'default';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-auto p-0">
          <Card className="w-80 cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-sm">{userName}</CardTitle>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </div>
                <Badge variant={getRiskColor(riskScore)}>
                  {getRiskLevel(riskScore)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Score</span>
                  <span className="font-medium">{riskScore}/100</span>
                </div>
                <Progress value={riskScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Risk Profile
          </DialogTitle>
          <DialogDescription>
            Detailed risk analysis for {userName} ({userEmail})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Risk Score</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{riskScore}/100</span>
                    <Badge variant={getRiskColor(riskScore)}>
                      {getRiskLevel(riskScore)}
                    </Badge>
                  </div>
                  <Progress value={riskScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Activity Summary</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Fraud Alerts:</span>
                    <span>{fraudLogs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Attempts:</span>
                    <span>{paymentAttempts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sessions:</span>
                    <span>{userActivity.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="fraud" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fraud">Fraud Logs</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="fraud">
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {fraudLogs.map((log) => (
                    <Card key={log.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {log.action_type}
                          </Badge>
                          <p className="text-sm text-gray-600">
                            Risk Score: {log.risk_score}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={getRiskColor(log.risk_score)}>
                          {log.action_taken}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                  {fraudLogs.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No fraud logs found</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="payments">
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {paymentAttempts.map((payment) => (
                    <Card key={payment.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="h-4 w-4" />
                            <span className="font-medium">${payment.amount}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {payment.payment_method || 'Unknown method'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={payment.status === 'succeeded' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                  {paymentAttempts.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No payment attempts found</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="activity">
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {userActivity.map((session) => (
                    <Card key={session.id} className="p-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Session</span>
                          <Badge variant={session.is_active ? 'default' : 'outline'}>
                            {session.is_active ? 'Active' : 'Ended'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {session.city}, {session.region}, {session.country}
                        </p>
                        <p className="text-xs text-gray-500">
                          Started: {new Date(session.login_time).toLocaleString()}
                        </p>
                        {session.current_page && (
                          <p className="text-xs text-gray-500">
                            Current page: {session.current_page}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                  {userActivity.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No activity found</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <Button onClick={loadUserData} disabled={loading} className="w-full">
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRiskProfileCard;
