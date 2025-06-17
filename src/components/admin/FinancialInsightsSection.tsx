
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, FileText, Download, Eye } from 'lucide-react';

const FinancialInsightsSection = () => {
  // Mock financial data
  const revenueBreakdown = [
    { month: 'Jan', totalRevenue: 125000, housieeFees: 6250, providerPayouts: 118750 },
    { month: 'Fév', totalRevenue: 148000, housieeFees: 7400, providerPayouts: 140600 },
    { month: 'Mar', totalRevenue: 167000, housieeFees: 8350, providerPayouts: 158650 },
    { month: 'Avr', totalRevenue: 189000, housieeFees: 9450, providerPayouts: 179550 },
    { month: 'Mai', totalRevenue: 215000, housieeFees: 10750, providerPayouts: 204250 },
    { month: 'Jun', totalRevenue: 248000, housieeFees: 12400, providerPayouts: 235600 },
  ];

  const categoryRevenue = [
    { category: 'Nettoyage', revenue: 112000, fees: 5600, color: '#8B5CF6' },
    { category: 'Paysager', revenue: 68000, fees: 3400, color: '#06B6D4' },
    { category: 'Construction', revenue: 35000, fees: 1750, color: '#10B981' },
    { category: 'Bien-être', revenue: 20000, fees: 1000, color: '#F59E0B' },
    { category: 'Animaux', revenue: 13000, fees: 650, color: '#EF4444' },
  ];

  const paymentMethods = [
    { method: 'Carte de crédit', percentage: 65, amount: 161200 },
    { method: 'Carte de débit', percentage: 28, amount: 69440 },
    { method: 'Virement bancaire', percentage: 5, amount: 12400 },
    { method: 'Autre', percentage: 2, amount: 4960 },
  ];

  const regionalPerformance = [
    { region: 'Montréal', revenue: 98000, fees: 4900, growth: 15.2 },
    { region: 'Québec', revenue: 52000, fees: 2600, growth: 12.8 },
    { region: 'Gatineau', revenue: 34000, fees: 1700, growth: 18.5 },
    { region: 'Sherbrooke', revenue: 28000, fees: 1400, growth: 9.3 },
    { region: 'Trois-Rivières', revenue: 19000, fees: 950, growth: 22.1 },
    { region: 'Autres', revenue: 17000, fees: 850, growth: 7.8 },
  ];

  return (
    <div className="space-y-8">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Revenus Totaux</p>
                <p className="text-3xl font-black text-gray-900">248K $</p>
                <p className="text-sm text-green-600 font-semibold mt-1">+22.1% vs mois dernier</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Frais HOUSIE</p>
                <p className="text-3xl font-black text-gray-900">12.4K $</p>
                <p className="text-sm text-blue-600 font-semibold mt-1">5% commission</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Paiements Traités</p>
                <p className="text-3xl font-black text-gray-900">820</p>
                <p className="text-sm text-green-600 font-semibold mt-1">99.2% succès</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rapports Fiscaux</p>
                <p className="text-3xl font-black text-gray-900">156</p>
                <p className="text-sm text-purple-600 font-semibold mt-1">Générés ce mois</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trends */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                Évolution des Revenus
              </CardTitle>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="housieeFees" 
                  stackId="2"
                  stroke="#8B5CF6" 
                  fill="url(#colorFees)" 
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Revenue */}
        <Card className="fintech-chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Revenus par Catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="revenue" fill="url(#colorCategoryRevenue)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorCategoryRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Performance Régionale
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Eye className="h-4 w-4 mr-2" />
              Voir Détails
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalPerformance.map((region, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{region.region}</h3>
                  <Badge className={`${region.growth > 15 ? 'bg-green-100 text-green-800' : region.growth > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    +{region.growth}%
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Revenus</span>
                    <span className="font-bold text-gray-900">{region.revenue.toLocaleString()} $</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Frais HOUSIE</span>
                    <span className="font-semibold text-purple-600">{region.fees.toLocaleString()} $</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(region.revenue / 98000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Distribution */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            Méthodes de Paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                    <span className="font-medium text-gray-700">{method.method}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{method.percentage}%</div>
                    <div className="text-sm text-gray-500">{method.amount.toLocaleString()} $</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInsightsSection;
