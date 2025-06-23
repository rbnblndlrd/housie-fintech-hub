import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTaxData } from '@/hooks/useTaxData';
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { user } = useAuth();
  const { taxData, loading, error, refreshTaxData } = useTaxData(user?.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const taxSummary = [
    { 
      label: "Total Earnings", 
      value: formatCurrency(taxData.totalEarnings), 
      description: "Current tax year" 
    },
    { 
      label: "Business Expenses", 
      value: formatCurrency(taxData.businessExpenses), 
      description: "Tax deductible" 
    },
    { 
      label: "Net Income", 
      value: formatCurrency(taxData.netIncome), 
      description: "After expenses" 
    },
    { 
      label: "Estimated Tax", 
      value: formatCurrency(taxData.estimatedTax), 
      description: "15% rate estimate" 
    }
  ];

  const complianceMetrics = [
    { 
      label: formatCurrency(taxData.totalEarnings), 
      description: "Annual Income", 
      subtext: `Threshold: $2,600 ${taxData.totalEarnings >= 2600 ? '✅' : '❌'}`,
      status: taxData.totalEarnings >= 2600 ? "compliant" : "below-threshold"
    },
    { 
      label: taxData.totalTransactions.toString(), 
      description: "Total Transactions", 
      subtext: `Threshold: 30 service ${taxData.totalTransactions >= 30 ? '✅' : '❌'}`,
      status: taxData.totalTransactions >= 30 ? "compliant" : "below-threshold"
    },
    { 
      label: taxData.complianceRequired ? "Required" : "Not Required", 
      description: "CRA Reporting", 
      subtext: "Last updated: " + new Date().toISOString().split('T')[0],
      status: taxData.complianceRequired ? "action-needed" : "compliant"
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error loading tax data</p>
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshTaxData}
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
              <Button variant="outline" onClick={refreshTaxData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button variant="outline">📊 Export Report</Button>
            </div>
          </div>

          {/* Compliance Alert */}
          {taxData.complianceRequired && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Compliance Status:</strong> Reporting required ({formatCurrency(taxData.totalEarnings)} income or {taxData.totalTransactions} transactions). Tax documentation is mandatory.
              </AlertDescription>
            </Alert>
          )}

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
                  {loading ? (
                    <Skeleton className="h-8 w-24 mb-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
                  )}
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
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-600 border-b pb-2">
                      <span>Quarter</span>
                      <span>Gross</span>
                      <span>Net</span>
                      <span>Transactions</span>
                    </div>
                    {taxData.quarterlyData.map((quarter, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                        <span className="font-medium">{quarter.quarter}</span>
                        <span>{formatCurrency(quarter.gross)}</span>
                        <span>{formatCurrency(quarter.net)}</span>
                        <span>{quarter.transactions}</span>
                      </div>
                    ))}
                  </div>
                )}
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
                  {taxData.documents.map((doc, index) => (
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
                  {loading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    taxData.recentDocuments.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{doc.name}</span>
                        <span className="text-gray-500">{doc.date}</span>
                      </div>
                    ))
                  )}
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
                    {loading ? (
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    ) : (
                      <div className="text-3xl font-bold text-gray-900 mb-2">{metric.label}</div>
                    )}
                    <div className="text-sm font-semibold text-gray-700 mb-1">{metric.description}</div>
                    <div className={`text-xs ${
                      metric.status === 'compliant' || metric.status === 'below-threshold' 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`}>
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
