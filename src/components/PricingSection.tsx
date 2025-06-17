
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Basic service listing",
        "Up to 5 bookings per month",
        "Standard support",
        "Basic expense tracking"
      ],
      popular: false
    },
    {
      name: "Starter",
      price: "$8",
      period: "month",
      description: "Best for individual providers",
      features: [
        "Unlimited service listings",
        "Up to 25 bookings per month",
        "Priority support",
        "Advanced expense tracking",
        "CRA compliance reports",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$15",
      period: "month",
      description: "Perfect for growing businesses",
      features: [
        "Everything in Starter",
        "Unlimited bookings",
        "Advanced analytics dashboard",
        "Automated tax categorization",
        "Multi-service management",
        "Customer relationship tools"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "$25",
      period: "month",
      description: "For established service providers",
      features: [
        "Everything in Pro",
        "White-label branding",
        "Advanced financial insights",
        "Dedicated account manager",
        "API access",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start free and scale as your business grows. All plans include CRA compliance tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 ${plan.popular ? 'border-purple-500 scale-105' : 'border-gray-200'} bg-white shadow-lg hover:shadow-xl transition-all`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-black">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-orange-500">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
