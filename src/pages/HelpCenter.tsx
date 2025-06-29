
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I book a service?",
      answer: "Simply browse our services, select the one you need, choose your preferred provider, and book directly through our platform. You'll receive instant confirmation and can track your service provider in real-time."
    },
    {
      question: "Are all providers verified?",
      answer: "Yes! All our providers go through a rigorous verification process including RBQ/CCQ license checks, background verification, and professional credential validation specific to Quebec regulations."
    },
    {
      question: "How does payment work?",
      answer: "Payment is secure and processed through our platform. You only pay after the service is completed to your satisfaction. We support all major payment methods and provide transparent pricing with no hidden fees."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "Your satisfaction is our priority. If you're not happy with the service, contact our support team within 24 hours. We'll work with you and the provider to resolve any issues or provide a refund if necessary."
    },
    {
      question: "How do you protect my privacy?",
      answer: "We use Mapbox instead of Google Maps to protect your location data. Your personal information is encrypted and never shared with third parties without your explicit consent."
    },
    {
      question: "Can I track my service provider?",
      answer: "Yes! Once your booking is accepted, you can track your provider's location in real-time through our GPS tracking system. You'll know exactly when they're arriving."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="fintech-card text-center">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Get instant help</p>
                <Button size="sm" className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="fintech-card text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-4">Mon-Fri 9AM-6PM</p>
                <Button size="sm" variant="outline" className="w-full">Call Now</Button>
              </CardContent>
            </Card>

            <Card className="fintech-card text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">24-48 hour response</p>
                <Button size="sm" variant="outline" className="w-full">Send Email</Button>
              </CardContent>
            </Card>

            <Card className="fintech-card text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Montreal Office</h3>
                <p className="text-sm text-gray-600 mb-4">Visit us in person</p>
                <Button size="sm" variant="outline" className="w-full">Get Directions</Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
