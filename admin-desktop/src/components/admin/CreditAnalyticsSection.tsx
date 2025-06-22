
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Coins, TrendingUp, Users, ShoppingCart } from "lucide-react";

const CreditAnalyticsSection = () => {
  const creditData = {
    totalCreditsIssued: 125000,
    creditsUsed: 87500,
    creditsRemaining: 37500,
    totalPurchases: 456,
    averagePurchase: 25.50,
    conversionRate: 12.4
  };

  const creditPackages = [
    { name: "Starter Pack", credits: 100, price: 9.99, sold: 156, revenue: 1558.44 },
    { name: "Standard Pack", credits: 250, price: 19.99, sold: 89, revenue: 1779.11 },
    { name: "Premium Pack", credits: 500, price: 34.99, sold: 67, revenue: 2344.33 },
    { name: "Enterprise Pack", credits: 1000, price: 59.99, sold: 23, revenue: 1379.77 }
  ];

  const usageStats = [
    { feature: "AI Chat", credits: 25000, percentage: 28.6 },
    { feature: "Premium Services", credits: 20000, percentage: 22.9 },
    { feature: "Priority Booking", credits: 18000, percentage: 20.6 },
    { feature: "Extra Features", credits: 15000, percentage: 17.1 },
    { feature: "Other", credits: 9500, percentage: 10.8 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Credit Analytics
          <Badge variant="secondary">Live Data</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Total Issued</span>
            </div>
            <p className="text-2xl font-bold">{creditData.totalCreditsIssued.toLocaleString()}</p>
            <p className="text-sm text-green-600">+8.2% this month</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Credits Used</span>
            </div>
            <p className="text-2xl font-bold">{creditData.creditsUsed.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{((creditData.creditsUsed / creditData.totalCreditsIssued) * 100).toFixed(1)}% utilization</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Purchases</span>
            </div>
            <p className="text-2xl font-bold">{creditData.totalPurchases}</p>
            <p className="text-sm text-muted-foreground">Avg: ${creditData.averagePurchase}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
            </div>
            <p className="text-2xl font-bold">{creditData.conversionRate}%</p>
            <p className="text-sm text-green-600">+2.1% vs last month</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Credit Package Performance</h4>
          <div className="space-y-3">
            {creditPackages.map((pack, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="font-medium">{pack.name}</p>
                    <p className="text-sm text-muted-foreground">{pack.credits} credits - ${pack.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{pack.sold} sold</p>
                  <p className="text-sm text-green-600">${pack.revenue.toFixed(2)} revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Credit Usage by Feature</h4>
          <div className="space-y-3">
            {usageStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{stat.feature}</span>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">{stat.credits.toLocaleString()} credits</p>
                    <p className="text-sm text-muted-foreground">{stat.percentage}% of usage</p>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${stat.percentage * 2}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditAnalyticsSection;
