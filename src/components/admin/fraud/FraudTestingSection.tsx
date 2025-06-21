
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Play, Users, CreditCard, MessageSquare, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFraudDetection } from '@/hooks/useFraudDetection';

const FraudTestingSection = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('new-account-high-value');
  const [customAmount, setCustomAmount] = useState('500');
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();
  const { performFraudCheck } = useFraudDetection();

  const fraudScenarios = [
    {
      id: 'new-account-high-value',
      name: 'New Account + High Value',
      description: 'Simulate a brand new account making a high-value booking',
      riskLevel: 'high',
      icon: Users
    },
    {
      id: 'multiple-failed-payments',
      name: 'Failed Payment Pattern',
      description: 'Multiple consecutive payment failures',
      riskLevel: 'critical',
      icon: CreditCard
    },
    {
      id: 'suspicious-messaging',
      name: 'Suspicious Messages',
      description: 'Messages with spam/inappropriate content',
      riskLevel: 'medium',
      icon: MessageSquare
    },
    {
      id: 'vpn-proxy-usage',
      name: 'VPN/Proxy Usage',
      description: 'Simulate requests from suspicious IP ranges',
      riskLevel: 'medium',
      icon: Shield
    },
    {
      id: 'rapid-booking-attempts',
      name: 'Rapid Booking Velocity',
      description: 'Multiple booking attempts in short time',
      riskLevel: 'high',
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
    
    // Insert test user
    const { error } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: testEmail,
        full_name: `Test User ${Date.now()}`,
        user_role: 'seeker',
        created_at: new Date().toISOString() // New account
      });

    if (error) {
      console.error('Error creating test user:', error);
      return null;
    }

    return { id: testUserId, email: testEmail };
  };

  const simulateScenario = async (scenarioId: string) => {
    setIsGenerating(true);
    try {
      let fraudResult = null;
      const testUser = await generateTestUser();
      
      if (!testUser) {
        throw new Error('Failed to create test user');
      }

      switch (scenarioId) {
        case 'new-account-high-value':
          fraudResult = await performFraudCheck({
            action_type: 'booking',
            user_id: testUser.id,
            ip_address: '10.0.0.1', // Private IP to trigger suspicion
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            metadata: {
              email: testUser.email,
              amount: parseFloat(customAmount) || 500,
              account_age_hours: 0.1, // Very new account
              booking_count: 0
            }
          });
          break;

        case 'multiple-failed-payments':
          // Create multiple failed payment attempts
          for (let i = 0; i < 4; i++) {
            await supabase.from('payment_attempts').insert({
              user_id: testUser.id,
              amount: 150 + (i * 50),
              status: 'failed',
              failure_reason: 'insufficient_funds',
              ip_address: '192.168.1.100'
            });
          }
          
          fraudResult = await performFraudCheck({
            action_type: 'payment',
            user_id: testUser.id,
            ip_address: '192.168.1.100',
            metadata: {
              amount: 300,
              previous_failures: 4
            }
          });
          break;

        case 'suspicious-messaging':
          fraudResult = await performFraudCheck({
            action_type: 'messaging',
            user_id: testUser.id,
            ip_address: '203.0.113.1',
            metadata: {
              content: customMessage || 'URGENT!!! Free money guaranteed! Click here now! WhatsApp me at 555-1234',
              length: (customMessage || 'URGENT!!! Free money guaranteed! Click here now! WhatsApp me at 555-1234').length
            }
          });
          break;

        case 'vpn-proxy-usage':
          fraudResult = await performFraudCheck({
            action_type: 'login',
            user_id: testUser.id,
            ip_address: '10.0.0.1', // VPN-like IP
            user_agent: 'Mozilla/5.0 (Unknown OS)',
            metadata: {
              proxy_detected: true,
              country_mismatch: true
            }
          });
          break;

        case 'rapid-booking-attempts':
          // Create multiple rapid attempts
          for (let i = 0; i < 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
            await performFraudCheck({
              action_type: 'booking',
              user_id: testUser.id,
              ip_address: '198.51.100.1',
              metadata: {
                attempt_number: i + 1,
                rapid_fire: true
              }
            });
          }
          
          fraudResult = await performFraudCheck({
            action_type: 'booking',
            user_id: testUser.id,
            ip_address: '198.51.100.1',
            metadata: {
              velocity_check: true,
              recent_attempts: 6
            }
          });
          break;
      }

      toast({
        title: "Test Scenario Generated",
        description: `Created fraud test case: ${fraudScenarios.find(s => s.id === scenarioId)?.name}`,
      });

      console.log('Generated fraud test result:', fraudResult);

    } catch (error) {
      console.error('Error generating test scenario:', error);
      toast({
        title: "Test Generation Failed",
        description: "Failed to generate test fraud scenario",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkTestData = async () => {
    setIsGenerating(true);
    try {
      // Generate multiple test scenarios at once
      for (const scenario of fraudScenarios) {
        await simulateScenario(scenario.id);
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay between scenarios
      }
      
      toast({
        title: "Bulk Test Data Generated",
        description: "Generated test data for all fraud scenarios",
      });
    } catch (error) {
      console.error('Error generating bulk test data:', error);
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
    try {
      const testUser = await generateTestUser();
      if (!testUser) throw new Error('Failed to create test user');

      const sessionId = crypto.randomUUID();
      
      // Create mock review queue items
      const reviewItems = [
        {
          user_id: testUser.id,
          fraud_session_id: sessionId,
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
    } catch (error) {
      console.error('Error generating mock review items:', error);
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
    try {
      const testUser = await generateTestUser();
      if (!testUser) throw new Error('Failed to create test user');

      const { error } = await supabase
        .from('user_blocks')
        .insert({
          user_id: testUser.id,
          reason: 'TEST: High fraud risk detected - multiple suspicious activities',
          block_type: 'temporary',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });

      if (error) throw error;

      toast({
        title: "Test User Blocked",
        description: "Created a test blocked user scenario",
      });
    } catch (error) {
      console.error('Error simulating blocked user:', error);
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
            <span className="font-semibold text-orange-800">TEST MODE ACTIVE</span>
            <Badge variant="outline" className="bg-orange-100 text-orange-800">
              All data generated is for testing purposes only
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
          <TabsTrigger value="admin-tools">Admin Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Test Scenarios</CardTitle>
              <CardDescription>
                Generate specific fraud patterns to test the detection system
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
                            {scenario.riskLevel}
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
                          Run Test
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
              <CardTitle>Bulk Test Data Generation</CardTitle>
              <CardDescription>
                Generate multiple test scenarios at once for comprehensive testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generateBulkTestData}
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate All Test Scenarios'}
              </Button>
              
              <div className="text-sm text-gray-600">
                This will create test data for all fraud scenarios including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>High-risk new accounts</li>
                  <li>Failed payment patterns</li>
                  <li>Suspicious messaging activity</li>
                  <li>VPN/proxy usage patterns</li>
                  <li>Rapid booking velocity tests</li>
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
