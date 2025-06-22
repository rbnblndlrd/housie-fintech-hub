
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, TrendingUp, DollarSign, Clock } from "lucide-react";

const BookingAnalyticsSection = () => {
  const analytics = {
    totalBookings: 156,
    todayBookings: 23,
    revenue: 4567.89,
    avgBookingValue: 87.50,
    completionRate: 94.2,
    cancelationRate: 5.8
  };

  const recentBookings = [
    { id: 1, service: "Home Cleaning", customer: "Sarah Johnson", amount: 125.00, status: "completed" },
    { id: 2, service: "Plumbing Repair", customer: "Mark Thompson", amount: 85.00, status: "in-progress" },
    { id: 3, service: "Electrical Work", customer: "Lisa Chen", amount: 150.00, status: "scheduled" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Booking Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Bookings</span>
            </div>
            <p className="text-2xl font-bold">{analytics.totalBookings}</p>
            <p className="text-sm text-green-600">+{analytics.todayBookings} today</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <p className="text-2xl font-bold">${analytics.revenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Avg: ${analytics.avgBookingValue}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Completion</span>
            </div>
            <p className="text-2xl font-bold">{analytics.completionRate}%</p>
            <p className="text-sm text-green-600">+2.1% vs last week</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Cancellations</span>
            </div>
            <p className="text-2xl font-bold">{analytics.cancelationRate}%</p>
            <p className="text-sm text-red-600">-0.5% vs last week</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Recent Bookings</h4>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{booking.service}</p>
                  <p className="text-sm text-muted-foreground">{booking.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${booking.amount.toFixed(2)}</p>
                  <Badge variant={booking.status === 'completed' ? 'default' : booking.status === 'in-progress' ? 'secondary' : 'outline'}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingAnalyticsSection;
