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
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthAction = async (type: "signIn" | "signUp") => {
    try {
      if (type === "signIn") {
        await signIn(email, password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur HOUSIE!",
        });
        navigate('/dashboard');
      } else {
        await signUp(email, password);
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
        navigate('/welcome');
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'authentification",
        description: error.message || "Impossible de se connecter. Veuillez vérifier vos informations.",
        variant: "destructive",
      });
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
