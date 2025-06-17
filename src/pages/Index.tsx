
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, MessageCircle, BarChart3, Shield, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ChatAssistant } from "@/components/ChatAssistant";
import { PricingSection } from "@/components/PricingSection";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");

  const valueProps = [
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Taxes gérées pour vous, automatiquement",
      description: "Concentrez-vous sur le ménage, pas sur la paperasse. Nous gérons le suivi et les déclarations pour vous maintenir conforme à l'ARC sans stress."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Gardez plus de ce que vous gagnez",
      description: "Nos outils vous aident à suivre les dépenses et maximiser les déductions, remettant plus d'argent dans votre poche."
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "Trouvez plus de clients, instantanément",
      description: "Accédez à un flux constant de clients locaux cherchant des professionnels de services bien notés."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-purple-600" />,
      title: "Travaillez avec confiance et tranquillité d'esprit",
      description: "Avec les options d'assurance intégrées et des clients vérifiés, vous pouvez vous concentrer sur votre travail en sachant que vous êtes protégé."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-orange-200">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-black leading-tight">
                  Canada's Trusted<br />
                  Marketplace for<br />
                  <span className="text-purple-600">Home Services</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  We connect you with verified, CRA-compliant professionals for
                  cleaning, lawn care, and more across all Canadian provinces.
                </p>
              </div>

              <div className="bg-white rounded-full p-2 shadow-lg max-w-md">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400 ml-4" />
                  <Input
                    placeholder="Enter your city or postal code"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-lg"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 rounded-full px-6">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>CRA compliance guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Verified professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Secure payment</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white/20 rounded-full p-2">
                  <MessageCircle className="h-6 w-6" />
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">👋</span>
                      </div>
                      <div>
                        <p className="font-medium">Hello! I'm your HOUSIE assistant.</p>
                        <p className="text-sm text-white/80">Ready to help with CRA 2025 compliance across Canada.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-8 py-3 rounded-xl">
                  GET STARTED
                </Button>

                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-400 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Pourquoi choisir HOUSIE ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous sommes plus qu'une plateforme - nous sommes votre partenaire pour
              faire croître votre entreprise de ménage en toute simplicité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-purple-50 rounded-full w-fit">
                    {prop.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-black leading-tight">
                    {prop.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">
                    {prop.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
      <ChatAssistant />
    </div>
  );
};

export default Index;
