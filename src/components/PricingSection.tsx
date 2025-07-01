
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Gratuit",
      price: "$0",
      period: "pour toujours",
      description: "Parfait pour commencer",
      icon: <Star className="h-8 w-8 text-gray-600" />,
      features: [
        "Jusqu'à 3 types de services",
        "Suivi des dépenses basique",
        "5 réservations par mois",
        "Support par email",
        "Conformité CRA de base"
      ],
      buttonText: "COMMENCER GRATUIT",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      id: "starter",
      name: "Starter",
      price: "$8",
      period: "/mois",
      description: "Pour les entrepreneurs actifs",
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      features: [
        "Jusqu'à 8 types de services",
        "Analytiques avancées",
        "Réservations illimitées",
        "Assistant IA basique",
        "Optimisation fiscale",
        "Support prioritaire"
      ],
      buttonText: "CHOISIR CE PLAN",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "$15",
      period: "/mois",
      description: "Notre plan le plus populaire",
      icon: <Crown className="h-8 w-8 text-purple-600" />,
      features: [
        "Services illimités",
        "Réservations groupées",
        "IA avancée + automation",
        "Rapports fiscaux détaillés",
        "Intégration bancaire",
        "Support téléphonique",
        "Widgets personnalisés"
      ],
      buttonText: "CHOISIR CE PLAN",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      id: "premium",
      name: "Premium",
      price: "$25",
      period: "/mois",
      description: "Pour les pros qui veulent tout",
      icon: <Gift className="h-8 w-8 text-blue-600" />,
      features: [
        "Tout dans Pro +",
        "Scanner OCR de factures",
        "Parky AI vérificateur",
        "Support white-glove",
        "Insights marché avancés",
        "API access",
        "Manager dédié"
      ],
      buttonText: "CHOISIR CE PLAN",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing-section" className="py-16 lg:py-24 px-2 sm:px-4 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-block winchester-header-bg backdrop-blur-sm rounded-3xl px-8 lg:px-12 py-6 lg:py-8 shadow-2xl relative">
            <div className="winchester-badge-bg rounded-full px-6 py-2 text-sm font-bold mb-4 inline-block">
              🔥 FRAIS RÉDUITS: 6% vs 15-30% ailleurs
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Tarifs <span className="text-orange-400">Transparents</span>
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-6">
              Sans Surprise
            </h3>
            <p className="text-lg sm:text-xl text-white/90 font-medium max-w-4xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Tous les plans incluent notre
              garantie de conformité CRA et nos outils fintech.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`fintech-card cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm relative ${
                plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
              } ${selectedPlan === plan.id ? 'ring-4 ring-orange-500' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="winchester-badge-bg px-4 py-1 text-sm font-bold">
                    ⭐ PLUS POPULAIRE
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto mb-4 p-4 fintech-card-secondary rounded-2xl w-fit shadow-lg">
                  {plan.icon}
                </div>
                <CardTitle className="text-xl lg:text-2xl font-black text-black mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-800 font-medium mb-4">
                  {plan.description}
                </CardDescription>
                <div className="mb-4">
                  <span className="text-3xl lg:text-4xl font-black text-black">{plan.price}</span>
                  <span className="text-gray-600 font-medium">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-black font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth">
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full font-bold py-3 text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 fintech-card ${
                      plan.buttonVariant === 'default' 
                        ? 'bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white' 
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    {plan.buttonText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="fintech-card backdrop-blur-sm px-8 py-6 rounded-2xl shadow-xl inline-block">
            <p className="text-black font-medium mb-4">
              Besoin d'aide pour choisir? Nos experts sont là pour vous guider.
            </p>
            <Link to="/help">
              <Button variant="outline" className="fintech-card text-black font-semibold hover:bg-gray-100">
                Contactez-nous →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
