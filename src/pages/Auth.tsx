
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/Header";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState("seeker");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-orange-200">
      <Header />
      
      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Bienvenue sur HOUSIE</h1>
            <p className="text-gray-600">
              Connectez-vous à votre compte HOUSIE instantané
            </p>
            <p className="text-sm text-purple-600 mt-2">
              Nouveau sur HOUSIE ? 
              <button 
                className="underline ml-1 font-medium"
                onClick={() => setIsLogin(false)}
              >
                Visitez notre page d'accueil
              </button> 
              pour commencer.
            </p>
          </div>

          {/* Auth Card */}
          <Card className="bg-white border-2 border-cyan-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black">
                {isLogin ? "Connexion" : "Créer un compte"}
              </CardTitle>
              <CardDescription>
                {isLogin ? "Accédez à votre compte HOUSIE" : "Rejoignez la communauté HOUSIE"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Role Selection for Signup */}
              {!isLogin && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Je souhaite :</Label>
                  <RadioGroup value={userType} onValueChange={setUserType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seeker" id="seeker" />
                      <Label htmlFor="seeker">Trouver des services</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="provider" id="provider" />
                      <Label htmlFor="provider">Offrir mes services</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Les deux</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Se souvenir de moi
                    </Label>
                  </div>
                  <button className="text-sm text-purple-600 hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                size="lg"
              >
                {isLogin ? "Se connecter" : "Créer mon compte"}
              </Button>

              {/* Toggle Auth Mode */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"} 
                  <button 
                    className="text-purple-600 hover:underline ml-1 font-medium"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Commencer avec HOUSIE" : "Se connecter"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
