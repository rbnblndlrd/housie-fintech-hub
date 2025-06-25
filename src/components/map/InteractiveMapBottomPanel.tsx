
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  AlertTriangle,
  Activity,
  Clock,
  Star
} from 'lucide-react';

interface InteractiveMapBottomPanelProps {
  currentRole: 'customer' | 'provider';
}

const InteractiveMapBottomPanel: React.FC<InteractiveMapBottomPanelProps> = ({
  currentRole
}) => {
  const userArea = "Plateau-Mont-Royal";
  const marketDemand = "High";
  const avgRate = currentRole === 'provider' ? 45 : 50;
  const competition = "Medium";

  const recentActivity = [
    {
      id: 1,
      type: 'job',
      title: 'Apartment Cleaning',
      location: 'Plateau-Mont-Royal',
      time: '5 min ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'application',
      title: 'Handyman Service',
      location: 'Downtown',
      time: '12 min ago',
      status: 'applied'
    },
    {
      id: 3,
      type: 'booking',
      title: 'Lawn Care',
      location: 'Westmount',
      time: '1 hr ago',
      status: 'confirmed'
    }
  ];

  return (
    <div className="h-full flex">
      {/* Regional Market Trends */}
      <Card className="flex-1 m-2 mr-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Regional Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">↗ 15%</div>
              <div className="text-xs text-gray-600">Demand Growth</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">2.3 hrs</div>
              <div className="text-xs text-gray-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">4.8★</div>
              <div className="text-xs text-gray-600">Area Rating</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Cleaning Services</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">High Demand</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Handyman Work</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">Medium Demand</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Moving Services</span>
              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">Low Supply</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Analytics */}
      <Card className="w-80 m-2 mx-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Your Area:</span>
              <span className="text-sm font-medium">{userArea}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-gray-600">Demand</span>
              </div>
              <div className="font-medium text-green-600">{marketDemand}</div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="h-3 w-3 text-blue-600" />
                <span className="text-gray-600">Avg Rate</span>
              </div>
              <div className="font-medium text-blue-600">${avgRate}/hr</div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Users className="h-3 w-3 text-orange-600" />
                <span className="text-gray-600">Competition</span>
              </div>
              <div className="font-medium text-orange-600">{competition}</div>
            </div>

            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="h-3 w-3 text-green-600" />
                <span className="text-gray-600">Opportunity</span>
              </div>
              <div className="font-medium text-green-600">High</div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <div className="text-xs text-green-700 font-medium mb-1">
              Market Insight
            </div>
            <p className="text-xs text-green-600">
              {currentRole === 'provider' 
                ? 'High demand for handyman services. Consider expanding to this area.' 
                : 'Great area with reliable service providers. Average response time: 2 hours.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="flex-1 m-2 ml-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity in Visible Area
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-medium">{activity.title}</div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        activity.status === 'new' ? 'border-green-200 text-green-700' :
                        activity.status === 'applied' ? 'border-blue-200 text-blue-700' :
                        'border-purple-200 text-purple-700'
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="ml-2">
                  <Star className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveMapBottomPanel;
