
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FraudCheckRequest {
  action_type: 'registration' | 'booking' | 'payment' | 'messaging' | 'login';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
  metadata?: Record<string, any>;
}

interface RiskFactors {
  user_behavior: number;
  device_risk: number;
  ip_risk: number;
  payment_risk: number;
  content_risk: number;
  velocity_risk: number;
}

interface FraudResult {
  risk_score: number;
  action: 'allow' | 'review' | 'block' | 'require_verification';
  risk_factors: RiskFactors;
  reasons: string[];
  session_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const requestData: FraudCheckRequest = await req.json();
    const sessionId = crypto.randomUUID();

    console.log(`Fraud check started - Session: ${sessionId}, Action: ${requestData.action_type}`);

    // Initialize risk factors
    const riskFactors: RiskFactors = {
      user_behavior: 0,
      device_risk: 0,
      ip_risk: 0,
      payment_risk: 0,
      content_risk: 0,
      velocity_risk: 0,
    };

    const reasons: string[] = [];

    // 1. User Behavior Analysis
    if (requestData.user_id) {
      const userRisk = await analyzeUserBehavior(supabase, requestData.user_id, requestData.action_type);
      riskFactors.user_behavior = userRisk.score;
      reasons.push(...userRisk.reasons);
    }

    // 2. Device Fingerprinting
    if (requestData.device_fingerprint || requestData.user_agent) {
      const deviceRisk = await analyzeDeviceRisk(supabase, requestData.device_fingerprint, requestData.user_agent, requestData.user_id);
      riskFactors.device_risk = deviceRisk.score;
      reasons.push(...deviceRisk.reasons);
    }

    // 3. IP Analysis
    if (requestData.ip_address) {
      const ipRisk = await analyzeIPRisk(supabase, requestData.ip_address, requestData.user_id);
      riskFactors.ip_risk = ipRisk.score;
      reasons.push(...ipRisk.reasons);
    }

    // 4. Payment Pattern Analysis
    if (requestData.action_type === 'payment' && requestData.user_id) {
      const paymentRisk = await analyzePaymentPatterns(supabase, requestData.user_id, requestData.metadata);
      riskFactors.payment_risk = paymentRisk.score;
      reasons.push(...paymentRisk.reasons);
    }

    // 5. Content Analysis (for messaging)
    if (requestData.action_type === 'messaging' && requestData.metadata?.content) {
      const contentRisk = await analyzeContent(requestData.metadata.content);
      riskFactors.content_risk = contentRisk.score;
      reasons.push(...contentRisk.reasons);
    }

    // 6. Velocity Analysis
    const velocityRisk = await analyzeVelocity(supabase, requestData.user_id, requestData.ip_address, requestData.action_type);
    riskFactors.velocity_risk = velocityRisk.score;
    reasons.push(...velocityRisk.reasons);

    // Calculate overall risk score (weighted average)
    const weights = {
      user_behavior: 0.25,
      device_risk: 0.15,
      ip_risk: 0.15,
      payment_risk: 0.20,
      content_risk: 0.15,
      velocity_risk: 0.10,
    };

    const riskScore = Math.round(
      Object.entries(riskFactors).reduce((sum, [key, value]) => {
        return sum + (value * weights[key as keyof typeof weights]);
      }, 0)
    );

    // Determine action based on risk score
    let action: FraudResult['action'] = 'allow';
    if (riskScore >= 80) action = 'block';
    else if (riskScore >= 60) action = 'require_verification';
    else if (riskScore >= 40) action = 'review';

    const result: FraudResult = {
      risk_score: riskScore,
      action,
      risk_factors: riskFactors,
      reasons: reasons.slice(0, 10), // Limit to top 10 reasons
      session_id: sessionId,
    };

    // Log fraud check
    await logFraudCheck(supabase, {
      session_id: sessionId,
      action_type: requestData.action_type,
      user_id: requestData.user_id,
      ip_address: requestData.ip_address,
      risk_score: riskScore,
      action,
      risk_factors: riskFactors,
      reasons,
      metadata: requestData.metadata,
    });

    console.log(`Fraud check completed - Session: ${sessionId}, Risk: ${riskScore}, Action: ${action}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Fraud detection error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// User Behavior Analysis
async function analyzeUserBehavior(supabase: any, userId: string, actionType: string) {
  let score = 0;
  const reasons: string[] = [];

  try {
    // Check user account age
    const { data: user } = await supabase
      .from('users')
      .select('created_at, email_verified, phone_verified')
      .eq('id', userId)
      .single();

    if (user) {
      const accountAge = Date.now() - new Date(user.created_at).getTime();
      const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);

      if (daysSinceCreation < 1) {
        score += 30;
        reasons.push('Very new account (less than 1 day)');
      } else if (daysSinceCreation < 7) {
        score += 15;
        reasons.push('New account (less than 1 week)');
      }

      if (!user.email_verified) {
        score += 20;
        reasons.push('Email not verified');
      }

      if (!user.phone_verified) {
        score += 10;
        reasons.push('Phone not verified');
      }
    }

    // Check booking patterns
    if (actionType === 'booking') {
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('created_at, total_amount, status')
        .eq('customer_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (recentBookings && recentBookings.length > 5) {
        score += 25;
        reasons.push('Excessive booking activity (>5 in 24h)');
      }

      // Check for cancelled bookings pattern
      const { data: cancelledBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('customer_id', userId)
        .eq('status', 'cancelled')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (cancelledBookings && cancelledBookings.length > 3) {
        score += 20;
        reasons.push('High cancellation rate');
      }
    }

  } catch (error) {
    console.error('User behavior analysis error:', error);
    score += 10;
    reasons.push('Error analyzing user behavior');
  }

  return { score: Math.min(score, 100), reasons };
}

// Device Risk Analysis
async function analyzeDeviceRisk(supabase: any, deviceFingerprint?: string, userAgent?: string, userId?: string) {
  let score = 0;
  const reasons: string[] = [];

  try {
    if (deviceFingerprint) {
      // Check if device is used by multiple users
      const { data: deviceUsers } = await supabase
        .from('fraud_device_tracking')
        .select('user_id')
        .eq('device_fingerprint', deviceFingerprint)
        .neq('user_id', userId || '');

      if (deviceUsers && deviceUsers.length > 2) {
        score += 40;
        reasons.push('Device used by multiple accounts');
      }
    }

    if (userAgent) {
      // Check for suspicious user agents
      const suspiciousPatterns = [
        /bot/i, /crawler/i, /spider/i, /automated/i, /script/i
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
        score += 60;
        reasons.push('Suspicious user agent detected');
      }

      // Check for mobile vs desktop inconsistencies
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
      if (userId) {
        const { data: recentSessions } = await supabase
          .from('fraud_session_logs')
          .select('user_agent')
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(5);

        if (recentSessions && recentSessions.length > 0) {
          const deviceTypes = recentSessions.map(s => 
            /Mobile|Android|iPhone|iPad/i.test(s.user_agent) ? 'mobile' : 'desktop'
          );
          const uniqueTypes = new Set(deviceTypes);
          
          if (uniqueTypes.size > 1) {
            score += 15;
            reasons.push('Switching between device types');
          }
        }
      }
    }

  } catch (error) {
    console.error('Device risk analysis error:', error);
    score += 5;
    reasons.push('Error analyzing device risk');
  }

  return { score: Math.min(score, 100), reasons };
}

// IP Risk Analysis
async function analyzeIPRisk(supabase: any, ipAddress: string, userId?: string) {
  let score = 0;
  const reasons: string[] = [];

  try {
    // Check if IP is used by multiple users
    const { data: ipUsers } = await supabase
      .from('fraud_ip_tracking')
      .select('user_id')
      .eq('ip_address', ipAddress)
      .neq('user_id', userId || '');

    if (ipUsers && ipUsers.length > 3) {
      score += 35;
      reasons.push('IP address used by multiple accounts');
    }

    // Check for rapid IP changes
    if (userId) {
      const { data: recentIPs } = await supabase
        .from('fraud_session_logs')
        .select('ip_address')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(10);

      if (recentIPs) {
        const uniqueIPs = new Set(recentIPs.map(r => r.ip_address));
        if (uniqueIPs.size > 3) {
          score += 30;
          reasons.push('Rapid IP address changes');
        }
      }
    }

    // Basic IP validation
    if (!isValidIP(ipAddress)) {
      score += 20;
      reasons.push('Invalid IP address format');
    }

    // Check for known problematic IP ranges (simplified)
    if (ipAddress.startsWith('10.') || ipAddress.startsWith('192.168.') || ipAddress.startsWith('172.')) {
      score += 10;
      reasons.push('Private IP address range');
    }

  } catch (error) {
    console.error('IP risk analysis error:', error);
    score += 5;
    reasons.push('Error analyzing IP risk');
  }

  return { score: Math.min(score, 100), reasons };
}

// Payment Pattern Analysis
async function analyzePaymentPatterns(supabase: any, userId: string, metadata?: Record<string, any>) {
  let score = 0;
  const reasons: string[] = [];

  try {
    // Check recent payment failures
    const { data: failedPayments } = await supabase
      .from('bookings')
      .select('created_at, total_amount')
      .eq('customer_id', userId)
      .eq('payment_status', 'failed')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (failedPayments && failedPayments.length > 3) {
      score += 40;
      reasons.push('Multiple recent payment failures');
    }

    // Check for unusual payment amounts
    if (metadata?.amount) {
      const amount = parseFloat(metadata.amount);
      
      if (amount > 1000) {
        score += 20;
        reasons.push('High payment amount');
      }

      // Check against user's payment history
      const { data: paymentHistory } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('customer_id', userId)
        .eq('payment_status', 'paid')
        .limit(10);

      if (paymentHistory && paymentHistory.length > 0) {
        const avgAmount = paymentHistory.reduce((sum, p) => sum + p.total_amount, 0) / paymentHistory.length;
        
        if (amount > avgAmount * 3) {
          score += 25;
          reasons.push('Payment amount significantly higher than usual');
        }
      }
    }

    // Check payment velocity
    const { data: recentPayments } = await supabase
      .from('bookings')
      .select('created_at')
      .eq('customer_id', userId)
      .eq('payment_status', 'paid')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (recentPayments && recentPayments.length > 3) {
      score += 30;
      reasons.push('High payment frequency');
    }

  } catch (error) {
    console.error('Payment analysis error:', error);
    score += 5;
    reasons.push('Error analyzing payment patterns');
  }

  return { score: Math.min(score, 100), reasons };
}

// Content Analysis
async function analyzeContent(content: string) {
  let score = 0;
  const reasons: string[] = [];

  // Spam indicators
  const spamPatterns = [
    /free\s*money/i,
    /click\s*here/i,
    /guaranteed/i,
    /urgent/i,
    /limited\s*time/i,
    /act\s*now/i,
  ];

  const spamMatches = spamPatterns.filter(pattern => pattern.test(content));
  if (spamMatches.length > 2) {
    score += 40;
    reasons.push('Multiple spam indicators detected');
  }

  // Suspicious contact sharing
  const contactPatterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,  // Phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,  // Email
    /whatsapp|telegram|signal/i,
  ];

  if (contactPatterns.some(pattern => pattern.test(content))) {
    score += 25;
    reasons.push('Contact information sharing detected');
  }

  // Inappropriate content
  const inappropriatePatterns = [
    /\b(fuck|shit|damn)\b/i,
    /sexual|adult|escort/i,
  ];

  if (inappropriatePatterns.some(pattern => pattern.test(content))) {
    score += 30;
    reasons.push('Inappropriate content detected');
  }

  // Length-based scoring
  if (content.length > 1000) {
    score += 10;
    reasons.push('Unusually long message');
  }

  // Repetitive content
  const words = content.toLowerCase().split(/\s+/);
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxRepeats = Math.max(...Object.values(wordCount));
  if (maxRepeats > 5) {
    score += 20;
    reasons.push('Repetitive content detected');
  }

  return { score: Math.min(score, 100), reasons };
}

// Velocity Analysis
async function analyzeVelocity(supabase: any, userId?: string, ipAddress?: string, actionType?: string) {
  let score = 0;
  const reasons: string[] = [];

  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Check action velocity by user
    if (userId) {
      const { data: userActions } = await supabase
        .from('fraud_logs')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', oneHourAgo.toISOString());

      if (userActions && userActions.length > 20) {
        score += 50;
        reasons.push('Excessive user activity (>20 actions/hour)');
      }

      // Check rapid successive actions
      const { data: rapidActions } = await supabase
        .from('fraud_logs')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', fiveMinutesAgo.toISOString());

      if (rapidActions && rapidActions.length > 5) {
        score += 40;
        reasons.push('Rapid successive actions');
      }
    }

    // Check action velocity by IP
    if (ipAddress) {
      const { data: ipActions } = await supabase
        .from('fraud_logs')
        .select('created_at')
        .eq('ip_address', ipAddress)
        .gte('created_at', oneHourAgo.toISOString());

      if (ipActions && ipActions.length > 30) {
        score += 45;
        reasons.push('Excessive IP activity');
      }
    }

  } catch (error) {
    console.error('Velocity analysis error:', error);
    score += 5;
    reasons.push('Error analyzing velocity');
  }

  return { score: Math.min(score, 100), reasons };
}

// Logging function
async function logFraudCheck(supabase: any, logData: any) {
  try {
    await supabase.from('fraud_logs').insert({
      session_id: logData.session_id,
      action_type: logData.action_type,
      user_id: logData.user_id,
      ip_address: logData.ip_address,
      risk_score: logData.risk_score,
      action_taken: logData.action,
      risk_factors: logData.risk_factors,
      reasons: logData.reasons,
      metadata: logData.metadata,
      created_at: new Date().toISOString(),
    });

    // Also log IP and device tracking
    if (logData.ip_address && logData.user_id) {
      await supabase.from('fraud_ip_tracking').upsert({
        ip_address: logData.ip_address,
        user_id: logData.user_id,
        last_seen: new Date().toISOString(),
      });
    }

    // Log session info
    await supabase.from('fraud_session_logs').insert({
      user_id: logData.user_id,
      ip_address: logData.ip_address,
      user_agent: logData.metadata?.user_agent,
      session_id: logData.session_id,
      action_type: logData.action_type,
      created_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Logging error:', error);
  }
}

// Utility functions
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
