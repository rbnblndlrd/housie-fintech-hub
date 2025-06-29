
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Wrench, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const OnboardingCards = () => {
  const cards = [
    {
      id: 'fleet',
      title: 'Managing a Fleet?',
      description: 'Create a business account and coordinate multiple service providers efficiently',
      image: '/lovable-uploads/analytics-dashboard.png',
      icon: <Truck className="h-12 w-12 text-orange-600" />,
      href: '/services?type=fleet',
      features: ['Team coordination', 'Bulk scheduling', 'Fleet analytics', 'Revenue optimization']
    },
    {
      id: 'provider',
      title: 'Looking for Work?',
      description: 'Sign up to provide services and join our network of verified professionals',
      image: '/lovable-uploads/housiepro.png',
      icon: <Wrench className="h-12 w-12 text-green-600" />,
      href: '/services?type=provider',
      features: ['Verified leads', 'Flexible scheduling', 'Payment protection', 'Business tools']
    },
    {
      id: 'customer',
      title: 'Need a Local Expert?',
      description: 'Find trusted professionals for your home and business needs',
      image: '/lovable-uploads/browse-services(broken).png',
      icon: <Search className="h-12 w-12 text-purple-600" />,
      href: '/services?type=customer',
      features: ['Verified professionals', 'Instant booking', 'Secure payments', 'Privacy focused']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
        <p className="text-lg text-gray-600">Get started with HOUSIE based on your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Card key={card.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="aspect-video relative">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextSibling) {
                    nextSibling.style.display = 'flex';
                  }
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
                {card.icon}
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="text-orange-600">
                  {card.icon}
                </div>
                {card.title}
              </CardTitle>
              <p className="text-gray-600 text-sm">
                {card.description}
              </p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 mb-6 flex-1">
                {card.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link to={card.href} className="mt-auto">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Get started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OnboardingCards;
