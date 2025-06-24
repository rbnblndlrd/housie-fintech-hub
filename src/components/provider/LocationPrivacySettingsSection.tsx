
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff, MapPin, Info, Home, Car, Navigation } from 'lucide-react';

interface LocationPrivacySettingsSectionProps {
  userId: string;
  showOnMap?: boolean;
  confidentialityRadius?: number;
  serviceType?: 'provider_location' | 'customer_location' | 'both';
  serviceRadius?: number;
  onSettingsUpdate?: () => void;
}

const LocationPrivacySettingsSection: React.FC<LocationPrivacySettingsSectionProps> = ({
  userId,
  showOnMap = true,
  confidentialityRadius = 10000,
  serviceType = 'customer_location',
  serviceRadius = 15000,
  onSettingsUpdate
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    showOnMap,
    confidentialityRadius: Math.round(confidentialityRadius / 1000), // Convert to km for display
    serviceType,
    serviceRadius: Math.round(serviceRadius / 1000) // Convert to km for display
  });

  // Update local state when props change
  useEffect(() => {
    setSettings({
      showOnMap,
      confidentialityRadius: Math.round(confidentialityRadius / 1000),
      serviceType,
      serviceRadius: Math.round(serviceRadius / 1000)
    });
  }, [showOnMap, confidentialityRadius, serviceType, serviceRadius]);

  const handleSaveSettings = async () => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non identifié",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Saving privacy settings for user:', userId, settings);
      
      const { error } = await supabase
        .from('users')
        .update({
          show_on_map: settings.showOnMap,
          confidentiality_radius: settings.confidentialityRadius * 1000, // Convert to meters
          service_type: settings.serviceType,
          service_radius: settings.serviceRadius * 1000, // Convert to meters
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ Error saving privacy settings:', error);
        throw error;
      }

      console.log('✅ Privacy settings saved successfully');
      
      toast({
        title: "✅ Paramètres sauvegardés",
        description: "Vos préférences de confidentialité ont été mises à jour avec succès",
      });

      // Trigger refresh of parent component data
      onSettingsUpdate?.();

    } catch (error: any) {
      console.error('❌ Failed to save privacy settings:', error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getServiceTypeInfo = () => {
    switch (settings.serviceType) {
      case 'provider_location':
        return {
          icon: <Home className="h-4 w-4 text-blue-600" />,
          title: "Services à votre domicile",
          description: "Votre adresse peut être partagée avec les clients confirmés",
          examples: "Massage, soins de bien-être, toilettage d'animaux"
        };
      case 'customer_location':
        return {
          icon: <Car className="h-4 w-4 text-green-600" />,
          title: "Services chez le client",
          description: "Votre adresse reste privée - vous vous déplacez",
          examples: "Ménage, entretien de pelouse, déménagement"
        };
      case 'both':
        return {
          icon: <MapPin className="h-4 w-4 text-purple-600" />,
          title: "Services flexibles",
          description: "Vous choisissez selon le service offert",
          examples: "Services variés selon les besoins"
        };
      default:
        return {
          icon: <MapPin className="h-4 w-4 text-gray-600" />,
          title: "Non spécifié",
          description: "",
          examples: ""
        };
    }
  };

  const serviceInfo = getServiceTypeInfo();

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Shield className="h-5 w-5 text-blue-600" />
          Confidentialité et Localisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Protection de votre vie privée</p>
              <p className="text-blue-700">
                Votre position exacte n'est jamais révélée. Les clients voient une zone approximative 
                qui protège votre confidentialité jusqu'à l'acceptation d'un travail.
              </p>
            </div>
          </div>
        </div>

        {/* Show on Map Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.showOnMap ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <Label htmlFor="showOnMap" className="text-base font-medium">
                  Afficher sur la carte
                </Label>
                <p className="text-sm text-gray-600">
                  Permettre aux clients de vous découvrir via la carte interactive
                </p>
              </div>
            </div>
            <Switch
              id="showOnMap"
              checked={settings.showOnMap}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, showOnMap: checked })
              }
            />
          </div>
        </div>

        {/* Confidentiality Radius Slider */}
        {settings.showOnMap && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <Label className="text-base font-medium">
                Zone de confidentialité: {settings.confidentialityRadius} km
              </Label>
            </div>
            
            <div className="px-2">
              <Slider
                value={[settings.confidentialityRadius]}
                onValueChange={([value]) => 
                  setSettings({ ...settings, confidentialityRadius: value })
                }
                min={1}
                max={25}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km (Précis)</span>
                <span>25 km (Très privé)</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Zone actuelle:</strong> Votre position apparaîtra aléatoirement dans un rayon de{' '}
                <span className="font-semibold text-blue-600">
                  {settings.confidentialityRadius} km
                </span>{' '}
                autour de votre emplacement réel.
              </p>
            </div>
          </div>
        )}

        {/* Service Radius Slider */}
        {settings.showOnMap && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-green-600" />
              <Label className="text-base font-medium">
                Distance de déplacement: {settings.serviceRadius} km
              </Label>
            </div>
            
            <div className="px-2">
              <Slider
                value={[settings.serviceRadius]}
                onValueChange={([value]) => 
                  setSettings({ ...settings, serviceRadius: value })
                }
                min={5}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 km (Local)</span>
                <span>50 km (Étendu)</span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Zone de service:</strong> Je me déplace jusqu'à{' '}
                <span className="font-semibold text-green-600">
                  {settings.serviceRadius} km
                </span>{' '}
                pour mes services. Cette zone s'affiche quand les clients survolent votre profil.
              </p>
            </div>
          </div>
        )}

        {/* Service Type Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-600" />
            <Label className="text-base font-medium">
              Type de service (Partage d'adresse)
            </Label>
          </div>
          
          <RadioGroup 
            value={settings.serviceType} 
            onValueChange={(value) => setSettings({ ...settings, serviceType: value as any })}
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="provider_location" id="provider_location" className="mt-1" />
                <div className="flex-1">
                  <label htmlFor="provider_location" className="flex items-center gap-2 font-medium cursor-pointer">
                    <Home className="h-4 w-4 text-blue-600" />
                    Je fournis des services à mon domicile
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Les clients viennent chez vous - votre adresse peut être partagée après confirmation de réservation
                  </p>
                  <p className="text-xs text-gray-500 italic mt-1">
                    Ex: Massage, soins de bien-être, toilettage d'animaux
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="customer_location" id="customer_location" className="mt-1" />
                <div className="flex-1">
                  <label htmlFor="customer_location" className="flex items-center gap-2 font-medium cursor-pointer">
                    <Car className="h-4 w-4 text-green-600" />
                    Je me déplace chez le client
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Vous vous déplacez - votre adresse reste privée
                  </p>
                  <p className="text-xs text-gray-500 italic mt-1">
                    Ex: Ménage, entretien de pelouse, déménagement
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="both" id="both" className="mt-1" />
                <div className="flex-1">
                  <label htmlFor="both" className="flex items-center gap-2 font-medium cursor-pointer">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    Services flexibles (les deux)
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Vous choisissez selon le type de service
                  </p>
                  <p className="text-xs text-gray-500 italic mt-1">
                    Ex: Services variés selon les besoins du client
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {/* Current Selection Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              {serviceInfo.icon}
              <span className="font-medium text-gray-800">{serviceInfo.title}</span>
            </div>
            <p className="text-sm text-gray-700 mb-1">{serviceInfo.description}</p>
            {serviceInfo.examples && (
              <p className="text-xs text-gray-500 italic">{serviceInfo.examples}</p>
            )}
          </div>
        </div>

        {/* Privacy Features List */}
        <div className="space-y-2 text-sm text-gray-600">
          <h4 className="font-medium text-gray-800 mb-2">Fonctionnalités de protection:</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Position mise à jour toutes les 15-30 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Adresse exacte révélée uniquement après acceptation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Impossible de vous localiser précisément</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Contrôle total sur le partage d'adresse</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Zone de service visible au survol de votre profil</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full fintech-button-primary"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sauvegarde...
            </div>
          ) : (
            '💾 Sauvegarder les paramètres'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationPrivacySettingsSection;
