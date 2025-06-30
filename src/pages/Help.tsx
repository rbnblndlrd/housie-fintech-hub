
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  BookOpen, 
  Search,
  Clock,
  MapPin,
  CreditCard,
  Shield,
  Users
} from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();

  const helpCategories = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Getting Started",
      description: "Learn the basics of using HOUSIE",
      topics: ["Creating an account", "Booking your first service", "Provider verification"]
    },
    {
      icon: <Search className="h-8 w-8 text-green-600" />,
      title: "Finding Services",
      description: "How to search and book services",
      topics: ["Service categories", "Location-based search", "Provider ratings"]
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: "Payments & Billing",
      description: "Payment methods and billing information",
      topics: ["Payment options", "Invoice management", "Quebec tax compliance"]
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Safety & Privacy",
      description: "Your security and privacy protection",
      topics: ["Privacy-first mapping", "Data protection", "Safety measures"]
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "For Providers",
      description: "Information for service providers",
      topics: ["RBQ/CCQ verification", "Setting up services", "Managing bookings"]
    },
    {
      icon: <MapPin className="h-8 w-8 text-orange-600" />,
      title: "Location Services",
      description: "GPS tracking and location features",
      topics: ["Real-time tracking", "Route optimization", "Emergency services"]
    }
  ];

  const contactOptions = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Speak directly with a support representative",
      availability: "Mon-Fri 8AM-8PM EST",
      action: "Call Now"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Send us detailed questions or feedback",
      availability: "Response within 24 hours",
      action: "Send Email"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
              How Can We Help You?
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg max-w-3xl mx-auto">
              Find answers to common questions, learn about features, or get in touch with our support team.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactOptions.map((option, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      {option.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {option.availability}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <Button className="w-full">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-8 text-center">
              Browse Help Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index} className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-50 rounded-xl">
                        {category.icon}
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {topic}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Articles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    How does HOUSIE protect my privacy?
                  </h3>
                  <p className="text-gray-600">
                    We use Mapbox instead of Google Maps to ensure your location data stays private. 
                    We also implement strict data protection measures and never share your personal information.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Are all service providers verified?
                  </h3>
                  <p className="text-gray-600">
                    Yes! All our service providers are verified through RBQ (Régie du bâtiment du Québec) 
                    and CCQ (Commission de la construction du Québec) when applicable.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    How do I track my service provider?
                  </h3>
                  <p className="text-gray-600">
                    Once your service is confirmed, you'll receive real-time GPS tracking of your provider's 
                    location and estimated arrival time through our privacy-first mapping system.
                  </p>
                </div>

                <div className="pb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600">
                    We accept all major credit cards, debit cards, and digital payments. 
                    All transactions are Quebec tax compliant with automatic GST/QST calculation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
