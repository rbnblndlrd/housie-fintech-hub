
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Key } from "lucide-react";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        // Handle password reset
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`
        });
        
        if (error) throw error;
        
        toast({
          title: "Email envoyé",
          description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        });
        setIsForgotPassword(false);
      } else if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur HOUSIE!",
        });
        
        navigate('/dashboard');
      } else {
        // Handle registration
        if (password !== confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas");
        }
        
        if (password.length < 6) {
          throw new Error("Le mot de passe doit contenir au moins 6 caractères");
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              user_role: userType,
              can_provide: userType === "provider" || userType === "both",
              can_seek: userType === "seeker" || userType === "both"
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user && !data.session) {
          toast({
            title: "Vérifiez votre email",
            description: "Un lien de confirmation a été envoyé à votre adresse email.",
          });
        } else {
          toast({
            title: "Compte créé avec succès",
            description: "Bienvenue sur HOUSIE!",
          });
          
          // Redirect based on user type
          if (userType === "provider" || userType === "both") {
            navigate('/profile-setup');
          } else {
            navigate('/welcome');
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setUserType("seeker");
    setIsForgotPassword(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-accent">
      <Header />
      
      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-dark-text mb-2">
              {isForgotPassword ? "Mot de passe oublié" : "Bienvenue sur HOUSIE"}
            </h1>
            <p className="text-gray-600 dark:text-dark-text-muted">
              {isForgotPassword 
                ? "Entrez votre email pour réinitialiser votre mot de passe"
                : isLogin 
                  ? "Connectez-vous à votre compte HOUSIE"
                  : "Rejoignez la communauté HOUSIE"
              }
            </p>
            {!isForgotPassword && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                {isLogin ? "Nouveau sur HOUSIE ?" : "Déjà un compte ?"} 
                <button 
                  className="underline ml-1 font-medium hover:text-purple-700 dark:hover:text-purple-300"
                  onClick={toggleAuthMode}
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </p>
            )}
          </div>

          {/* Auth Card */}
          <Card className="bg-white dark:bg-dark-secondary border-2 border-cyan-200 dark:border-gray-600 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black dark:text-dark-text">
                {isForgotPassword ? "Réinitialiser le mot de passe" : isLogin ? "Connexion" : "Créer un compte"}
              </CardTitle>
              <CardDescription className="dark:text-dark-text-muted">
                {isForgotPassword 
                  ? "Nous vous enverrons un lien de réinitialisation"
                  : isLogin 
                    ? "Accédez à votre compte HOUSIE" 
                    : "Rejoignez des milliers d'utilisateurs satisfaits"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection for Signup */}
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-black dark:text-dark-text">Je souhaite :</Label>
                    <RadioGroup value={userType} onValueChange={setUserType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seeker" id="seeker" />
                        <Label htmlFor="seeker" className="dark:text-dark-text-secondary cursor-pointer">
                          Trouver des services de qualité
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="provider" id="provider" />
                        <Label htmlFor="provider" className="dark:text-dark-text-secondary cursor-pointer">
                          Offrir mes services professionnels
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="dark:text-dark-text-secondary cursor-pointer">
                          Les deux (recommandé)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Full Name Field for Signup */}
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-black dark:text-dark-text">Nom complet</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Jean Dupont"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text"
                      required
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black dark:text-dark-text">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                {!isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-black dark:text-dark-text">Mot de passe</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Minimum 6 caractères
                      </p>
                    )}
                  </div>
                )}

                {/* Confirm Password Field for Signup */}
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-black dark:text-dark-text">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                {isLogin && !isForgotPassword && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember" className="text-sm dark:text-dark-text-secondary cursor-pointer">
                        Se souvenir de moi
                      </Label>
                    </div>
                    <button 
                      type="button" 
                      onClick={toggleForgotPassword}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Chargement..." : 
                   isForgotPassword ? "Envoyer le lien" :
                   isLogin ? "Se connecter" : "Créer mon compte"}
                </Button>
              </form>

              {/* Back to Login from Forgot Password */}
              {isForgotPassword && (
                <div className="text-center">
                  <button 
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    onClick={toggleForgotPassword}
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              )}

              {/* Toggle Auth Mode */}
              {!isForgotPassword && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-dark-text-muted">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"} 
                    <button 
                      className="text-purple-600 dark:text-purple-400 hover:underline ml-1 font-medium"
                      onClick={toggleAuthMode}
                    >
                      {isLogin ? "Commencer avec HOUSIE" : "Se connecter"}
                    </button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
