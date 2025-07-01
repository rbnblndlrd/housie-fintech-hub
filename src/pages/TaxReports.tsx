
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign,
  Receipt,
  Calculator
} from 'lucide-react';

const TaxReports = () => {
  const taxSummary = [
    {
      title: "Total Revenue",
      value: "$124,350",
      period: "2024 YTD",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Deductible Expenses",
      value: "$18,420",
      period: "2024 YTD",
      icon: Receipt,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Net Income",
      value: "$105,930",
      period: "2024 YTD",
      icon: Calculator,
      color: "from-purple-600 to-violet-600"
    }
  ];

  const availableReports = [
    {
      title: "Annual Tax Summary",
      description: "Complete tax summary for the year",
      period: "2024",
      format: "PDF"
    },
    {
      title: "Quarterly Report Q4",
      description: "Fourth quarter earnings report",
      period: "Q4 2024",
      format: "PDF"
    },
    {
      title: "Monthly Breakdown",
      description: "Detailed monthly income and expenses",
      period: "December 2024",
      format: "Excel"
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Tax Reports
              </h1>
              <p className="text-white/90">
                Generate and download tax reports for your business
              </p>
            </div>

            {/* Tax Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {taxSummary.map((item, index) => (
                <Card key={index} className="fintech-metric-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium opacity-80 mb-1">{item.title}</p>
                        <p className="text-3xl font-bold">{item.value}</p>
                        <p className="text-sm opacity-70 mt-1">{item.period}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Available Reports */}
            <Card className="fintech-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Available Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm opacity-70">{report.description}</p>
                      <p className="text-xs opacity-60 mt-1">{report.period} • {report.format}</p>
                    </div>
                    <Button className="fintech-button-secondary">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Generate Custom Report */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Generate Custom Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <select className="fintech-input w-full">
                      <option>Income Statement</option>
                      <option>Expense Report</option>
                      <option>Tax Summary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date Range</label>
                    <select className="fintech-input w-full">
                      <option>Last Quarter</option>
                      <option>Last 6 Months</option>
                      <option>Year to Date</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <select className="fintech-input w-full">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>
                </div>
                <Button className="fintech-button-primary w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxReports;
