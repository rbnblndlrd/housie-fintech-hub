
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, User, Phone, Mail, FileText } from 'lucide-react';
import Header from '@/components/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <Header />
      <div className="pt-20 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)]">
                <Settings className="h-6 w-6 text-white" />
              </div>
              Paramètres du Prestataire
            </h1>
            <p className="text-xl text-gray-600">Gérez vos informations professionnelles</p>
          </div>

          {/* Settings Form */}
          <Card className="fintech-card">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                Informations du Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Name */}
                <div className="space-y-3">
                  <Label htmlFor="businessName" className="text-base font-semibold text-gray-700">
                    Nom de l'entreprise *
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Entrez le nom de votre entreprise"
                    className="w-full h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <Label htmlFor="phoneNumber" className="text-base font-semibold text-gray-700 flex items-center gap-2">
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
                    className="w-full h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-semibold text-gray-700 flex items-center gap-2">
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
                    className="w-full h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Service Description */}
                <div className="space-y-3">
                  <Label htmlFor="serviceDescription" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description des services
                  </Label>
                  <Textarea
                    id="serviceDescription"
                    name="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={handleInputChange}
                    placeholder="Décrivez vos services et votre expérience..."
                    className="w-full min-h-[140px] resize-none rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    rows={6}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Mettre à jour le profil
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 shadow-inner">
            <p className="text-base text-blue-800 leading-relaxed">
              <strong>Note:</strong> Ces informations seront visibles par les clients potentiels. 
              Assurez-vous qu'elles sont exactes et professionnelles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettings;
