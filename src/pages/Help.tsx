
import React, { useState } from 'react';
import { Search, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, MapPin, Zap, Users, DollarSign, Shield, Clock, Star, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Header from '@/components/Header';
import { ChatAssistant } from '@/components/ChatAssistant';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<string[]>(['getting-started']);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const helpSections = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      description: 'Your first steps with HOUSIE',
      icon: <Star className="h-5 w-5" />,
      items: [
        {
          question: 'How do I create my HOUSIE account?',
          answer: 'Click "Sign In" in the top right, then choose "Sign Up" to create your account. You can sign up as a customer or service provider, and switch roles anytime from your profile menu.'
        },
        {
          question: 'How do I switch between Customer and Provider roles?',
          answer: 'Click your profile avatar, then select "Switch to Customer" or "Switch to Provider" from the dropdown menu. Your dashboard and available features will update automatically.'
        },
        {
          question: 'How do I make my first booking?',
          answer: 'Go to "Find Services", browse or search for what you need, select a provider, choose your date and time, then confirm your booking. Payment is held in escrow until service completion.'
        }
      ]
    },
    {
      id: 'interactive-map',
      title: '🗺️ Interactive Map Guide',
      description: 'Master the powerful map features',
      icon: <MapPin className="h-5 w-5" />,
      items: [
        {
          question: 'What are Heat Zones and how do they work?',
          answer: 'Heat Zones show service demand and pricing in different areas of Montreal. Red zones indicate high demand with premium rates, while blue zones show lower demand with standard rates. This helps both customers find services and providers optimize their routes.'
        },
        {
          question: 'How do I use the Emergency Jobs overlay?',
          answer: 'Emergency jobs appear as red markers on the map with lightning bolt icons. These are urgent requests with premium rates ($150-200/hour). Click the marker to see details and accept the job instantly.'
        },
        {
          question: 'What is Fleet Mode on the map?',
          answer: 'Fleet Mode allows business owners to coordinate multiple service providers. You can see all your team members, assign jobs, track routes, and manage operations from a single interface.'
        },
        {
          question: 'How do I enable Location Analytics?',
          answer: 'Location Analytics automatically shows market insights for your current area, including demand levels, average rates, competition density, and opportunity scores. This data helps you make informed business decisions.'
        }
      ]
    },
    {
      id: 'ai-assistant',
      title: '🤖 AI Assistant Help',
      description: 'Get the most from your AI helper',
      icon: <Bot className="h-5 w-5" />,
      items: [
        {
          question: 'How do I access the AI Assistant?',
          answer: 'The AI Assistant is available through the chat bubble in the bottom right corner, or from your user menu under "AI Assistant". It provides personalized insights and automates routine tasks.'
        },
        {
          question: 'What can the AI Assistant help me with?',
          answer: 'The AI can help with booking management, route optimization, market insights, expense tracking, tax compliance questions, scheduling conflicts, and business analytics. Just ask in natural language!'
        },
        {
          question: 'How does voice control work?',
          answer: 'Click the microphone icon in the AI chat to enable voice commands. You can say things like "Show me today\'s bookings" or "Find plumbing jobs near me" and the AI will respond with actions and information.'
        },
        {
          question: 'Can the AI help with tax and compliance?',
          answer: 'Yes! The AI can categorize expenses, generate CRA-compliant reports, track deductible items, remind you of filing deadlines, and answer basic tax questions for Canadian service providers.'
        }
      ]
    },
    {
      id: 'fleet-management',
      title: '🚛 Fleet Management',
      description: 'Coordinate your team effectively',
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          question: 'How do I set up my fleet?',
          answer: 'Go to your Provider Dashboard, click "Fleet Management", then "Add Team Member". Send invitations via email and your team members will appear on your fleet map once they accept.'
        },
        {
          question: 'How do I assign jobs to my team?',
          answer: 'From the Interactive Map in Fleet Mode, click on any job marker and select "Assign to Team Member". You can also use bulk assignment features to distribute multiple jobs efficiently.'
        },
        {
          question: 'Can I track my team\'s routes and progress?',
          answer: 'Yes! Fleet Mode shows real-time locations, current job status, estimated completion times, and route optimization suggestions for all team members.'
        },
        {
          question: 'How does revenue sharing work for fleets?',
          answer: 'Set up revenue splits in Fleet Settings. You can choose percentage-based splits, flat fees, or custom arrangements. All payments are automatically distributed according to your settings.'
        }
      ]
    },
    {
      id: 'fintech-features',
      title: '💰 Fintech Features',
      description: 'Financial tools and payment security',
      icon: <DollarSign className="h-5 w-5" />,
      items: [
        {
          question: 'How does Escrow Protection work?',
          answer: 'When customers book services, payment is held securely in escrow until the job is completed to satisfaction. This protects both parties and ensures fair transactions.'
        },
        {
          question: 'What is the Credit System?',
          answer: 'HOUSIE Credits are used for premium features, urgent bookings, and enhanced visibility. Purchase credits through your dashboard or earn them through excellent service ratings.'
        },
        {
          question: 'How do I track expenses for tax purposes?',
          answer: 'Use the built-in expense tracker in your dashboard. Categorize expenses, upload receipts, and generate CRA-compliant reports. The AI can help categorize transactions automatically.'
        },
        {
          question: 'What are Group Bookings?',
          answer: 'Group Bookings allow multiple customers to share service costs (like moving services or event setup). Create a group booking and invite others to split the payment automatically.'
        }
      ]
    },
    {
      id: 'booking-payments',
      title: '💳 Bookings & Payments',
      description: 'Secure transactions and booking management',
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit cards, debit cards, and e-transfers. All transactions are processed securely with end-to-end encryption and fraud detection.'
        },
        {
          question: 'How do I modify or cancel a booking?',
          answer: 'Go to "My Bookings" in your dashboard, find the booking, and click "Modify" or "Cancel". Cancellation policies vary by service provider and timing.'
        },
        {
          question: 'What if I\'m not satisfied with the service?',
          answer: 'Contact us through the platform immediately. We offer dispute resolution, service guarantees, and refund protection. Your payment stays in escrow until issues are resolved.'
        },
        {
          question: 'How do I leave reviews and ratings?',
          answer: 'After service completion, you\'ll receive a prompt to rate and review. Honest reviews help maintain service quality and help other users make informed decisions.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: '🔧 Troubleshooting',
      description: 'Common issues and solutions',
      icon: <Zap className="h-5 w-5" />,
      items: [
        {
          question: 'The map isn\'t loading properly',
          answer: 'Try refreshing the page, check your internet connection, and ensure location services are enabled. If issues persist, try clearing your browser cache or contact support.'
        },
        {
          question: 'I can\'t see available services in my area',
          answer: 'Expand your search radius, check if you\'re in a supported service area, or try different service categories. Some specialized services may have limited availability.'
        },
        {
          question: 'Payment or booking errors',
          answer: 'Verify your payment information, check for sufficient funds, and ensure all required fields are completed. Contact support if payment processing continues to fail.'
        },
        {
          question: 'Account or login issues',
          answer: 'Try password reset, check your email for verification links, and ensure you\'re using the correct login method. Contact support if you can\'t access your account.'
        }
      ]
    }
  ];

  const filteredSections = helpSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            HOUSIE Help Center
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Everything you need to know about using HOUSIE's powerful features
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
            />
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600">Get instant help</p>
                <Badge variant="secondary" className="mt-2">Available 24/7</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Mail className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-sm text-gray-600">help@housie.ca</p>
                <Badge variant="secondary" className="mt-2">Response in 2h</Badge>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Phone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold mb-1">Phone Support</h3>
                <p className="text-sm text-gray-600">1-800-HOUSIE</p>
                <Badge variant="secondary" className="mt-2">Mon-Fri 9-6</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Articles */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <Card key={section.id} className="shadow-sm">
                <Collapsible 
                  open={openSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {section.icon}
                          <div>
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                          </div>
                        </div>
                        {openSections.includes(section.id) ? 
                          <ChevronDown className="h-5 w-5" /> : 
                          <ChevronRight className="h-5 w-5" />
                        }
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {section.items.map((item, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                            <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {filteredSections.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try different keywords or browse all sections above</p>
            </div>
          )}
        </div>
      </section>

      <ChatAssistant />
    </div>
  );
};

export default Help;
