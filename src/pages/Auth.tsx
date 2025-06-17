import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, User, Users, Building } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("freelancer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simple test function to check basic functionality
  const handleTestButton = () => {
    console.log('🧪 Test button clicked!');
    console.log('📧 Email state:', email);
    console.log('🔐 Password state:', password);
    console.log('📱 Active tab:', activeTab);
    console.log('⚙️ Loading state:', isLoading);
    
    toast({
      title: "Test successful!",
      description: "Basic functionality is working. Check console for details.",
    });
  };

  const handleAuthAction = async (type: "signIn" | "signUp") => {
    console.log('🎬 handleAuthAction called with type:', type);
    console.log('📧 Email:', email);
    console.log('🔐 Password length:', password.length);
    
    if (!email || !password) {
      console.log('⚠️ Missing required fields');
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    console.log('🚦 Starting auth process...');
    setIsLoading(true);
    try {
      if (type === "signIn") {
        console.log('🔑 Attempting sign in...');
        await signIn(email, password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur HOUSIE!",
        });
        navigate('/dashboard');
      } else {
        console.log('📝 Attempting sign up...');
        await signUp(email, password);
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès! Vous pouvez maintenant utiliser l'application.",
        });
        navigate('/welcome');
      }
    } catch (error: any) {
      console.error('💥 Auth action failed:', error);
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "Un compte existe déjà avec cet email.";
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Veuillez entrer une adresse email valide.";
      }

      toast({
        title: "Erreur d'authentification",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 Auth process completed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-dark-primary dark:via-dark-secondary dark:to-darker">
      <Header />

      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <Card className="max-w-md w-full bg-white dark:bg-dark-secondary border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-dark-text">
              {activeTab === "freelancer" ? "Espace Freelancer" : "Espace Client"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-dark-text-muted">
              Connectez-vous ou créez un compte pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {/* Debug Test Button */}
            <div className="mb-4">
              <Button 
                onClick={handleTestButton}
                variant="outline"
                className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                🧪 Test Basic Functionality
              </Button>
            </div>
            
            <Tabs defaultValue="freelancer" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="freelancer" className="text-gray-700 dark:text-dark-text-secondary data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-dark-accent">
                  <Users className="h-4 w-4 mr-2" />
                  Freelancer
                </TabsTrigger>
                <TabsTrigger value="client" className="text-gray-700 dark:text-dark-text-secondary data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-dark-accent">
                  <Building className="h-4 w-4 mr-2" />
                  Client
                </TabsTrigger>
              </TabsList>
              <TabsContent value="freelancer" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-dark-text">
                    Adresse Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="exemple@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-dark-text">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text pr-10"
                      disabled={isLoading}
                    />
                    <Button
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
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3" 
                  onClick={() => handleAuthAction("signIn")}
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-gray-700 dark:text-dark-text-secondary" 
                  onClick={() => handleAuthAction("signUp")}
                  disabled={isLoading}
                >
                  {isLoading ? "Création..." : "Créer un compte"}
                </Button>
              </TabsContent>
              <TabsContent value="client" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="emailClient" className="text-gray-700 dark:text-dark-text">
                    Adresse Email
                  </Label>
                  <Input
                    id="emailClient"
                    placeholder="exemple@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordClient" className="text-gray-700 dark:text-dark-text">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="passwordClient"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">Afficher le mot de passe</span>
                    </Button>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3" onClick={() => handleAuthAction("signIn")}>
                  Se connecter
                </Button>
                <Button variant="outline" className="w-full text-gray-700 dark:text-dark-text-secondary" onClick={() => handleAuthAction("signUp")}>
                  Créer un compte
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
