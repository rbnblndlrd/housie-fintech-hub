import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, MessageCircle, BarChart3, Shield, Clock, DollarSign, Users, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ChatAssistant } from "@/components/ChatAssistant";
import { PricingSection } from "@/components/PricingSection";
import { Link } from "react-router-dom";
import PopArtMascot from "@/components/PopArtMascot";

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Hero Section with Pop Art Style and Mascot */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden bg-gradient-to-br from-yellow-100 via-orange-50 to-purple-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-purple-900/20">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-24 h-24 bg-purple-500/20 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-40 left-10 w-16 h-16 bg-cyan-400/20 rounded-full opacity-40"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 text-sm font-medium border-0 rounded-2xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)]">
                    🚀 NOUVEAU: IA Fintech pour Entrepreneurs
                  </Badge>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                  Canada's Trusted<br />
                  <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    Marketplace for
                  </span><br />
                  <span className="text-purple-600">Home Services</span>
                </h1>
                
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg">
                  We connect you with verified, CRA-compliant professionals for 
                  cleaning, lawn care, and more across all Canadian provinces.
                </p>
              </div>

              {/* Search Bar */}
              <div className="fintech-card p-3 max-w-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-orange-500 ml-2" />
                  <Input
                    placeholder="Enter your city or postal code"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-lg font-medium dark:text-white"
                  />
                  <Link to="/services">
                    <Button className="fintech-button-primary rounded-xl px-8 py-3 font-bold text-white">
                      <Search className="h-5 w-5 mr-2" />
                      SEARCH
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>CRA compliance guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Verified professionals</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Liability insurance included</span>
                </div>
              </div>
            </div>

            {/* Mascot and Assistant Preview */}
            <div className="relative space-y-6">
              {/* HOUSIE Mascot with Pop Art Easter Egg */}
              <div className="fintech-gradient-card bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-400/20 rounded-full"></div>
                
                <div className="flex items-center justify-center mb-6">
                  <PopArtMascot />
                </div>

                <div className="text-center text-white">
                  <p className="text-base opacity-90 mb-3">Hello! I'm your HOUSIE assistant.</p>
                  <p className="font-bold text-xl mb-6">Ready to help with CRA 2025 compliance across Canada!</p>
                  
                  <div className="flex gap-2">
                    <Link to="/onboarding" className="flex-1">
                      <Button className="w-full fintech-button-secondary text-purple-600 font-bold px-8 py-4 rounded-xl text-lg">
                        GET STARTED
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pourquoi choisir HOUSIE section */}
              <div className="fintech-card p-6">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-4 text-center">
                  Pourquoi choisir HOUSIE ?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                  Nous sommes plus qu'une plateforme - nous sommes votre partenaire pour 
                  faire croître votre entreprise en toute simplicité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Services Populaires</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Plus de 50 catégories de services avec des professionnels vérifiés dans toutes les provinces canadiennes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="fintech-card text-center group">
                <CardHeader className="pb-4 pt-8">
                  <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">{category.icon}</div>
                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <Badge className={`${category.color} text-sm font-medium rounded-2xl px-4 py-2`}>
                    Disponible 24/7
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-6">
              Pourquoi <span className="housie-text-gradient">HOUSIE</span> Révolutionne 
              <br />le Travail Autonome au Canada ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              La seule plateforme qui combine marketplace de services ET 
              outils fintech avancés pour maximiser vos revenus et simplifier vos finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={index} className="fintech-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100/50 to-purple-100/50 dark:from-orange-900/20 dark:to-purple-900/20 rounded-full -translate-y-6 translate-x-6"></div>
                <CardHeader className="text-center pb-6 relative z-10 pt-8">
                  <div className="mx-auto mb-6 p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl w-fit backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    {prop.icon}
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                    {prop.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pb-8">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                    {prop.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900/95 dark:bg-black/95 text-white backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl font-black text-orange-400">2.9M</div>
              <div className="text-gray-300 text-lg">Travailleurs Autonomes Ciblés</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-black text-purple-400">$312M</div>
              <div className="text-gray-300 text-lg">Évaluation Projetée</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-black text-cyan-400">40%</div>
              <div className="text-gray-300 text-lg">Économies Moyennes</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-black text-green-400">6%</div>
              <div className="text-gray-300 text-lg">Frais vs 15-30% Ailleurs</div>
            </div>
          </div>
        </div>
      </section>

      <div id="pricing-section">
        <PricingSection />
      </div>
      <ChatAssistant />
    </div>
  );
};

export default Index;
