
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  MapPin, 
  Calendar, 
  FileText, 
  Settings,
  Phone,
  CreditCard
} from 'lucide-react';

const QuickActionsGrid = () => {
  const quickActions = [
    { 
      icon: Plus, 
      title: 'New Job', 
      subtitle: 'Create ticket',
      color: 'from-blue-600 to-blue-800',
      urgent: false
    },
    { 
      icon: Phone, 
      title: 'Emergency', 
      subtitle: 'Urgent call',
      color: 'from-red-600 to-red-800',
      urgent: true
    },
    { 
      icon: Users, 
      title: 'Crew Status', 
      subtitle: 'Team overview',
      color: 'from-green-600 to-green-800',
      urgent: false
    },
    { 
      icon: MapPin, 
      title: 'Route Plan', 
      subtitle: 'GPS optimize',
      color: 'from-purple-600 to-purple-800',
      urgent: false
    },
    { 
      icon: Calendar, 
      title: 'Schedule', 
      subtitle: 'View calendar',
      color: 'from-yellow-600 to-yellow-800',
      urgent: false
    },
    { 
      icon: CreditCard, 
      title: 'Payments', 
      subtitle: 'Process billing',
      color: 'from-indigo-600 to-indigo-800',
      urgent: false
    }
  ];

  return (
    <Card className="autumn-card-fintech-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
            <Settings className="h-4 w-4 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              className={`
                relative h-24 p-4 bg-gradient-to-br ${action.color} 
                hover:scale-105 transition-all duration-200 
                shadow-lg hover:shadow-xl border-4 border-white/20
                ${action.urgent ? 'animate-pulse' : ''}
              `}
              variant="ghost"
            >
              <div className="flex flex-col items-center gap-2 text-white">
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-bold text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.subtitle}</div>
                </div>
              </div>
              {action.urgent && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white animate-bounce">
                  !
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsGrid;
