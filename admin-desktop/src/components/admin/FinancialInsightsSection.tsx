
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from "lucide-react";

const FinancialInsightsSection = () => {
  const financialData = {
    totalRevenue: 45231.50,
    monthlyRevenue: 12567.80,
    weeklyRevenue: 3456.90,
    dailyRevenue: 567.45,
    totalTransactions: 1234,
    averageTransactionValue: 36.67,
    pendingPayouts: 8934.20,
    platformFees: 2345.67
  };

  const revenueStreams = [
    { name: "Service Bookings", amount: 32450.20, percentage: 71.8, trend: "+12%" },
    { name: "Platform Fees", amount: 8760.30, percentage: 19.4, trend: "+8%" },
    { name: "Premium Subscriptions", amount: 2890.50, percentage: 6.4, trend: "+24%" },
    { name: "Advertising", amount: 1130.50, percentage: 2.4, trend: "+6%" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Insights
          <Badge variant="secondary">Real-time</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold">${financialData.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600">+15.2% vs last month</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Monthly Revenue</span>
            </div>
            <p className="text-2xl font-bold">${financialData.monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600">+8.7% vs last month</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Avg Transaction</span>
            </div>
            <p className="text-2xl font-bold">${financialData.averageTransactionValue}</p>
            <p className="text-sm text-muted-foreground">{financialData.totalTransactions} total</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Pending Payouts</span>
            </div>
            <p className="text-2xl font-bold">${financialData.pendingPayouts.toLocaleString()}</p>
            <p className="text-sm text-orange-600">Awaiting processing</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Revenue Breakdown</h4>
          <div className="space-y-3">
            {revenueStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{stream.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">${stream.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{stream.percentage}% of total</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {stream.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Today</span>
            <p className="text-xl font-bold">${financialData.dailyRevenue}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">This Week</span>
            <p className="text-xl font-bold">${financialData.weeklyRevenue.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Platform Fees</span>
            <p className="text-xl font-bold">${financialData.platformFees.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialInsightsSection;
