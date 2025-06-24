
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff, MapPin, Info } from 'lucide-react';

interface PrivacySettingsSectionProps {
  userId: string;
  showOnMap?: boolean;
  confidentialityRadius?: number;
  onSettingsUpdate?: () => void;
}

const PrivacySettingsSection: React.FC<PrivacySettingsSectionProps> = ({
  userId,
  showOnMap = true,
  confidentialityRadius = 10000, // Default 10km
  onSettingsUpdate
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    showOnMap,
    confidentialityRadius: Math.round(confidentialityRadius / 1000) // Convert to km for display
  });

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('users')
        .update({
          show_on_map: settings.showOnMap,
          confidentiality_radius: settings.confidentialityRadius * 1000, // Convert to meters
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences de confidentialité ont été mises à jour",
      });

      onSettingsUpdate?.();
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
                  Permettre aux clients de voir votre zone de service
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
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full fintech-button-primary"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsSection;
