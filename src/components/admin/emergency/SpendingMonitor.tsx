
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

interface SpendingMonitorProps {
  controls: any;
  onUpdateLimit: (field: string, value: number) => void;
  isUpdating: boolean;
}

const SpendingMonitor: React.FC<SpendingMonitorProps> = ({
  controls,
  onUpdateLimit,
  isUpdating
}) => {
  const [newDailyLimit, setNewDailyLimit] = useState(controls.daily_spend_limit);
  const [newMonthlyLimit, setNewMonthlyLimit] = useState(controls.monthly_spend_limit);

  const dailySpendPercentage = Math.min((controls.current_daily_spend / controls.daily_spend_limit) * 100, 100);
  const monthlySpendPercentage = Math.min((controls.current_monthly_spend / controls.monthly_spend_limit) * 100, 100);
  
  const isDailyNearLimit = dailySpendPercentage >= 80;
  const isDailyAtLimit = dailySpendPercentage >= 100;
  const isMonthlyNearLimit = monthlySpendPercentage >= 80;
  const isMonthlyAtLimit = monthlySpendPercentage >= 100;

  return (
    <Card className="fintech-chart-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Spending Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Spending */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Daily Spending</h3>
            {isDailyAtLimit && <AlertTriangle className="h-5 w-5 text-red-500" />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Current Spend</p>
              <p className="text-2xl font-bold text-gray-900">
                ${controls.current_daily_spend.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Daily Limit</p>
              <p className="text-2xl font-bold text-gray-900">
                ${controls.daily_spend_limit.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.max(0, controls.daily_spend_limit - controls.current_daily_spend).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Daily Progress</span>
              <span className="text-sm text-gray-600">{dailySpendPercentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={dailySpendPercentage} 
              className={`h-3 ${
                isDailyAtLimit ? 'bg-red-200' : 
                isDailyNearLimit ? 'bg-yellow-200' : 
                'bg-green-200'
              }`}
            />
          </div>

          {isDailyAtLimit && (
            <div className="bg-red-100 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">Daily spend limit reached!</p>
              </div>
              <p className="text-red-700 text-sm mt-1">
                Emergency mode may have been automatically activated.
              </p>
            </div>
          )}

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="dailyLimit">Update Daily Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={newDailyLimit}
                onChange={(e) => setNewDailyLimit(Number(e.target.value))}
                min="0"
                step="10"
                className="mt-1"
              />
            </div>
            <Button
              onClick={() => onUpdateLimit('daily_spend_limit', newDailyLimit)}
              disabled={isUpdating || newDailyLimit === controls.daily_spend_limit}
              className="fintech-button-primary"
            >
              Update
            </Button>
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Monthly Spending</h3>
            {isMonthlyAtLimit && <AlertTriangle className="h-5 w-5 text-red-500" />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Current Spend</p>
              <p className="text-2xl font-bold text-gray-900">
                ${controls.current_monthly_spend.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Monthly Limit</p>
              <p className="text-2xl font-bold text-gray-900">
                ${controls.monthly_spend_limit.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.max(0, controls.monthly_spend_limit - controls.current_monthly_spend).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Monthly Progress</span>
              <span className="text-sm text-gray-600">{monthlySpendPercentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={monthlySpendPercentage} 
              className={`h-3 ${
                isMonthlyAtLimit ? 'bg-red-200' : 
                isMonthlyNearLimit ? 'bg-yellow-200' : 
                'bg-green-200'
              }`}
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="monthlyLimit">Update Monthly Limit</Label>
              <Input
                id="monthlyLimit"
                type="number"
                value={newMonthlyLimit}
                onChange={(e) => setNewMonthlyLimit(Number(e.target.value))}
                min="0"
                step="100"
                className="mt-1"
              />
            </div>
            <Button
              onClick={() => onUpdateLimit('monthly_spend_limit', newMonthlyLimit)}
              disabled={isUpdating || newMonthlyLimit === controls.monthly_spend_limit}
              className="fintech-button-primary"
            >
              Update
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              onUpdateLimit('daily_spend_limit', 50);
              setNewDailyLimit(50);
            }}
            disabled={isUpdating}
            size="sm"
          >
            Set $50 Daily
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onUpdateLimit('daily_spend_limit', 100);
              setNewDailyLimit(100);
            }}
            disabled={isUpdating}
            size="sm"
          >
            Set $100 Daily
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onUpdateLimit('monthly_spend_limit', 1000);
              setNewMonthlyLimit(1000);
            }}
            disabled={isUpdating}
            size="sm"
          >
            Set $1K Monthly
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onUpdateLimit('monthly_spend_limit', 5000);
              setNewMonthlyLimit(5000);
            }}
            disabled={isUpdating}
            size="sm"
          >
            Set $5K Monthly
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingMonitor;
