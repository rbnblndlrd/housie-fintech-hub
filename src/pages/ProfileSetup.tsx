import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Heart, User, Bell, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

export const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: "",
    radius: "10",
    services: [] as string[],
    ageRange: "",
    householdSize: "",
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const serviceCategories = [
    "Ménage Résidentiel",
    "Entretien Paysager", 
    "Construction & Réno",
    "Soins Personnels",
    "Soins d'Animaux",
    "Livraison & Courses",
    "Tutorat & Formation",
    "Services Auto"
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleComplete = () => {
    // Save profile data (integrate with Supabase later)
    console.log('Profile data:', formData);
    navigate('/services');
  };

  const handleSkip = () => {
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-accent">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-black dark:text-dark-text mb-2">
              Personnalisez votre expérience
            </h1>
            <p className="text-gray-600 dark:text-dark-text-muted">
              Étape {currentStep} sur 4 - Cela ne prend que 2 minutes
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="bg-white dark:bg-dark-secondary border-2 border-gray-100 dark:border-gray-600 shadow-xl">
            <CardContent className="p-8">
              {/* Step 1: Location Preferences */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black dark:text-dark-text">Préférences géographiques</h2>
                    <p className="text-gray-600 dark:text-dark-text-muted">Où souhaitez-vous trouver des services ?</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location" className="text-black dark:text-dark-text">Votre ville ou code postal</Label>
                      <Input
                        id="location"
                        placeholder="Montreal, QC ou H1A 1A1"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text"
                      />
                    </div>

                    <div>
                      <Label className="text-black dark:text-dark-text">Rayon de recherche</Label>
                      <Select value={formData.radius} onValueChange={(value) => setFormData(prev => ({ ...prev, radius: value }))}>
                        <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 km</SelectItem>
                          <SelectItem value="10">10 km</SelectItem>
                          <SelectItem value="25">25 km</SelectItem>
                          <SelectItem value="50">50 km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Service Interests */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black dark:text-dark-text">Services d'intérêt</h2>
                    <p className="text-gray-600 dark:text-dark-text-muted">Quels services vous intéressent le plus ?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {serviceCategories.map((service) => (
                      <div
                        key={service}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.services.includes(service)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                        }`}
                        onClick={() => handleServiceToggle(service)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                          />
                          <span className="text-sm font-medium text-black dark:text-dark-text">{service}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Basic Demographics */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <User className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black dark:text-dark-text">Informations de base</h2>
                    <p className="text-gray-600 dark:text-dark-text-muted">Aidez-nous à mieux vous comprendre</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-black dark:text-dark-text">Tranche d'âge</Label>
                      <RadioGroup value={formData.ageRange} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRange: value }))}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="18-25" id="18-25" />
                          <Label htmlFor="18-25" className="dark:text-dark-text-secondary">18-25 ans</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="26-35" id="26-35" />
                          <Label htmlFor="26-35" className="dark:text-dark-text-secondary">26-35 ans</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="36-50" id="36-50" />
                          <Label htmlFor="36-50" className="dark:text-dark-text-secondary">36-50 ans</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="50+" id="50+" />
                          <Label htmlFor="50+" className="dark:text-dark-text-secondary">50+ ans</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-black dark:text-dark-text">Taille du foyer</Label>
                      <Select value={formData.householdSize} onValueChange={(value) => setFormData(prev => ({ ...prev, householdSize: value }))}>
                        <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-dark-accent dark:text-dark-text">
                          <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 personne</SelectItem>
                          <SelectItem value="2">2 personnes</SelectItem>
                          <SelectItem value="3-4">3-4 personnes</SelectItem>
                          <SelectItem value="5+">5+ personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Notification Preferences */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Bell className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black dark:text-dark-text">Préférences de notification</h2>
                    <p className="text-gray-600 dark:text-dark-text-muted">Comment souhaitez-vous être informé ?</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600">
                      <div>
                        <Label className="font-medium text-black dark:text-dark-text">Notifications par email</Label>
                        <p className="text-sm text-gray-600 dark:text-dark-text-muted">Nouvelles réservations, messages</p>
                      </div>
                      <Checkbox 
                        checked={formData.notifications.email}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked === true }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600">
                      <div>
                        <Label className="font-medium text-black dark:text-dark-text">Notifications SMS</Label>
                        <p className="text-sm text-gray-600 dark:text-dark-text-muted">Rappels urgents uniquement</p>
                      </div>
                      <Checkbox 
                        checked={formData.notifications.sms}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: checked === true }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600">
                      <div>
                        <Label className="font-medium text-black dark:text-dark-text">Notifications push</Label>
                        <p className="text-sm text-gray-600 dark:text-dark-text-muted">Dans l'application</p>
                      </div>
                      <Checkbox 
                        checked={formData.notifications.push}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked === true }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t dark:border-gray-600">
                <div className="flex gap-4">
                  {currentStep > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleSkip}
                    className="text-gray-500 dark:text-dark-text-muted"
                  >
                    Passer
                  </Button>
                </div>

                {currentStep < 4 ? (
                  <Button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold"
                  >
                    Suivant
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold"
                  >
                    Terminer
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
