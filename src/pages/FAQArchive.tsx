
import React from 'react';
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const FAQArchive = () => {
  const faqSections = [
    {
      title: "Getting Started",
      questions: [
        {
          question: "What is HOUSIE?",
          answer: "HOUSIE is Canada's trusted marketplace for home services that combines service booking with smart financial management. We help Canadians find reliable service providers while automatically tracking expenses and optimizing taxes."
        },
        {
          question: "How do I create an account?",
          answer: "Simply click 'Get Started' on our homepage and choose whether you're seeking services or providing them. You can always switch roles later. Complete your profile, verify your email, and you're ready to go!"
        },
        {
          question: "Can I be both a customer and a service provider?",
          answer: "Absolutely! HOUSIE allows seamless role switching. You can book services as a customer and offer your own services as a provider using the same account."
        }
      ]
    },
    {
      title: "Pricing & Fees",
      questions: [
        {
          question: "How does pricing work?",
          answer: "Service providers set their own rates (hourly or flat fee). You'll see the exact price before booking. HOUSIE charges a small platform fee (6% vs 15-30% on other platforms) that's automatically included in the total."
        },
        {
          question: "What is the HOUSIE fee?",
          answer: "HOUSIE charges only 6% platform fee - significantly lower than competitors who charge 15-30%. This fee covers payment processing, insurance, customer support, and our advanced fintech features."
        },
        {
          question: "Are there subscription plans?",
          answer: "Yes! We offer Free (basic features), Starter ($8/month), Pro ($15/month - most popular), and Premium ($25/month) plans. Each tier includes enhanced financial tracking and business tools. All plans include our core booking platform."
        },
        {
          question: "What's included in the subscription tiers?",
          answer: "Free: Basic booking + expense tracking. Starter: Advanced analytics + email support. Pro: Unlimited services + AI features + group booking. Premium: Everything + OCR scanning + white-glove support + market insights."
        }
      ]
    },
    {
      title: "Payments & Security",
      questions: [
        {
          question: "How do payments work?",
          answer: "All payments are processed securely through Stripe. Customers pay when booking, and providers receive payment after service completion. We hold funds in escrow for protection."
        },
        {
          question: "When do providers get paid?",
          answer: "Providers receive payment 24-48 hours after the customer marks the service as complete. This ensures quality and gives time for any issues to be resolved."
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept all major credit cards, debit cards, and bank transfers through our secure Stripe integration. Payment methods are saved for convenience on future bookings."
        },
        {
          question: "Is my financial information secure?",
          answer: "Yes! We use bank-level encryption and never store sensitive payment information. All transactions are processed through PCI-compliant systems. Your financial data is automatically categorized for tax purposes but remains completely private."
        }
      ]
    },
    {
      title: "For Service Providers",
      questions: [
        {
          question: "How do I become a provider?",
          answer: "Switch to provider mode, complete your business profile, add your services with descriptions and pricing, set your availability, and upload verification documents. Our team reviews applications within 24-48 hours."
        },
        {
          question: "What documents do I need to provide?",
          answer: "Basic requirements include government ID, business license (if applicable), insurance certificate, and banking information for payments. Additional certifications may be required for specialized services."
        },
        {
          question: "How do I set my pricing?",
          answer: "You can set hourly rates or flat fees for each service. Our AI provides market rate suggestions based on your location and service type. You can adjust prices anytime and offer seasonal promotions."
        },
        {
          question: "Can I manage my availability?",
          answer: "Yes! Use our calendar system to block unavailable times, set recurring schedules, and manage bookings. You can accept/decline requests and communicate directly with customers through our messaging system."
        }
      ]
    },
    {
      title: "Booking & Services",
      questions: [
        {
          question: "How do I book a service?",
          answer: "Search by location and service type, browse provider profiles and reviews, select your preferred provider, choose date/time, provide service details, and pay securely. You'll receive confirmation with provider contact info."
        },
        {
          question: "Can I cancel or reschedule a booking?",
          answer: "Yes, you can cancel or reschedule up to 24 hours before the service time without penalty. Last-minute cancellations may incur a small fee that goes to the provider for their time."
        },
        {
          question: "What if I'm not satisfied with the service?",
          answer: "Contact our support team immediately. We have a resolution process that includes refunds, service credits, or rebooking with another provider. Your satisfaction is guaranteed."
        },
        {
          question: "How do reviews work?",
          answer: "After each service, both customers and providers can leave reviews. This builds trust and helps maintain service quality. Reviews are verified and cannot be deleted once posted."
        }
      ]
    },
    {
      title: "Financial Features",
      questions: [
        {
          question: "How does expense tracking work?",
          answer: "All HOUSIE transactions are automatically categorized for tax purposes. Our AI learns your patterns and suggests business vs personal expense categories. Export reports anytime for your accountant."
        },
        {
          question: "What are group bookings?",
          answer: "Our AI identifies when multiple neighbors need similar services and coordinates group bookings for volume discounts. Everyone saves money and providers get multiple jobs efficiently."
        },
        {
          question: "Is HOUSIE CRA compliant?",
          answer: "Yes! All our financial tracking features are designed for Canadian tax compliance. We generate reports that work with popular accounting software and provide documentation for CRA audits."
        }
      ]
    },
    {
      title: "Account Management",
      questions: [
        {
          question: "How do I change my subscription plan?",
          answer: "Go to your account settings and select 'Subscription'. You can upgrade or downgrade anytime. Upgrades take effect immediately, downgrades at the next billing cycle."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account anytime from settings. Note that this removes all data permanently. If you have active bookings, please complete them first or contact support."
        },
        {
          question: "How do I contact customer support?",
          answer: "Use our in-app chat assistant, email support@housie.ca, or call our support line. Pro and Premium subscribers get priority support with faster response times."
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Badge className="fintech-button-primary px-6 py-3 text-sm font-bold mb-6 rounded-2xl">
              🤔 FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Got Questions? <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">We've Got Answers</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about HOUSIE - from getting started to advanced features. 
              Can't find what you're looking for? Contact our support team!
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqSections.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="fintech-card">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
                    <div className="w-12 h-12 fintech-button-primary text-white rounded-2xl flex items-center justify-center text-lg font-bold">
                      {sectionIndex + 1}
                    </div>
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-lg mt-2">
                    Common questions about {section.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((faq, questionIndex) => (
                      <AccordionItem key={questionIndex} value={`${sectionIndex}-${questionIndex}`} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <AccordionTrigger className="text-left font-semibold text-gray-800 dark:text-white hover:text-blue-600 py-6 text-lg hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed text-base pb-6">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support Section */}
          <Card className="fintech-gradient-card bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white mt-12">
            <CardContent className="text-center py-12 px-8">
              <h3 className="text-3xl font-bold mb-6">Still have questions?</h3>
              <p className="text-xl mb-8 opacity-90">
                Our friendly support team is here to help you get the most out of HOUSIE.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-base">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                  📧 support@housie.ca
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                  💬 In-app chat assistant
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                  📞 1-800-HOUSIE-1
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FAQArchive;
