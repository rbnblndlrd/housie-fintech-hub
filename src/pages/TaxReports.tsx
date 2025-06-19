
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Download, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const TaxReports = () => {
  const navigate = useNavigate();

  const taxSummary = [
    { label: "Total Earnings", value: "$27,000.00", description: "Current tax year" },
    { label: "Business Expenses", value: "$235.00", description: "Tax deductible" },
    { label: "Net Income", value: "$26,765.00", description: "After expenses" },
    { label: "Estimated Tax", value: "$4,014.75", description: "15% rate estimate" }
  ];

  const quarterlyData = [
    { quarter: "Q1 2025", gross: "$12,000.00", net: "$10,200.00", transactions: 45 },
    { quarter: "Q2 2025", gross: "$15,000.00", net: "$12,750.00", transactions: 52 }
  ];

  const taxDocuments = [
    { name: "T4A Tax Slip", description: "Official CRA tax document", action: "Generate" },
    { name: "Annual Tax Summary", description: "Complete income and expense report", action: "Generate" },
    { name: "Quarterly Summary", description: "Q4 2024 earnings breakdown", action: "Generate" }
  ];

  const recentDocuments = [
    { name: "T4A - 2025", date: "2025-06-16" }
  ];

  const complianceMetrics = [
    { 
      label: "$27,000.00", 
      description: "Annual Income", 
      subtext: "Threshold: $2,600 ✅",
      status: "compliant"
    },
    { 
      label: "97", 
      description: "Total Transactions", 
      subtext: "Threshold: 30 service ✅",
      status: "compliant"
    },
    { 
      label: "Required", 
      description: "CRA Reporting", 
      subtext: "Last updated: 2025-06-16",
      status: "action-needed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate('/analytics-dashboard')}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
              >
                ← Retour aux Analytiques
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Tax Reports & Compliance</h1>
            </div>
            <p className="text-gray-600">Tax compliance dashboard and official documents</p>
            
            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline">Date Range</Button>
              <Button variant="outline">All Reports</Button>
            </div>
          </div>

          {/* Compliance Alert */}
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Compliance Status:</strong> Reporting required ($27,000.00 income or 97 transactions). Tax documentation is mandatory.
            </AlertDescription>
          </Alert>

          {/* Tax Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {taxSummary.map((item, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-sm text-gray-600 mb-1">{item.label}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Quarterly Breakdown */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Quarterly Income Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-600 border-b pb-2">
                    <span>Quarter</span>
                    <span>Gross</span>
                    <span>Net</span>
                    <span>Transactions</span>
                  </div>
                  {quarterlyData.map((quarter, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                      <span className="font-medium">{quarter.quarter}</span>
                      <span>{quarter.gross}</span>
                      <span>{quarter.net}</span>
                      <span>{quarter.transactions}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tax Documents */}
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Tax Documents & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxDocuments.map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                      <Button size="sm" className="fintech-button-primary">
                        <Download className="h-4 w-4 mr-1" />
                        {doc.action}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Documents</h4>
                  {recentDocuments.map((doc, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{doc.name}</span>
                      <span className="text-gray-500">{doc.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Status */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {complianceMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{metric.label}</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">{metric.description}</div>
                    <div className={`text-xs ${metric.status === 'compliant' ? 'text-green-600' : 'text-orange-600'}`}>
                      {metric.subtext}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxReports;
