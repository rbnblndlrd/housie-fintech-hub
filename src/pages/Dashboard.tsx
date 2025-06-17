import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Star,
  MapPin,
  Plus,
  Settings,
  PieChart,
  LineChart
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from "recharts";

export const Dashboard = () => {
  const monthlyData = [
    { month: 'Aug', revenue: 2500 },
    { month: 'Sep', revenue: 2750 },
    { month: 'Oct', revenue: 2900 },
    { month: 'Nov', revenue: 3100 },
    { month: 'Dec', revenue: 3300 }
  ];

  const serviceData = [
    { name: 'Nettoyage Régulier', value: 65, color: '#4F46E5' },
    { name: 'Grand Ménage', value: 20, color: '#06B6D4' },
    { name: 'Nettoyage Commercial', value: 10, color: '#F59E0B' },
    { name: 'Autres', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-orange-200">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Business Dashboard</h1>
              <p className="text-gray-600">Customizable widgets and comprehensive business insights</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Toronto, ON</span>
                <Badge variant="outline">Projected</Badge>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </div>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="intelligence" className="mb-8">
            <TabsList className="bg-white">
              <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="intelligence" className="space-y-6">
              {/* Key Metrics Row */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Mileage Tracking */}
                <Card className="bg-white shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mileage Tracking</CardTitle>
                    <Settings className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cyan-600">1,247</div>
                    <p className="text-xs text-gray-500">Miles this month</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <div className="text-sm font-medium">Total Miles</div>
                        <div className="text-lg font-bold">14,865</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-600">Tax Deductible</div>
                        <div className="text-lg font-bold text-green-600">$8,919</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 mt-2">+12% from last month</div>
                  </CardContent>
                </Card>

                {/* Parking Analysis */}
                <Card className="bg-white shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Parking Analysis</CardTitle>
                    <Settings className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">3</div>
                    <p className="text-xs text-gray-500">Tickets this year</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <div className="text-sm font-medium">Total Fees</div>
                        <div className="text-lg font-bold text-red-500">$285</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-600">Dispute Success</div>
                        <div className="text-lg font-bold text-green-600">67%</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Powered by Parking OCR analysis</div>
                  </CardContent>
                </Card>

                {/* Expense Categories */}
                <Card className="bg-white shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expense Categories</CardTitle>
                    <Settings className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$3,216</div>
                    <p className="text-xs text-gray-500">Total expenses</p>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Supplies</span>
                        <span className="ml-auto font-medium">$1247</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Fuel</span>
                        <span className="ml-auto font-medium">$892</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Equipment</span>
                        <span className="ml-auto font-medium">$654</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Insurance</span>
                        <span className="ml-auto font-medium">$423</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tax Analysis */}
                <Card className="bg-white shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Year-over-Year Tax Analysis</CardTitle>
                    <Settings className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">$14,945</div>
                    <p className="text-xs text-gray-500">Estimated tax 2024</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <div className="text-sm font-medium">2023 Tax</div>
                        <div className="text-lg font-bold">$12,340</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-500">Change</div>
                        <div className="text-lg font-bold text-red-500">+21.1%</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Based on current earnings trend</div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics Row */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">$3,247</div>
                    <p className="text-sm text-gray-500">Revenue This Month</p>
                    <div className="text-xs text-green-600 mt-1">+18% from last month</div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <p className="text-sm text-gray-500">Bookings</p>
                    <div className="text-xs text-gray-500 mt-1">This week</div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">4.8</div>
                    <p className="text-sm text-gray-500">Client Rating</p>
                    <div className="text-xs text-gray-500 mt-1">5 recent</div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">+22%</div>
                    <p className="text-sm text-gray-500">Growth Rate</p>
                    <div className="text-xs text-gray-500 mt-1">Above target</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Chart */}
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#4F46E5" 
                          strokeWidth={3}
                          dot={{ fill: '#4F46E5', strokeWidth: 2, r: 6 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Service Distribution */}
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Service Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Tooltip />
                        <RechartsPieChart data={serviceData} cx="50%" cy="50%" outerRadius={100}>
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {serviceData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-xs">{item.name}</span>
                          <span className="text-xs font-medium ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
