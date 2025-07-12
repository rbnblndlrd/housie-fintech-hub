import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/hooks/useBookings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

const SpendingSummaryChart = () => {
  const { bookings } = useBookings();
  const [viewMode, setViewMode] = useState<'total' | 'category' | 'timeline'>('total');

  const totalSpent = bookings
    .filter(b => b.total_amount && b.status === 'completed')
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);

  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  // Mock category data - in real app this would come from service categories
  const categoryData = [
    { name: 'Cleaning', amount: totalSpent * 0.4, bookings: Math.floor(completedBookings * 0.4) },
    { name: 'Maintenance', amount: totalSpent * 0.3, bookings: Math.floor(completedBookings * 0.3) },
    { name: 'Gardening', amount: totalSpent * 0.2, bookings: Math.floor(completedBookings * 0.2) },
    { name: 'Other', amount: totalSpent * 0.1, bookings: Math.floor(completedBookings * 0.1) }
  ];

  // Mock timeline data - last 6 months
  const timelineData = [
    { month: 'Jan', amount: totalSpent * 0.1 },
    { month: 'Feb', amount: totalSpent * 0.15 },
    { month: 'Mar', amount: totalSpent * 0.2 },
    { month: 'Apr', amount: totalSpent * 0.18 },
    { month: 'May', amount: totalSpent * 0.22 },
    { month: 'Jun', amount: totalSpent * 0.15 }
  ];

  const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Spending Summary
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'total' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('total')}
            >
              Overview
            </Button>
            <Button
              variant={viewMode === 'category' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('category')}
            >
              By Category
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {viewMode === 'total' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="fintech-inner-box p-4 text-center">
                <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="fintech-inner-box p-4 text-center">
                <div className="text-2xl font-bold text-primary">{completedBookings}</div>
                <div className="text-sm text-muted-foreground">Services Booked</div>
              </div>
              <div className="fintech-inner-box p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  ${completedBookings > 0 ? (totalSpent / completedBookings).toFixed(0) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Avg per Service</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>15% increase from last month</span>
            </div>
          </div>
        )}

        {viewMode === 'category' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(0)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={category.name} className="fintech-inner-box p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${category.amount.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">{category.bookings} bookings</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toFixed(0)}`, 'Spent']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingSummaryChart;