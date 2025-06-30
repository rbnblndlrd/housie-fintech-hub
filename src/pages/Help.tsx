
import React from 'react';
import Header from '@/components/Header';
import VideoBackground from '@/components/common/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  BookOpen, 
  HelpCircle,
  Users,
  Settings,
  CreditCard,
  Shield,
  MapPin,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

const Help = () => {
  const faqItems = [
    {
      category: "Getting Started",
      icon: BookOpen,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top right corner and follow the registration process. You'll need to provide your email and create a password."
        },
        {
          q: "How do I book a service?",
          a: "Search for services in your area, browse providers, select your preferred provider, choose a time slot, and complete the booking."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through Stripe."
        }
      ]
    },
    {
      category: "Account & Billing",
      icon: CreditCard,
      questions: [
        {
          q: "How do I update my payment method?",
          a: "Go to your Profile Settings > Account > Manage Subscription to update your payment information."
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your current billing period."
        },
        {
          q: "How do I get a refund?",
          a: "Refunds are processed according to our refund policy. Contact support for assistance with refund requests."
        }
      ]
    },
    {
      category: "Safety & Security",
      icon: Shield,
      questions: [
        {
          q: "Are service providers background checked?",
          a: "Yes, all providers undergo background checks and verification. Look for the verified badge on provider profiles."
        },
        {
          q: "How do I report a problem?",
          a: "You can report issues through your booking history or contact our support team directly."
        },
        {
          q: "Is my personal information secure?",
          a: "We use industry-standard encryption and security measures to protect your personal information."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: true
    },
    {
      title: "Phone Support",
      description: "Call us at 1-800-HOUSIE-1",
      icon: Phone,
      action: "Call Now",
      available: true
    },
    {
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      icon: Mail,
      action: "Send Email",
      available: true
    },
    {
      title: "Community Forum",
      description: "Get help from other users and experts",
      icon: Users,
      action: "Visit Forum",
      available: true
    }
  ];

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white text-shadow-lg mb-4">
                How can we help you?
              </h1>
              <p className="text-white/90 text-shadow text-lg mb-6">
                Find answers to common questions or get in touch with our support team
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                <Input
                  placeholder="Search for help topics..."
                  className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm h-12 text-lg"
                />
              </div>
            </div>

            <Tabs defaultValue="faq" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md">
                <TabsTrigger value="faq" className="text-white data-[state=active]:bg-white/20">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-white data-[state=active]:bg-white/20">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Us
                </TabsTrigger>
                <TabsTrigger value="guides" className="text-white data-[state=active]:bg-white/20">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Guides
                </TabsTrigger>
              </TabsList>

              <TabsContent value="faq" className="space-y-6">
                {faqItems.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-white text-shadow flex items-center gap-2">
                        <category.icon className="h-5 w-5" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.questions.map((item, index) => (
                        <div key={index} className="border-b border-white/20 last:border-b-0 pb-4 last:pb-0">
                          <h3 className="text-white font-medium mb-2">{item.q}</h3>
                          <p className="text-white/80 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactOptions.map((option, index) => (
                    <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl hover:scale-105 transition-transform duration-200">
                      <CardHeader>
                        <CardTitle className="text-white text-shadow flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <option.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {option.title}
                              {option.available && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                                  Available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80 mb-4">{option.description}</p>
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
                          {option.action}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-shadow">Support Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <h3 className="text-white font-medium">Live Chat</h3>
                        <p className="text-white/70 text-sm">24/7 Available</p>
                      </div>
                      <div className="text-center">
                        <Phone className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <h3 className="text-white font-medium">Phone Support</h3>
                        <p className="text-white/70 text-sm">Mon-Fri: 8AM-8PM EST</p>
                      </div>
                      <div className="text-center">
                        <Mail className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <h3 className="text-white font-medium">Email Support</h3>
                        <p className="text-white/70 text-sm">Response within 24h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guides" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Getting Started Guide",
                      description: "Learn the basics of using HOUSIE",
                      icon: BookOpen,
                      readTime: "5 min read",
                      popular: true
                    },
                    {
                      title: "Booking Your First Service",
                      description: "Step-by-step guide to booking services",
                      icon: CheckCircle,
                      readTime: "3 min read",
                      popular: true
                    },
                    {
                      title: "Provider Guidelines",
                      description: "How to become a service provider",
                      icon: Users,
                      readTime: "8 min read",
                      popular: false
                    },
                    {
                      title: "Safety & Security",
                      description: "Keeping yourself safe on the platform",
                      icon: Shield,
                      readTime: "6 min read",
                      popular: true
                    },
                    {
                      title: "Payment & Billing",
                      description: "Understanding payments and subscriptions",
                      icon: CreditCard,
                      readTime: "4 min read",
                      popular: false
                    },
                    {
                      title: "Account Settings",
                      description: "Managing your profile and preferences",
                      icon: Settings,
                      readTime: "7 min read",
                      popular: false
                    }
                  ].map((guide, index) => (
                    <Card key={index} className="bg-slate-800/60 border-slate-600/30 backdrop-blur-md shadow-xl hover:scale-105 transition-transform duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <guide.icon className="h-8 w-8 text-blue-400" />
                          {guide.popular && (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-white text-shadow">{guide.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80 mb-4">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">{guide.readTime}</span>
                          <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                            Read Guide
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
