
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Building, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    userType: "",
    businessName: "",
    serviceTypes: [],
    experience: "",
    location: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAccountCreation = async () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.fullName);
      toast({
        title: "Compte créé avec succès!",
        description: "Continuons avec la configuration de votre profil.",
      });
      handleNext();
    } catch (error: any) {
      let errorMessage = "Une erreur s'est produite lors de la création du compte.";
      
      if (error.name === 'EmailConfirmationRequired') {
        errorMessage = "Compte créé! Veuillez confirmer votre email avant de continuer.";
        toast({
          title: "Confirmation email requise",
          description: errorMessage,
          variant: "default",
        });
        handleNext();
        return;
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "Un compte existe déjà avec cet email.";
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Bienvenue sur HOUSIE!",
      description: "Votre profil a été configuré avec succès.",
    });
    navigate('/welcome');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">
                Créer votre compte
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted">
                Commençons par créer votre compte HOUSIE
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nom complet *</Label>
                <Input
                  id="fullName"
                  placeholder="Votre nom complet"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Adresse email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleAccountCreation}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "Créer mon compte"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">
                Quel est votre rôle?
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted">
                Sélectionnez votre utilisation principale de HOUSIE
              </p>
            </div>

            <RadioGroup 
              value={formData.userType} 
              onValueChange={(value) => handleInputChange("userType", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <RadioGroupItem value="client" id="client" />
                <div className="flex items-center space-x-3 flex-1">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <Label htmlFor="client" className="text-lg font-semibold cursor-pointer">
                      Client
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Je cherche des services pour ma maison
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <RadioGroupItem value="provider" id="provider" />
                <div className="flex items-center space-x-3 flex-1">
                  <Building className="h-8 w-8 text-purple-600" />
                  <div>
                    <Label htmlFor="provider" className="text-lg font-semibold cursor-pointer">
                      Prestataire de Services
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Je propose des services professionnels
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!formData.userType}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Continuer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">
                Configurons votre profil
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted">
                Quelques informations pour personnaliser votre expérience
              </p>
            </div>

            <div className="space-y-4">
              {formData.userType === "provider" && (
                <div>
                  <Label htmlFor="businessName">Nom de votre entreprise</Label>
                  <Input
                    id="businessName"
                    placeholder="Mon Entreprise Inc."
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="location">Ville/Région</Label>
                <Input
                  id="location"
                  placeholder="Montréal, QC"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="mt-1"
                />
              </div>

              {formData.userType === "provider" && (
                <div>
                  <Label htmlFor="experience">Années d'expérience</Label>
                  <Input
                    id="experience"
                    placeholder="5"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">
                  {formData.userType === "provider" ? "Description de vos services" : "Parlez-nous de vous"}
                </Label>
                <Textarea
                  id="description"
                  placeholder={formData.userType === "provider" 
                    ? "Décrivez brièvement vos services et votre expertise..."
                    : "Parlez-nous de vos besoins ou préférences..."
                  }
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <Button 
                onClick={handleNext}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Continuer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">
                Bienvenue sur HOUSIE! 🎉
              </h2>
              <p className="text-gray-600 dark:text-dark-text-muted">
                Votre compte est configuré et prêt à l'emploi. Découvrez toutes les fonctionnalités qui vous attendent.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-2">
                Prochaines étapes:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-dark-text-muted space-y-1">
                {formData.userType === "provider" ? (
                  <>
                    <li>✓ Complétez votre profil professionnel</li>
                    <li>✓ Ajoutez vos services et tarifs</li>
                    <li>✓ Configurez votre calendrier</li>
                    <li>✓ Commencez à recevoir des demandes</li>
                  </>
                ) : (
                  <>
                    <li>✓ Explorez les services disponibles</li>
                    <li>✓ Trouvez des professionnels près de chez vous</li>
                    <li>✓ Réservez votre premier service</li>
                    <li>✓ Évaluez votre expérience</li>
                  </>
                )}
              </ul>
            </div>

            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4"
            >
              Commencer avec HOUSIE
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-dark-primary dark:via-dark-secondary dark:to-darker">
      <Header />

      <div className="pt-20 flex items-center justify-center min-h-screen px-4">
        <Card className="max-w-lg w-full bg-white dark:bg-dark-secondary border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-2 rounded-full transition-colors ${
                    step <= currentStep
                      ? "bg-purple-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <CardDescription className="text-sm text-gray-500">
              Étape {currentStep} sur 4
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
