import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Star, 
  Briefcase 
} from 'lucide-react';

interface PerformanceWidget {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

const performanceData: PerformanceWidget[] = [
  {
    title: "Performance",
    value: "94%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-600",
    description: "Track metrics"
  },
  {
    title: "Earnings",
    value: "$2,450",
    change: "+12.5%",
    icon: DollarSign,
    color: "from-yellow-500 to-orange-600",
    description: "Today's total"
  },
  {
    title: "Rating",
    value: "4.9",
    change: "+0.2",
    icon: Star,
    color: "from-purple-500 to-violet-600",
    description: "Stars average"
  },
  {
    title: "Active Jobs",
    value: "3",
    change: "+1",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-600",
    description: "Pending jobs"
  }
];

const PerformanceWidgets = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {performanceData.map((widget, index) => (
        <Card 
          key={index} 
          className="bg-card/95 backdrop-blur-md border-border/20 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{widget.title}</p>
                <p className="text-2xl font-bold text-foreground">{widget.value}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-green-600 font-medium">{widget.change}</p>
                  <p className="text-xs text-muted-foreground">{widget.description}</p>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${widget.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <widget.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceWidgets;