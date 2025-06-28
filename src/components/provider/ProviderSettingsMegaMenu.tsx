import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Bell, 
  Clock, 
  CreditCard, 
  User, 
  Eye, 
  EyeOff, 
  MapPin, 
  Navigation,
  Home,
  Car,
  Info,
  Truck,
  CheckCircle
} from 'lucide-react';

interface ProviderSettingsMegaMenuProps {
  user: any;
  userProfile: any;
  onSettingsUpdate: () => void;
}

const ProviderSettingsMegaMenu: React.FC<ProviderSettingsMegaMenuProps> = ({
  user,
  userProfile,
  onSettingsUpdate
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("confidentiality");
  
  const [settings, setSettings] = useState({
    businessName: '',
    description: '',
    phone: '',
    email: user?.email || '',
    notifications: {
      bookingRequests: true,
      messages: true,
      reviews: true,
      marketing: false
    },
    availability: {
      autoAccept: false,
      advanceNotice: 2,
      maxBookingsPerDay: 5
    },
    privacy: {
      showOnMap: userProfile?.show_on_map ?? true,
      confidentialityRadius: Math.round((userProfile?.confidentiality_radius ?? 10000) / 1000),
      serviceType: userProfile?.service_type ?? 'customer_location',
      serviceRadius: Math.round((userProfile?.service_radius ?? 15000) / 1000)
    }
  });

  const menuSections = [
    {
      id: 'confidentiality',
      title: 'Confidentialité & Localisation',
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      id: 'distance-service',
      title: 'Distance & Service Type',
      icon: Truck,
      color: 'text-green-600'
    },
    {
      id: 'community-rating',
      title: 'Community Rating',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: Bell,
      color: 'text-yellow-600'
    },
    {
      id: 'availability',
      title: 'Availability Settings',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      id: 'business',
      title: 'Business Information',
      icon: User,
      color: 'text-orange-600'
    },
    {
      id: 'verification',
      title: 'Verification Status',
      icon: CheckCircle,
      color: 'text-emerald-600'
    }
  ];

  const handleSavePrivacySettings = async () => {
    try {
      setSaving(true);
      console.log('💾 Saving privacy settings for user:', user.id, settings.privacy);
      
      const { error } = await supabase
        .from('users')
        .update({
          show_on_map: settings.privacy.showOnMap,
          confidentiality_radius: settings.privacy.confidentialityRadius * 1000,
          service_type: settings.privacy.serviceType,
          service_radius: settings.privacy.serviceRadius * 1000,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      console.log('✅ Privacy settings saved successfully');
      
      toast({
        title: "✅ Paramètres sauvegardés",
        description: "Vos préférences de confidentialité ont été mises à jour avec succès",
      });

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

  const handleSaveGeneralSettings = () => {
    console.log('Saving general settings:', settings);
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été mis à jour avec succès",
    });
  };

  const getServiceTypeInfo = (serviceType: string) => {
    switch (serviceType) {
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

  const renderContent = () => {
    switch (activeSection) {
      case 'community-rating':
        return (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                Community Rating & Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-purple-800 mb-1">Quality-Based Point System</p>
                    <p className="text-purple-700">
                      Earn points based on service quality: 5★ reviews = +3pts, 4★ = +2pts, 3★ = +1pt. 
                      Poor service (1-2★) results in penalties. Consistent excellence unlocks momentum bonuses!
                    </p>
                  </div>
                </div>
              </div>

              <CommunityRatingDisplay userId={user.id} />

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Point Earning Guide</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Job Completion</span>
                    <span className="font-medium text-green-600">+2 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5★ Review</span>
                    <span className="font-medium text-green-600">+3 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5★ + Detailed Comment</span>
                    <span className="font-medium text-green-600">+5 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excellence Streak Bonus</span>
                    <span className="font-medium text-green-600">+1 point</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Each Commendation</span>
                    <span className="font-medium text-green-600">+1 point</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>1★ Review (ELO Hell)</span>
                    <span className="font-medium text-red-600">-3 points</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'confidentiality':
        return (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Confidentialité & Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <Label className="text-base font-medium">
                    Zone de confidentialité: {settings.privacy.confidentialityRadius} km
                  </Label>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[settings.privacy.confidentialityRadius]}
                    onValueChange={([value]) => 
                      setSettings({ 
                        ...settings, 
                        privacy: { ...settings.privacy, confidentialityRadius: value } 
                      })
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.privacy.showOnMap ? (
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
                  checked={settings.privacy.showOnMap}
                  onCheckedChange={(checked) => 
                    setSettings({ 
                      ...settings, 
                      privacy: { ...settings.privacy, showOnMap: checked } 
                    })
                  }
                />
              </div>

              <Button 
                onClick={handleSavePrivacySettings}
                disabled={saving}
                className="w-full fintech-button-primary"
              >
                {saving ? 'Sauvegarde...' : '💾 Sauvegarder les paramètres'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'distance-service':
        const serviceInfo = getServiceTypeInfo(settings.privacy.serviceType);
        return (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Distance & Service Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <Label className="text-base font-medium">
                    Distance de déplacement: {settings.privacy.serviceRadius} km
                  </Label>
                </div>
                
                <div className="px-2">
                  <Slider
                    value={[settings.privacy.serviceRadius]}
                    onValueChange={([value]) => 
                      setSettings({ 
                        ...settings, 
                        privacy: { ...settings.privacy, serviceRadius: value } 
                      })
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
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Type de Service (Partage d'adresse)</Label>
                <RadioGroup 
                  value={settings.privacy.serviceType} 
                  onValueChange={(value) => 
                    setSettings({ 
                      ...settings, 
                      privacy: { ...settings.privacy, serviceType: value as any } 
                    })
                  }
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
                          Les clients viennent chez vous - votre adresse peut être partagée après confirmation
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
                      </div>
                    </div>
                  </div>
                </RadioGroup>

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

              <Button 
                onClick={handleSavePrivacySettings}
                disabled={saving}
                className="w-full fintech-button-primary"
              >
                {saving ? 'Sauvegarde...' : '💾 Sauvegarder les paramètres'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'notifications':
        return (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries({
                bookingRequests: 'Nouvelles demandes de réservation',
                messages: 'Messages des clients',
                reviews: 'Nouveaux avis et évaluations',
                marketing: 'E-mails marketing et promotionnels'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{label}</Label>
                  <Switch
                    id={key}
                    checked={settings.notifications[key as keyof typeof settings.notifications]}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        notifications: {...settings.notifications, [key]: checked}
                      })
                    }
                  />
                </div>
              ))}
              
              <Button onClick={handleSaveGeneralSettings} className="w-full mt-6">
                💾 Sauvegarder les paramètres
              </Button>
            </CardContent>
          </Card>
        );

      case 'availability':
        return (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Availability Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoAccept">Acceptation automatique des réservations</Label>
                  <p className="text-sm text-gray-600">Accepter automatiquement les réservations qui répondent à vos critères</p>
                </div>
                <Switch
                  id="autoAccept"
                  checked={settings.availability.autoAccept}
                  onCheckedChange={(checked) => 
                    setSettings({
                      ...settings,
                      availability: {...settings.availability, autoAccept: checked}
                    })
                  }
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="advanceNotice">Préavis minimum (heures)</Label>
                  <Input
                    id="advanceNotice"
                    type="number"
                    value={settings.availability.advanceNotice}
                    onChange={(e) => setSettings({
                      ...settings,
                      availability: {...settings.availability, advanceNotice: parseInt(e.target.value)}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxBookings">Maximum de réservations par jour</Label>
                  <Input
                    id="maxBookings"
                    type="number"
                    value={settings.availability.maxBookingsPerDay}
                    onChange={(e) => setSettings({
                      ...settings,
                      availability: {...settings.availability, maxBookingsPerDay: parseInt(e.target.value)}
                    })}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveGeneralSettings} className="w-full">
                💾 Sauvegarder les paramètres
              </Button>
            </CardContent>
          </Card>
        );

      case 'business':
        return (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Nom de l'entreprise</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description de l'entreprise</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({...settings, description: e.target.value})}
                  placeholder="Décrivez vos services et votre expérience..."
                  rows={4}
                />
              </div>
              
              <Button onClick={handleSaveGeneralSettings} className="w-full">
                💾 Sauvegarder les paramètres
              </Button>
            </CardContent>
          </Card>
        );

      case 'verification':
        return (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">E-mail Vérifié</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-800 font-medium">Vérification Téléphone</span>
                  <Button variant="outline" size="sm">Vérifier</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Vérification des Antécédents</span>
                  <Button variant="outline" size="sm">Commencer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar Menu */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Paramètres</h2>
          <p className="text-sm text-gray-600 mt-1">Gérez votre profil et préférences</p>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? section.color : 'text-gray-500'}`} />
                  <span className={`font-medium ${isActive ? 'text-blue-800' : ''}`}>
                    {section.title}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProviderSettingsMegaMenu;
