
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez entrer votre email et mot de passe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur HOUSIE!",
      });
      navigate('/customer-dashboard');
    } catch (error: any) {
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      } else if (error.message?.includes('too_many_requests')) {
        errorMessage = "Trop de tentatives. Veuillez attendre quelques minutes.";
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen fintech-hero-gradient">
      <Header />

      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <Card className="max-w-md w-full fintech-card shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
              Connexion
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Connectez-vous à votre compte HOUSIE
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Adresse Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="votre@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 fintech-input"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Mot de passe
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="fintech-input pr-10"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">Afficher le mot de passe</span>
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full fintech-button-primary" 
                disabled={isLoading}
              >
                {isLoading ? (
                  "Connexion..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>

              <div className="text-center space-y-4">
                <Link 
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                >
                  Mot de passe oublié?
                </Link>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Pas encore de compte?
                  </p>
                  <Link to="/onboarding">
                    <Button 
                      variant="outline" 
                      className="w-full fintech-button-secondary"
                      type="button"
                    >
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
