
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Play, Users, CreditCard, MessageSquare, Shield, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FraudTestingSectionProps {
  onDataUpdated?: () => void;
}

const FraudTestingSection: React.FC<FraudTestingSectionProps> = ({ onDataUpdated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('new-account-high-value');
  const [customAmount, setCustomAmount] = useState('500');
  const [customMessage, setCustomMessage] = useState('');
  const [lastTestResult, setLastTestResult] = useState<any>(null);
  const { toast } = useToast();

  const fraudScenarios = [
    {
      id: 'new-account-high-value',
      name: 'New Account + High Value',
      description: 'Simulate a brand new account making a high-value booking',
      riskLevel: 'critical',
      targetScore: 85,
      icon: Users
    },
    {
      id: 'multiple-failed-payments',
      name: 'Failed Payment Pattern',
      description: 'Multiple consecutive payment failures',
      riskLevel: 'critical',
      targetScore: 92,
      icon: CreditCard
    },
    {
      id: 'suspicious-messaging',
      name: 'Suspicious Messages',
      description: 'Messages with spam/inappropriate content',
      riskLevel: 'high',
      targetScore: 78,
      icon: MessageSquare
    },
    {
      id: 'vpn-proxy-usage',
      name: 'VPN/Proxy Usage',
      description: 'Simulate requests from suspicious IP ranges',
      riskLevel: 'high',
      targetScore: 72,
      icon: Shield
    },
    {
      id: 'rapid-booking-attempts',
      name: 'Rapid Booking Velocity',
      description: 'Multiple booking attempts in short time',
      riskLevel: 'critical',
      targetScore: 88,
      icon: Zap
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  const generateTestUser = async () => {
    const testUserId = crypto.randomUUID();
    const testEmail = `testuser_${Date.now()}@test.fraud.local`;
    
    console.log('🔧 Creating test user:', { testUserId, testEmail });
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: testUserId,
          email: testEmail,
          full_name: `Test User ${Date.now()}`,
          user_role: 'seeker',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating test user:', error);
        return null;
      }

      console.log('✅ Test user created successfully:', data);
      return { id: testUserId, email: testEmail };
    } catch (error) {
      console.error('❌ Exception creating test user:', error);
      return null;
    }
  };

  const createHighRiskFraudLog = async (testUser: any, scenario: any) => {
    console.log('📊 Creating high-risk fraud log entry...');
    
    try {
      const riskScore = scenario.targetScore;
      const reasons = getScenarioReasons(scenario.id, riskScore);
      
      const fraudLogData = {
        session_id: crypto.randomUUID(),
        user_id: testUser.id,
        action_type: getActionType(scenario.id),
        risk_score: riskScore,
        action_taken: riskScore >= 80 ? 'block' : riskScore >= 60 ? 'review' : 'allow',
        risk_factors: {
          user_behavior: Math.floor(riskScore * 0.4),
          device_risk: Math.floor(riskScore * 0.2),
          ip_risk: Math.floor(riskScore * 0.15),
          payment_risk: Math.floor(riskScore * 0.15),
          content_risk: Math.floor(riskScore * 0.1),
          velocity_risk: 0
        },
        reasons: reasons,
        metadata: { 
          test_scenario: true, 
          scenario_id: scenario.id,
          generated_at: new Date().toISOString(),
          user_email: testUser.email,
          target_score: riskScore
        },
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Test Browser)',
        created_at: new Date().toISOString()
      };

      console.log('📊 Inserting fraud log with data:', fraudLogData);

      const { data, error } = await supabase
        .from('fraud_logs')
        .insert(fraudLogData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating fraud log:', error);
        throw error;
      }

      console.log('✅ High-risk fraud log created:', data);
      
      // Create review queue item if high risk
      if (riskScore >= 60) {
        await createReviewQueueItem(testUser, riskScore, getActionType(scenario.id));
      }

      return data;
    } catch (error) {
      console.error('❌ Error in createHighRiskFraudLog:', error);
      throw error;
    }
  };

  const getScenarioReasons = (scenarioId: string, riskScore: number): string[] => {
    switch (scenarioId) {
      case 'new-account-high-value':
        return [
          'New account (< 1 hour old)',
          `High transaction amount: $${customAmount}`,
          'No transaction history',
          'Account verification pending',
          'Suspicious registration pattern'
        ];
      case 'multiple-failed-payments':
        return [
          'Multiple payment failures detected',
          'Suspicious payment pattern',
          'Card testing behavior',
          'High fraud risk indicators',
          'Payment velocity exceeded'
        ];
      case 'suspicious-messaging':
        return [
          'Spam content detected',
          'Suspicious message patterns',
          'Content policy violation',
          'Inappropriate language',
          'Potential scam indicators'
        ];
      case 'vpn-proxy-usage':
        return [
          'VPN/Proxy detected',
          'IP geolocation mismatch',
          'Anonymous network usage',
          'Suspicious IP reputation',
          'Tor network detected'
        ];
      case 'rapid-booking-attempts':
        return [
          'Rapid booking velocity detected',
          'Multiple attempts in short timeframe',
          'Bot-like behavior',
          'Automated activity patterns',
          'Rate limit exceeded'
        ];
      default:
        return [`High-risk behavior detected (Score: ${riskScore})`];
    }
  };

  const getActionType = (scenarioId: string): string => {
    switch (scenarioId) {
      case 'new-account-high-value':
      case 'rapid-booking-attempts':
        return 'booking';
      case 'multiple-failed-payments':
        return 'payment';
      case 'suspicious-messaging':
        return 'messaging';
      case 'vpn-proxy-usage':
        return 'login';
      default:
        return 'registration';
    }
  };

  const createReviewQueueItem = async (testUser: any, riskScore: number, actionType: string) => {
    console.log('📋 Creating high-risk review item...');
    
    try {
      const { error } = await supabase
        .from('review_queue')
        .insert({
          user_id: testUser.id,
          fraud_session_id: crypto.randomUUID(),
          action_type: actionType,
          risk_score: riskScore,
          priority: riskScore >= 80 ? 'critical' : 'high',
          status: 'pending'
        });

      if (error) {
        console.error('❌ Error creating review item:', error);
      } else {
        console.log('✅ Review item created successfully');
      }
    } catch (error) {
      console.error('❌ Error in createReviewQueueItem:', error);
    }
  };

  const simulateScenario = async (scenarioId: string) => {
    setIsGenerating(true);
    console.log(`🎭 Starting HIGH-RISK scenario simulation: ${scenarioId}`);
    
    try {
      const scenario = fraudScenarios.find(s => s.id === scenarioId);
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      const testUser = await generateTestUser();
      if (!testUser) {
        throw new Error('Failed to create test user');
      }

      console.log(`🎯 Generating ${scenario.name} with target score: ${scenario.targetScore}`);
      
      const fraudResult = await createHighRiskFraudLog(testUser, scenario);

      setLastTestResult({
        scenario: scenarioId,
        scenarioName: scenario.name,
        result: fraudResult,
        timestamp: new Date().toISOString(),
        testUser,
        riskScore: scenario.targetScore
      });

      toast({
        title: "High-Risk Test Generated",
        description: `Generated ${scenario.name} with risk score: ${scenario.targetScore}`,
      });

      // Trigger data refresh
      if (onDataUpdated) {
        setTimeout(() => onDataUpdated(), 500);
        setTimeout(() => onDataUpdated(), 2000);
      }

    } catch (error: any) {
      console.error('❌ Error generating test scenario:', error);
      toast({
        title: "Test Generation Failed",
        description: `Failed to generate test: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkTestData = async () => {
    setIsGenerating(true);
    console.log('🏭 Starting bulk high-risk test data generation...');
    
    try {
      for (const scenario of fraudScenarios) {
        console.log(`🎭 Running scenario: ${scenario.name} (Target: ${scenario.targetScore})`);
        await simulateScenario(scenario.id);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Bulk High-Risk Tests Complete",
        description: "Generated all fraud scenarios with high risk scores",
      });

    } catch (error) {
      console.error('❌ Error generating bulk test data:', error);
      toast({
        title: "Bulk Generation Failed",
        description: "Failed to generate bulk test data",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockReviewItems = async () => {
    setIsGenerating(true);
    console.log('📋 Generating mock review items...');
    
    try {
      const testUser = await generateTestUser();
      if (!testUser) throw new Error('Failed to create test user');

      const reviewItems = [
        {
          user_id: testUser.id,
          fraud_session_id: crypto.randomUUID(),
          action_type: 'payment',
          risk_score: 85,
          priority: 'critical',
          status: 'pending'
        },
        {
          user_id: testUser.id,
          fraud_session_id: crypto.randomUUID(),
          action_type: 'messaging',
          risk_score: 72,
          priority: 'high',
          status: 'pending'
        }
      ];

      const { error } = await supabase
        .from('review_queue')
        .insert(reviewItems);

      if (error) throw error;

      toast({
        title: "Mock Review Items Created",
        description: "Generated test items for manual review queue",
      });

      if (onDataUpdated) {
        setTimeout(() => onDataUpdated(), 1000);
      }
    } catch (error: any) {
      console.error('❌ Error generating mock review items:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate mock review items",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateBlockedUser = async () => {
    setIsGenerating(true);
    console.log('🚫 Simulating blocked user...');
    
    try {
      const testUser = await generateTestUser();
      if (!testUser) throw new Error('Failed to create test user');

      const { error } = await supabase
        .from('user_blocks')
        .insert({
          user_id: testUser.id,
          reason: 'TEST: High fraud risk detected - multiple suspicious activities',
          block_type: 'temporary',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Test User Blocked",
        description: "Created a test blocked user scenario",
      });

      if (onDataUpdated) {
        setTimeout(() => onDataUpdated(), 1000);
      }
    } catch (error: any) {
      console.error('❌ Error simulating blocked user:', error);
      toast({
        title: "Simulation Failed",
        description: "Failed to simulate blocked user",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-orange-800">HIGH-RISK TEST MODE ACTIVE</span>
            <Badge variant="outline" className="bg-orange-100 text-orange-800">
              Generating 70+ risk scores for testing
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Last Test Result */}
      {lastTestResult && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-800 mb-2">Last Test Result</h4>
            <div className="text-sm space-y-1">
              <p><strong>Scenario:</strong> {lastTestResult.scenarioName}</p>
              <p><strong>Risk Score:</strong> {lastTestResult.riskScore}</p>
              <p><strong>Time:</strong> {new Date(lastTestResult.timestamp).toLocaleString()}</p>
              <p><strong>Test User:</strong> {lastTestResult.testUser?.email}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">High-Risk Test Scenarios</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
          <TabsTrigger value="admin-tools">Admin Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>High-Risk Fraud Test Scenarios</CardTitle>
              <CardDescription>
                Generate realistic high-risk fraud patterns (70+ risk scores) to test the detection system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fraudScenarios.map((scenario) => {
                  const Icon = scenario.icon;
                  return (
                    <Card key={scenario.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <Badge variant={getRiskColor(scenario.riskLevel)}>
                            Score: {scenario.targetScore}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{scenario.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                        <Button
                          size="sm"
                          onClick={() => simulateScenario(scenario.id)}
                          disabled={isGenerating}
                          className="w-full"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Generate High-Risk Test
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Custom Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div>
                  <Label htmlFor="custom-amount">Custom Amount (for payment tests)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="500"
                  />
                </div>
                <div>
                  <Label htmlFor="custom-message">Custom Message (for messaging tests)</Label>
                  <Textarea
                    id="custom-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter suspicious message content..."
                    className="h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk High-Risk Test Data Generation</CardTitle>
              <CardDescription>
                Generate multiple high-risk test scenarios at once for comprehensive testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generateBulkTestData}
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                {isGenerating ? 'Generating High-Risk Tests...' : 'Generate All High-Risk Test Scenarios'}
              </Button>
              
              <div className="text-sm text-gray-600">
                This will create high-risk test data with realistic fraud scores:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>New Account + High Value (Risk Score: 85)</li>
                  <li>Failed Payment Pattern (Risk Score: 92)</li>
                  <li>Suspicious Messaging (Risk Score: 78)</li>
                  <li>VPN/Proxy Usage (Risk Score: 72)</li>
                  <li>Rapid Booking Velocity (Risk Score: 88)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-tools">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Queue Tools</CardTitle>
                <CardDescription>Generate test items for manual review</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={generateMockReviewItems}
                  disabled={isGenerating}
                  className="w-full"
                >
                  Generate Mock Review Items
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Block Testing</CardTitle>
                <CardDescription>Simulate blocked user scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={simulateBlockedUser}
                  disabled={isGenerating}
                  variant="destructive"
                  className="w-full"
                >
                  Create Test Blocked User
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudTestingSection;
