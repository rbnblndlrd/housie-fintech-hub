
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, ArrowRight, MapPin, Heart, Bell, UserCircle, Truck, Wrench } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

export const Welcome = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  const handleBrowseServices = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/services');
    }, 300);
  };

  const handleCompleteProfile = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/profile-setup');
    }, 300);
  };

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
  };

  const getOnboardingIcon = () => {
    if (selectedUserType === 'fleet') {
      return <Truck className="h-8 w-8 text-amber-600" />;
    } else if (selectedUserType === 'provider') {
      return <Wrench className="h-8 w-8 text-green-600" />;
    } else if (selectedUserType === 'customer') {
      return <Search className="h-8 w-8 text-purple-600" />;
    }
    return <User className="h-8 w-8 text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4">
                {selectedUserType ? getOnboardingIcon() : 'H'}
              </div>
            </div>
            <h1 className="autumn-title text-4xl font-black mb-4">
              Bienvenue sur <span className="text-orange-500">HOUSIE</span>!
            </h1>
            <p className="autumn-text text-xl max-w-2xl mx-auto">
              Choisissez comment vous souhaitez commencer votre expérience
            </p>
          </div>

          {/* User Type Selection */}
          {!selectedUserType && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover-lift"
                onClick={() => handleUserTypeSelect('fleet')}
              >
                <CardHeader className="text-center">
                  <Truck className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold">Fleet Manager</CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover-lift"
                onClick={() => handleUserTypeSelect('provider')}
              >
                <CardHeader className="text-center">
                  <Wrench className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold">Service Provider</CardTitle>
                </CardHeader>
              </Card>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover-lift"
                onClick={() => handleUserTypeSelect('customer')}
              >
                <CardHeader className="text-center">
                  <Search className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold">Customer</CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Choice Cards */}
          {selectedUserType && (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Browse Services Option */}
              <Card 
                className={`cursor-pointer hover-lift ${isAnimating ? 'animate-pulse' : ''}`}
                onClick={handleBrowseServices}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-6 p-6 rounded-2xl w-fit autumn-card-secondary">
                    <Search className="h-12 w-12 text-orange-500" />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2">
                    🔍 Commencer l'Exploration
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Parcourez les services et prestataires dans votre région immédiatement
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 autumn-text">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Accès instantané à tous les services</span>
                    </div>
                    <div className="flex items-center gap-3 autumn-text">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Voir les prestataires près de chez vous</span>
                    </div>
                    <div className="flex items-center gap-3 autumn-text">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Comparer prix et évaluations</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 text-lg rounded-xl">
                    Explorer Maintenant
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Complete Profile Option */}
              <Card 
                className={`cursor-pointer hover-lift ${isAnimating ? 'animate-pulse' : ''}`}
                onClick={handleCompleteProfile}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-6 p-6 rounded-2xl w-fit autumn-card-secondary">
                    {getOnboardingIcon()}
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2">
                    ⚡ Personnaliser l'Expérience
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Configuration rapide pour de meilleures correspondances (2 minutes)
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm autumn-text">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span>Préférences géographiques</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm autumn-text">
                      <Heart className="h-4 w-4 text-purple-500" />
                      <span>Services d'intérêt</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm autumn-text">
                      <UserCircle className="h-4 w-4 text-purple-500" />
                      <span>Informations de base</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm autumn-text">
                      <Bell className="h-4 w-4 text-purple-500" />
                      <span>Notifications</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 text-lg rounded-xl">
                    Configurer mon Profil
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Skip Option */}
          <div className="text-center mt-8">
            <p className="autumn-text mb-4">
              Vous pourrez toujours personnaliser votre profil plus tard
            </p>
            <Link to="/services">
              <Button variant="ghost" className="autumn-text hover:text-foreground">
                Passer cette étape →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;