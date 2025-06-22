
import React from 'react';
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, HelpCircle, BookOpen, CreditCard, Shield, Settings, Users, Star } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      icon: <HelpCircle className="h-8 w-8 text-blue-600" />,
      title: "Getting Started",
      description: "New to HOUSIE? Start here",
      questions: [
        "How do I create an account?",
        "What is HOUSIE?",
        "How do I book my first service?"
      ]
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Booking & Scheduling",
      description: "Everything about bookings",
      questions: [
        "How to book a service?",
        "Can I reschedule?",
        "Group booking discounts"
      ]
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: "Payment & Billing",
      description: "Payments and pricing info",
      questions: [
        "Payment methods accepted",
        "HOUSIE fees explained",
        "Subscription plans"
      ]
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      title: "Service Issues",
      description: "Problems with services",
      questions: [
        "Service quality concerns",
        "Refund policy",
        "Provider disputes"
      ]
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Reviews & Ratings",
      description: "Rating system help",
      questions: [
        "How reviews work",
        "Editing my review",
        "Provider ratings"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-cyan-600" />,
      title: "Legal & Compliance",
      description: "CRA compliance & legal",
      questions: [
        "CRA compliance help",
        "Tax documentation",
        "Data protection"
      ]
    }
  ];

  const quickActions = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Get instant help",
      action: "Start Chat"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "support@housie.ca",
      action: "Send Email"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "1-800-HOUSIE-1",
      action: "Call Now"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge className="fintech-button-primary px-6 py-3 text-sm font-bold mb-6 rounded-2xl">
              ❓ SUPPORT CENTER
            </Badge>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Comment pouvons-nous <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">vous aider</span> ?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Nous sommes là pour vous aider à tirer le meilleur parti de Housie. Recherchez dans notre FAQ ou contactez notre équipe de support.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="fintech-card p-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                  <input
                    type="text"
                    placeholder="Rechercher des articles d'aide, guides et réponses..."
                    className="flex-1 bg-transparent border-0 focus:outline-none text-lg font-medium text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <Button className="fintech-button-primary px-6 py-2 rounded-xl font-bold">
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {quickActions.map((action, index) => (
              <Card key={index} className="fintech-card hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 fintech-button-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>
                  <Button variant="outline" className="rounded-xl font-medium border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Categories Mega Menu */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Catégories d'Aide
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {faqCategories.map((category, index) => (
                <Card key={index} className="fintech-card hover:-translate-y-2 cursor-pointer group">
                  <CardHeader className="p-8">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <ul className="space-y-2">
                      {category.questions.map((question, qIndex) => (
                        <li key={qIndex} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200">
                          • {question}
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-medium">
                      Voir tous les articles →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Support Section */}
          <Card className="fintech-gradient-card bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white">
            <CardContent className="text-center py-16 px-8">
              <h3 className="text-4xl font-bold mb-6">Une question ? Une suggestion ?</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                N'hésitez pas à nous contacter ! Notre équipe est disponible du lundi au vendredi de 9h à 18h.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/20 font-bold text-white text-lg">
                  💬 Chat en Direct
                </Button>
                <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/20 font-bold text-white text-lg">
                  📧 Nous Contacter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FAQ;
