
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Wrench, Search, ChevronDown, Users, Shield, Star, Clock, CreditCard, Award, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OnboardingCards = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'crew',
      title: 'Managing a Crew?',
      description: 'Create a business account and coordinate multiple service providers efficiently',
      image: '/lovable-uploads/analytics-dashboard.png',
      icon: <Truck className="h-12 w-12 text-orange-600" />,
      href: '/services?type=fleet',
      features: ['Team coordination', 'Crew scheduling', 'Revenue splitting', 'Fleet analytics']
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
      title: 'Looking for Services?',
      description: 'Find trusted professionals for your home and business needs',
      image: '/lovable-uploads/browse-services(broken).png',
      icon: <Search className="h-12 w-12 text-purple-600" />,
      href: '/services?type=customer',
      features: ['Verified professionals', 'Instant booking', 'Secure payments', 'Privacy focused']
    }
  ];

  const detailedContent = {
    crew: [
      {
        title: 'Team Coordination',
        icon: <Users className="h-8 w-8 text-orange-600" />,
        description: 'Manage your crew members, assign tasks, and track performance in real-time'
      },
      {
        title: 'Crew Licenses',
        icon: <Award className="h-8 w-8 text-orange-600" />,
        description: 'Verify and manage all crew member certifications and licenses'
      },
      {
        title: 'Revenue Splitting',
        icon: <CreditCard className="h-8 w-8 text-orange-600" />,
        description: 'Automatically split payments based on your crew structure and agreements'
      },
      {
        title: 'Fleet Analytics',
        icon: <MapPin className="h-8 w-8 text-orange-600" />,
        description: 'Track crew locations, optimize routes, and analyze performance metrics'
      }
    ],
    provider: [
      {
        title: 'Join Crews',
        icon: <Users className="h-8 w-8 text-green-600" />,
        description: 'Connect with established crews and work as part of a professional team'
      },
      {
        title: 'Individual Jobs',
        icon: <Wrench className="h-8 w-8 text-green-600" />,
        description: 'Find and book individual service opportunities that match your skills'
      },
      {
        title: 'Build Reputation',
        icon: <Star className="h-8 w-8 text-green-600" />,
        description: 'Earn reviews and ratings to build your professional reputation'
      },
      {
        title: 'Professional Tools',
        icon: <CheckCircle className="h-8 w-8 text-green-600" />,
        description: 'Access scheduling, invoicing, and business management tools'
      }
    ],
    customer: [
      {
        title: 'Find Providers',
        icon: <Search className="h-8 w-8 text-purple-600" />,
        description: 'Browse verified professionals in your area with transparent pricing'
      },
      {
        title: 'Escrow Protection',
        icon: <Shield className="h-8 w-8 text-purple-600" />,
        description: 'Your payment is secured until the job is completed to your satisfaction'
      },
      {
        title: 'Verified Professionals',
        icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
        description: 'All service providers are background checked and verified'
      },
      {
        title: 'Real-time Updates',
        icon: <Clock className="h-8 w-8 text-purple-600" />,
        description: 'Get live updates on job progress and provider location'
      }
    ]
  };

  const handleCardClick = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
        <p className="text-lg text-gray-600">Get started with HOUSIE based on your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Card 
            key={card.id} 
            className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer transform hover:scale-105 ${
              selectedCard === card.id ? 'ring-4 ring-orange-600 shadow-xl' : ''
            }`}
            style={{ backgroundColor: '#faf7f2' }}
            onClick={() => handleCardClick(card.id)}
          >
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
              <CardTitle className="text-xl font-bold text-black flex items-center gap-3">
                <div>
                  {card.icon}
                </div>
                {card.title}
                <ChevronDown 
                  className={`h-5 w-5 text-gray-600 ml-auto transition-transform duration-300 ${
                    selectedCard === card.id ? 'rotate-180' : ''
                  }`}
                />
              </CardTitle>
              <p className="text-gray-700 text-sm font-medium">
                {card.description}
              </p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 mb-6 flex-1">
                {card.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700 font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link to={card.href} className="mt-auto">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold">
                  Get started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dynamic detailed content */}
      {selectedCard && (
        <div className="mt-12 animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedCard === 'crew' && 'Crew Management Features'}
              {selectedCard === 'provider' && 'Provider Opportunities'}
              {selectedCard === 'customer' && 'Customer Benefits'}
            </h3>
            <p className="text-gray-600">
              {selectedCard === 'crew' && 'Everything you need to manage your crew efficiently'}
              {selectedCard === 'provider' && 'Tools and opportunities to grow your business'}
              {selectedCard === 'customer' && 'Safe, secure, and reliable service booking'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detailedContent[selectedCard as keyof typeof detailedContent].map((item, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#faf7f2' }}
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-black mb-3">{item.title}</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to={cards.find(c => c.id === selectedCard)?.href || '/services'}>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 text-lg">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingCards;
