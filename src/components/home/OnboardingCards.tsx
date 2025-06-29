
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
      description: 'Create a business account',
      image: '/lovable-uploads/analytics-dashboard.png',
      icon: <Truck className="h-12 w-12 text-orange-600" />,
      href: '/services?type=fleet'
    },
    {
      id: 'provider',
      title: 'Looking for Work?',
      description: 'Sign up to provide services',
      image: '/lovable-uploads/housiepro.png',
      icon: <Wrench className="h-12 w-12 text-green-600" />,
      href: '/services?type=provider'
    },
    {
      id: 'customer',
      title: 'Need a Local Expert?',
      description: 'Find trusted professionals',
      image: '/lovable-uploads/browse-services(broken).png',
      icon: <Search className="h-12 w-12 text-purple-600" />,
      href: '/services?type=customer'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Card key={card.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
              <CardTitle className="text-xl font-bold text-gray-900">
                {card.title}
              </CardTitle>
              <p className="text-gray-600 text-sm">
                {card.description}
              </p>
            </CardHeader>
            
            <CardContent>
              <Link to={card.href}>
                <Button variant="outline" className="w-full">
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
