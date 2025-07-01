
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, FileText, Download, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const TaxReporting = () => {
  const taxSummary = {
    totalRevenue: 147650,
    deductibleExpenses: 32400,
    taxableIncome: 115250,
    estimatedTax: 23050,
    quarterlySavings: 5762.50
  };

  const expenseCategories = [
    { category: 'Vehicle & Fuel', amount: 12400, percentage: 38, deductible: 100 },
    { category: 'Equipment & Tools', amount: 8600, percentage: 27, deductible: 100 },
    { category: 'Insurance', amount: 4800, percentage: 15, deductible: 100 },
    { category: 'Marketing', amount: 3200, percentage: 10, deductible: 80 },
    { category: 'Training & Certification', amount: 2100, percentage: 6, deductible: 100 },
    { category: 'Office Supplies', amount: 1300, percentage: 4, deductible: 90 }
  ];

  const quarterlyBreakdown = [
    { quarter: 'Q1 2024', revenue: 35200, expenses: 7800, taxSaved: 5490 },
    { quarter: 'Q2 2024', revenue: 38900, expenses: 8600, taxSaved: 6070 },
    { quarter: 'Q3 2024', revenue: 41200, expenses: 9200, taxSaved: 6400 },
    { quarter: 'Q4 2024', revenue: 32350, expenses: 6800, taxSaved: 5090 }
  ];

  return (
    <Card className="autumn-card-fintech-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            Tax Reporting & Planning
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge className="bg-red-100 text-red-800 px-4 py-2 text-lg font-bold border-2 border-red-200">
              2024 Tax Year
            </Badge>
            <Button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 text-lg font-bold">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="p-6 bg-green-50 rounded-xl border-4 border-green-200 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-green-800">
              ${taxSummary.totalRevenue.toLocaleString()}
            </div>
            <div className="text-green-600 font-bold">Total Revenue</div>
          </div>
          
          <div className="p-6 bg-blue-50 rounded-xl border-4 border-blue-200 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-blue-800">
              ${taxSummary.deductibleExpenses.toLocaleString()}
            </div>
            <div className="text-blue-600 font-bold">Deductibles</div>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-xl border-4 border-purple-200 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-purple-800">
              ${taxSummary.taxableIncome.toLocaleString()}
            </div>
            <div className="text-purple-600 font-bold">Taxable Income</div>
          </div>
          
          <div className="p-6 bg-red-50 rounded-xl border-4 border-red-200 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-red-800">
              ${taxSummary.estimatedTax.toLocaleString()}
            </div>
            <div className="text-red-600 font-bold">Est. Tax Owed</div>
          </div>
          
          <div className="p-6 bg-yellow-50 rounded-xl border-4 border-yellow-200 text-center">
            <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-yellow-800">
              ${taxSummary.quarterlySavings.toLocaleString()}
            </div>
            <div className="text-yellow-600 font-bold">Quarterly Payment</div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gray-900 mb-4">Deductible Expenses</h3>
            {expenseCategories.map((expense, index) => (
              <div key={index} className="p-4 bg-white rounded-xl border-3 border-amber-200 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-gray-900 text-lg">{expense.category}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      {expense.deductible}% deductible
                    </Badge>
                    <span className="text-gray-900 font-black text-lg">
                      ${expense.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-700 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${expense.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">
                  {expense.percentage}% of total expenses
                </div>
              </div>
            ))}
          </div>

          {/* Quarterly Breakdown */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-gray-900 mb-4">Quarterly Summary</h3>
            {quarterlyBreakdown.map((quarter, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-4 border-indigo-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-black text-indigo-900 text-xl">{quarter.quarter}</h4>
                  <Badge className="bg-indigo-500 text-white px-3 py-1 text-sm font-bold">
                    ${quarter.taxSaved.toLocaleString()} saved
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-indigo-600 font-bold mb-1">Revenue</div>
                    <div className="text-indigo-900 font-black text-lg">
                      ${quarter.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-indigo-600 font-bold mb-1">Expenses</div>
                    <div className="text-indigo-900 font-black text-lg">
                      ${quarter.expenses.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-4 border-amber-200">
          <Button className="bg-gradient-to-r from-green-600 to-green-800 text-white font-bold py-4 text-lg">
            <FileText className="h-5 w-5 mr-2" />
            Generate T4A Forms
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 text-lg">
            <Calculator className="h-5 w-5 mr-2" />
            Calculate HST/GST
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-4 text-lg">
            <Download className="h-5 w-5 mr-2" />
            Export to CRA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxReporting;
