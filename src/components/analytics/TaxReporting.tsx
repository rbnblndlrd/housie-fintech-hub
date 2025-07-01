
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calculator, 
  Download, 
  Calendar,
  DollarSign,
  Receipt,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const TaxReporting = () => {
  const taxData = [
    { period: 'Q4 2023', revenue: '$89,450', tax: '$13,417', status: 'Filed', date: '2024-01-15' },
    { period: 'Q3 2023', revenue: '$76,230', tax: '$11,435', status: 'Filed', date: '2023-10-15' },
    { period: 'Q2 2023', revenue: '$82,180', tax: '$12,327', status: 'Filed', date: '2023-07-15' },
    { period: 'Q1 2024', revenue: '$94,720', tax: '$14,208', status: 'Pending', date: '2024-04-15' }
  ];

  const deductions = [
    { category: 'Vehicle Expenses', amount: '$4,250', percentage: '45%' },
    { category: 'Equipment & Tools', amount: '$2,180', percentage: '23%' },
    { category: 'Insurance', amount: '$1,680', percentage: '18%' },
    { category: 'Office Supplies', amount: '$890', percentage: '10%' },
    { category: 'Professional Services', amount: '$420', percentage: '4%' }
  ];

  const upcomingDeadlines = [
    { task: 'Q1 2024 Filing', date: 'April 30, 2024', status: 'urgent' },
    { task: 'Annual Tax Return', date: 'June 15, 2024', status: 'upcoming' },
    { task: 'GST/HST Return', date: 'May 31, 2024', status: 'upcoming' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Filed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDeadlineColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-50 border-red-300';
      case 'upcoming': return 'bg-yellow-50 border-yellow-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <Card className="banking-card">
      <CardHeader>
        <CardTitle className="banking-title flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          Tax Reporting & Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tax Filing History */}
          <div className="lg:col-span-2">
            <h3 className="banking-subtitle text-lg mb-4">Filing History</h3>
            <div className="space-y-3">
              {taxData.map((filing, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/70 rounded-xl border-2 border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="banking-title text-sm">{filing.period}</h4>
                      <Badge className={`${getStatusColor(filing.status)} text-xs`}>
                        {filing.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="banking-text">Revenue: {filing.revenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calculator className="h-3 w-3 text-blue-600" />
                        <span className="banking-text">Tax: {filing.tax}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-3 w-3 text-gray-600" />
                      <span className="banking-text text-xs">Filed: {filing.date}</span>
                    </div>
                  </div>
                  <Button size="sm" className="banking-button-secondary">
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <h3 className="banking-subtitle text-lg mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 ${getDeadlineColor(deadline.status)}`}>
                  <div className="flex items-start gap-2">
                    {deadline.status === 'urgent' && <AlertCircle className="h-4 w-4 text-red-600 mt-1" />}
                    <div className="flex-1">
                      <h4 className="banking-title text-sm mb-1">{deadline.task}</h4>
                      <p className="banking-text text-xs">{deadline.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="mt-8">
          <h3 className="banking-subtitle text-lg mb-4">Tax Deductions Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {deductions.map((deduction, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="banking-text font-semibold text-sm">{deduction.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="banking-text text-sm">{deduction.amount}</span>
                        <Badge className="banking-badge text-xs">{deduction.percentage}</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-300">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: deduction.percentage }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="banking-title text-lg mb-2">Total Deductions</h4>
                <p className="text-3xl font-black text-green-700 mb-2">$9,420</p>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-bold text-sm">+12% vs last year</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button className="banking-button-primary">
            <FileText className="h-4 w-4 mr-2" />
            Generate Tax Report
          </Button>
          <Button className="banking-button-secondary">
            <Calculator className="h-4 w-4 mr-2" />
            Tax Calculator
          </Button>
          <Button className="banking-button-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export All Records
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxReporting;
