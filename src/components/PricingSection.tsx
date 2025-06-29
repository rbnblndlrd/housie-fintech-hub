
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0",
      period: "pour toujours",
      description: "Parfait pour commencer",
      icon: <Star className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#faf7f2",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        "Jusqu'à 3 types de services",
        "Suivi des dépenses basique", 
        "5 réservations par mois",
        "Support par email",
        "Conformité CRA de base"
      ]
    },
    {
      name: "Starter",
      price: "8",
      period: "/mois",
      description: "Pour les entrepreneurs actifs",
      icon: <Zap className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#faf7f2",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      features: [
        "Jusqu'à 8 types de services",
        "Analytiques avancées",
        "Réservations illimitées",
        "Assistant IA basique",
        "Optimisation fiscale",
        "Support prioritaire"
      ]
    },
    {
      name: "Pro",
      price: "15",
      period: "/mois",
      description: "Notre plan le plus populaire",
      icon: <Crown className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#faf7f2",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: true,
      features: [
        "Services illimités",
        "Réservations groupées",
        "IA avancée + automation",
        "Rapports fiscaux détaillés",
        "Intégration bancaire",
        "Support téléphonique",
        "Widgets personnalisés"
      ]
    },
    {
      name: "Premium",
      price: "25",
      period: "/mois",
      description: "Pour les pros qui veulent tout",
      icon: <Crown className="h-6 w-6" />,
      color: "border-black",
      bgColor: "#faf7f2",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      features: [
        "Tout dans Pro +",
        "Scanner OCR de factures",
        "Parky AI vérificateur",
        "Support white-glove",
        "Insights marché avancés",
        "API access",
        "Manager dédié"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block backdrop-blur-sm rounded-xl px-8 py-6 border-3 border-black shadow-lg mb-6" style={{ backgroundColor: '#faf7f2' }}>
            <Badge className="bg-orange-600 text-white px-4 py-2 text-sm font-bold mb-4 rounded-xl border-2 border-black">
              💰 FRAIS RÉDUITS: 6% vs 15-30% ailleurs
            </Badge>
            <h2 className="text-5xl font-black text-black mb-6">
              Tarifs <span className="text-orange-600">Transparents</span>
              <br />Sans Surprise
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
              Choisissez le plan qui correspond à vos besoins. 
              Tous les plans incluent notre garantie de conformité CRA et nos outils fintech.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border-3 border-black rounded-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${
                plan.popular ? 'ring-4 ring-purple-600 shadow-2xl' : ''
              }`}
              style={{ backgroundColor: plan.bgColor }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-2 text-sm font-bold">
                  ⭐ PLUS POPULAIRE
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="mx-auto mb-4 p-3 rounded-2xl w-fit shadow-lg border-2 border-black" style={{ backgroundColor: '#faf7f2' }}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-black text-black">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-800 font-medium">
                  {plan.description}
                </CardDescription>
                <div className="py-4">
                  <div className="text-4xl font-black text-black">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-800">
                      {plan.period}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Button className={`w-full ${plan.buttonColor} text-white font-bold py-3 rounded-xl mb-6 shadow-lg border-2 border-black`}>
                  {plan.name === "Gratuit" ? "COMMENCER GRATUIT" : "CHOISIR CE PLAN"}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-black text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
