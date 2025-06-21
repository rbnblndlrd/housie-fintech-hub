
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserRiskProfileCard from '../UserRiskProfileCard';

interface HighRiskUser {
  user_id: string;
  full_name: string;
  email: string;
  risk_score: number;
  last_activity: string;
}

interface FraudHighRiskUsersProps {
  highRiskUsers: HighRiskUser[];
}

const FraudHighRiskUsers: React.FC<FraudHighRiskUsersProps> = ({ highRiskUsers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>High Risk Users</CardTitle>
        <CardDescription>
          Users with elevated risk scores requiring monitoring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highRiskUsers.map((user) => (
            <UserRiskProfileCard
              key={user.user_id}
              userId={user.user_id}
              userEmail={user.email}
              userName={user.full_name}
              riskScore={user.risk_score}
            />
          ))}
          {highRiskUsers.length === 0 && (
            <p className="text-center text-gray-500 py-8 col-span-full">No high-risk users found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudHighRiskUsers;
