
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, ArrowRight, MapPin, Heart, Bell, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

export const Welcome = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4">
                H
              </div>
            </div>
            <h1 className="text-4xl font-black text-foreground mb-4">
              Bienvenue sur <span className="text-orange-500">HOUSIE</span>!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choisissez comment vous souhaitez commencer votre expérience
            </p>
          </div>

          {/* Choice Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Browse Services Option */}
            <Card 
              className={`cursor-pointer ${isAnimating ? 'animate-pulse' : ''}`}
              onClick={handleBrowseServices}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl w-fit">
                  <Search className="h-12 w-12 text-orange-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
                  🔍 Commencer l'Exploration
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Parcourez les services et prestataires dans votre région immédiatement
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-card-foreground">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Accès instantané à tous les services</span>
                  </div>
                  <div className="flex items-center gap-3 text-card-foreground">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Voir les prestataires près de chez vous</span>
                  </div>
                  <div className="flex items-center gap-3 text-card-foreground">
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
              className={`cursor-pointer ${isAnimating ? 'animate-pulse' : ''}`}
              onClick={handleCompleteProfile}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl w-fit">
                  <User className="h-12 w-12 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
                  ⚡ Personnaliser l'Expérience
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Configuration rapide pour de meilleures correspondances (2 minutes)
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-card-foreground">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span>Préférences géographiques</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-card-foreground">
                    <Heart className="h-4 w-4 text-purple-500" />
                    <span>Services d'intérêt</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-card-foreground">
                    <UserCircle className="h-4 w-4 text-purple-500" />
                    <span>Informations de base</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-card-foreground">
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

          {/* Skip Option */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Vous pourrez toujours personnaliser votre profil plus tard
            </p>
            <Link to="/services">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
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
