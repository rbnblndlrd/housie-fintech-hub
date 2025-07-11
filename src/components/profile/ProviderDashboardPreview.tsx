import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Star, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  CheckCircle,
  Settings,
  FileText
} from 'lucide-react';

const ProviderDashboardPreview = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: 'Active Services', value: '1', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Rating', value: '5.0', icon: Star, color: 'text-yellow-500' },
    { label: 'Earnings', value: '$0', icon: DollarSign, color: 'text-green-500' },
    { label: 'Bookings', value: '0', icon: Calendar, color: 'text-purple-500' }
  ];

  const nextSteps = [
    {
      title: 'Complete Service Setup',
      description: 'Finish setting up your first service offering',
      action: 'Setup Service',
      icon: FileText,
      completed: false
    },
    {
      title: 'Verify Profile',
      description: 'Add verification documents to build trust',
      action: 'Verify Now',
      icon: CheckCircle,
      completed: false
    },
    {
      title: 'Configure Settings',
      description: 'Set your availability and service area',
      action: 'Configure',
      icon: Settings,
      completed: false
    }
  ];

  return (
    <Card className="bg-muted/30 backdrop-blur-md border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Provider Dashboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Welcome to your provider account! Complete setup to start earning.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Next Steps</h4>
          <div className="space-y-2">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 rounded-full p-2">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground text-sm">{step.title}</h5>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {step.action}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Button 
            onClick={() => navigate('/provider-setup')}
            className="w-full"
          >
            Complete Provider Setup
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderDashboardPreview;