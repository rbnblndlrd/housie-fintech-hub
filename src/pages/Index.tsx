
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, MessageCircle, BarChart3, Shield, Clock, DollarSign, Users, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ChatAssistant } from "@/components/ChatAssistant";
import { PricingSection } from "@/components/PricingSection";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");

  const valueProps = [
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: "Conformité CRA Garantie",
      description: "Tous nos professionnels sont vérifiés et conformes aux exigences de l'Agence du revenu du Canada. Travaillez en toute tranquillité d'esprit."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Outils Fintech Intégrés",
      description: "Suivi automatique des dépenses, optimisation fiscale et rapports détaillés pour maximiser vos déductions d'affaires."
    },
    {
      icon: <Users className="h-8 w-8 text-cyan-500" />,
      title: "Réservations Groupées",
      description: "Économisez jusqu'à 30% en vous regroupant avec vos voisins pour des services similaires. L'IA coordonne automatiquement."
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Assistant IA Personnel",
      description: "Notre assistant IA optimise vos horaires, trouve les meilleures opportunités d'économies et gère vos finances d'entreprise."
    }
  ];

  const serviceCategories = [
    { name: "Ménage Résidentiel", icon: "🏠", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    { name: "Entretien Paysager", icon: "🌿", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { name: "Construction & Réno", icon: "🔨", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { name: "Soins Personnels", icon: "💆‍♀️", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
    { name: "Soins d'Animaux", icon: "🐕", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" }
  ];

  const trustIndicators = [
    "Plus de 10,000 services complétés",
    "4.9/5 étoiles de satisfaction",
    "Assurance responsabilité incluse",
    "Paiements sécurisés par Stripe"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Pop Art Style */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-24 h-24 bg-purple-500/20 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-40 left-10 w-16 h-16 bg-cyan-400/20 rounded-full opacity-40"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 text-sm font-medium border-0">
                    🚀 NOUVEAU: IA Fintech pour Entrepreneurs
                  </Badge>
                </div>
                
                <h1 className="text-6xl font-black text-gray-900 dark:text-dark-text leading-tight">
                  Le <span className="housie-text-gradient">Facebook</span><br />
                  des Services<br />
                  <span className="text-purple-600">au Canada</span>
                </h1>
                
                <p className="text-xl text-gray-700 dark:text-dark-text-secondary leading-relaxed max-w-lg">
                  La première plateforme fintech qui connecte 2.9M d'entrepreneurs 
                  canadiens avec des outils d'IA pour optimiser leurs finances et 
                  développer leur clientèle.
                </p>
              </div>

              {/* Search Bar */}
              <div className="housie-card p-3 max-w-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-orange-500 ml-2" />
                  <Input
                    placeholder="Montréal, Toronto, Vancouver..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-lg font-medium dark:text-dark-text"
                  />
                  <Link to="/services">
                    <Button className="housie-button-secondary rounded-xl px-8 py-3 font-bold text-white shadow-lg">
                      CHERCHER
                      <Search className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-text-muted">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Assistant Preview */}
            <div className="relative">
              <div className="housie-card bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 text-white relative overflow-hidden shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 bg-white/20 rounded-full p-3">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-orange-400/30 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-400/20 rounded-full"></div>
                
                <div className="space-y-6 mb-8 relative z-10">
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center housie-mascot-glow">
                        <img 
                          src="/lovable-uploads/ceb92e4c-4980-45ea-945a-eff3e55c13d8.png" 
                          alt="HOUSIE Assistant" 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg mb-2">Assistant HOUSIE IA</p>
                        <p className="text-white/90 text-sm leading-relaxed">
                          "Bonjour! Je peux vous aider à optimiser vos finances d'entreprise, 
                          trouver des clients et gérer votre conformité CRA 2025. 
                          Prêt à économiser 40% sur vos coûts?"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to="/auth" className="flex-1">
                      <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg">
                        COMMENCER GRATUIT
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-bold">
                      DÉMO IA
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4 bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 dark:text-dark-text mb-4">Services Populaires</h2>
            <p className="text-xl text-gray-600 dark:text-dark-text-muted max-w-2xl mx-auto">
              Plus de 50 catégories de services avec des professionnels vérifiés dans toutes les provinces canadiennes
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="housie-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 dark:hover:border-orange-500">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-dark-text">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className={`${category.color} text-sm font-medium`}>
                    Disponible 24/7
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions with Pop Art Style */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-50/80 to-purple-50/80 dark:from-dark-accent/80 dark:to-dark-primary/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 dark:text-dark-text mb-6">
              Pourquoi <span className="housie-text-gradient">HOUSIE</span> Révolutionne 
              <br />le Travail Autonome au Canada ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-dark-text-muted max-w-3xl mx-auto leading-relaxed">
              La seule plateforme qui combine marketplace de services ET 
              outils fintech avancés pour maximiser vos revenus et simplifier vos finances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={index} className="housie-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100/50 to-purple-100/50 dark:from-orange-900/20 dark:to-purple-900/20 rounded-full -translate-y-6 translate-x-6"></div>
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="mx-auto mb-6 p-4 bg-gray-50/80 dark:bg-dark-accent/80 rounded-2xl w-fit backdrop-blur-sm">
                    {prop.icon}
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900 dark:text-dark-text leading-tight">
                    {prop.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-600 dark:text-dark-text-secondary leading-relaxed text-center">
                    {prop.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-900/95 dark:bg-black/95 text-white backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-orange-400 mb-2">2.9M</div>
              <div className="text-gray-300 dark:text-dark-text-muted">Travailleurs Autonomes Ciblés</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">$312M</div>
              <div className="text-gray-300 dark:text-dark-text-muted">Évaluation Projetée</div>
            </div>
            <div>
              <div className="text-4xl font-black text-cyan-400 mb-2">40%</div>
              <div className="text-gray-300 dark:text-dark-text-muted">Économies Moyennes</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-400 mb-2">6%</div>
              <div className="text-gray-300 dark:text-dark-text-muted">Frais vs 15-30% Ailleurs</div>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />
      <ChatAssistant />
    </div>
  );
};

export default Index;
