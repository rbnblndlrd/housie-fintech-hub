
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, User, Phone, Mail, FileText } from 'lucide-react';

const ProviderSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: 'Marie Nettoyage Pro',
    phoneNumber: '(514) 555-0123',
    email: 'marie@nettoyagepro.com',
    serviceDescription: 'Service de nettoyage résidentiel et commercial avec 10 ans d\'expérience. Nous offrons des services complets incluant le nettoyage général, le nettoyage en profondeur, et l\'entretien régulier.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.businessName || !formData.phoneNumber || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Mock update success
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Paramètres du Prestataire
          </h1>
          <p className="text-gray-600">Gérez vos informations professionnelles</p>
        </div>

        {/* Settings Form */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              Informations du Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom de votre entreprise"
                  className="w-full"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Numéro de téléphone *
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="(XXX) XXX-XXXX"
                  className="w-full"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Adresse e-mail *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="w-full"
                  required
                />
              </div>

              {/* Service Description */}
              <div className="space-y-2">
                <Label htmlFor="serviceDescription" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Description des services
                </Label>
                <Textarea
                  id="serviceDescription"
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleInputChange}
                  placeholder="Décrivez vos services et votre expérience..."
                  className="w-full min-h-[120px] resize-none"
                  rows={5}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Mettre à jour le profil
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Ces informations seront visibles par les clients potentiels. 
            Assurez-vous qu'elles sont exactes et professionnelles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettings;
