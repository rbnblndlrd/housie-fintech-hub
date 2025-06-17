
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
      color: "border-gray-200",
      bgColor: "bg-white",
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
      color: "border-orange-300",
      bgColor: "bg-orange-50",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
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
      color: "border-purple-400",
      bgColor: "bg-purple-50",
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
      color: "border-cyan-400",
      bgColor: "bg-cyan-50",
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
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-bold mb-4">
            💰 FRAIS RÉDUITS: 6% vs 15-30% ailleurs
          </Badge>
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            Tarifs <span className="text-orange-500">Transparents</span>
            <br />Sans Surprise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choisissez le plan qui correspond à vos besoins. 
            Tous les plans incluent notre garantie de conformité CRA et nos outils fintech.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`${plan.bgColor} ${plan.color} border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-purple-400 ring-offset-2' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-bold">
                  ⭐ PLUS POPULAIRE
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="mx-auto mb-4 p-3 bg-white rounded-2xl w-fit shadow-lg">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-black text-gray-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  {plan.description}
                </CardDescription>
                <div className="py-4">
                  <div className="text-4xl font-black text-gray-900">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-600">
                      {plan.period}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Button className={`w-full ${plan.buttonColor} text-white font-bold py-3 rounded-xl mb-6 shadow-lg`}>
                  {plan.name === "Gratuit" ? "COMMENCER GRATUIT" : "CHOISIR CE PLAN"}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black mb-4">
              🎯 Garantie de Revenus Augmentés
            </h3>
            <p className="text-lg leading-relaxed mb-6">
              Nos clients Pro et Premium voient leurs revenus augmenter de 40% en moyenne 
              grâce à nos outils d'optimisation IA et nos réservations groupées. 
              Garantie 30 jours ou remboursé!
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Conformité CRA 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Essai gratuit 14 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Annulation à tout moment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
