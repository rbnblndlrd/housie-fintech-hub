import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  MapPin, 
  Clock, 
  DollarSign, 
  Bell, 
  Shield, 
  Calendar,
  Settings,
  Save,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  CreditCard,
  FileText,
  Camera,
  Navigation
} from 'lucide-react';
import NavigationSettingsSection from './NavigationSettingsSection';

interface ProviderSettingsMegaMenuProps {
  user: any;
  userProfile: any;
  onSettingsUpdate?: () => void;
}

interface ProviderSettings {
  working_hours: any;
  service_duration: number;
  buffer_time: number;
  break_duration: number;
  time_zone: string;
  auto_accept_bookings: boolean;
  advance_booking_days: number;
  min_booking_notice: number;
}

const ProviderSettingsMegaMenu: React.FC<ProviderSettingsMegaMenuProps> = ({
  user,
  userProfile,
  onSettingsUpdate
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [providerSettings, setProviderSettings] = useState<ProviderSettings>({
    working_hours: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '17:00', enabled: false },
      sunday: { start: '09:00', end: '17:00', enabled: false }
    },
    service_duration: 120,
    buffer_time: 15,
    break_duration: 30,
    time_zone: 'America/Montreal',
    auto_accept_bookings: false,
    advance_booking_days: 30,
    min_booking_notice: 120
  });

  const [profileData, setProfileData] = useState({
    full_name: userProfile?.full_name || '',
    email: user?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    bio: userProfile?.bio || '',
    company_name: userProfile?.company_name || '',
    website: userProfile?.website || '',
    hourly_rate: userProfile?.hourly_rate || 35,
    service_area_radius: userProfile?.service_area_radius || 25,
    languages: userProfile?.languages || ['English'],
    certifications: userProfile?.certifications || [],
    insurance_verified: userProfile?.insurance_verified || false,
    background_check: userProfile?.background_check || false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: true,
    marketing_emails: false,
    booking_reminders: true,
    payment_notifications: true,
    review_notifications: true
  });

  useEffect(() => {
    loadProviderSettings();
  }, [user]);

  const loadProviderSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('provider_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading provider settings:', error);
        return;
      }

      if (data) {
        setProviderSettings({
          working_hours: data.working_hours || providerSettings.working_hours,
          service_duration: data.service_duration || 120,
          buffer_time: data.buffer_time || 15,
          break_duration: data.break_duration || 30,
          time_zone: data.time_zone || 'America/Montreal',
          auto_accept_bookings: data.auto_accept_bookings || false,
          advance_booking_days: data.advance_booking_days || 30,
          min_booking_notice: data.min_booking_notice || 120
        });
      }
    } catch (error) {
      console.error('Error loading provider settings:', error);
    }
  };

  const saveProviderSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('provider_settings')
        .upsert({
          user_id: user.id,
          ...providerSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès",
      });

      onSettingsUpdate?.();
    } catch (error) {
      console.error('Error saving provider settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations de profil ont été sauvegardées",
      });

      onSettingsUpdate?.();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const menuSections = [
    {
      id: 'profile',
      label: 'Profil d\'entreprise',
      icon: '👤',
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations du profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nom complet</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <Label htmlFor="company_name">Nom de l'entreprise</Label>
                <Input
                  id="company_name"
                  value={profileData.company_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (514) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Votre adresse d'entreprise"
              />
            </div>

            <div>
              <Label htmlFor="bio">Description de l'entreprise</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Décrivez vos services et votre expertise..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourly_rate">Tarif horaire ($)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={profileData.hourly_rate}
                  onChange={(e) => setProfileData(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) }))}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="service_area_radius">Rayon de service (km)</Label>
                <Input
                  id="service_area_radius"
                  type="number"
                  value={profileData.service_area_radius}
                  onChange={(e) => setProfileData(prev => ({ ...prev, service_area_radius: parseInt(e.target.value) }))}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <Button onClick={saveProfileData} disabled={loading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder le profil
            </Button>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'schedule',
      label: 'Horaires & Disponibilité',
      icon: '📅',
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Horaires de travail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(providerSettings.working_hours).map(([day, hours]: [string, any]) => (
              <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={hours.enabled}
                    onCheckedChange={(checked) => {
                      setProviderSettings(prev => ({
                        ...prev,
                        working_hours: {
                          ...prev.working_hours,
                          [day]: { ...hours, enabled: checked }
                        }
                      }));
                    }}
                  />
                  <span className="font-medium capitalize">{day}</span>
                </div>
                {hours.enabled && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={hours.start}
                      onChange={(e) => {
                        setProviderSettings(prev => ({
                          ...prev,
                          working_hours: {
                            ...prev.working_hours,
                            [day]: { ...hours, start: e.target.value }
                          }
                        }));
                      }}
                      className="w-24"
                    />
                    <span>à</span>
                    <Input
                      type="time"
                      value={hours.end}
                      onChange={(e) => {
                        setProviderSettings(prev => ({
                          ...prev,
                          working_hours: {
                            ...prev.working_hours,
                            [day]: { ...hours, end: e.target.value }
                          }
                        }));
                      }}
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            ))}

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="service_duration">Durée de service (min)</Label>
                <Input
                  id="service_duration"
                  type="number"
                  value={providerSettings.service_duration}
                  onChange={(e) => setProviderSettings(prev => ({ ...prev, service_duration: parseInt(e.target.value) }))}
                  min="30"
                  max="480"
                />
              </div>
              <div>
                <Label htmlFor="buffer_time">Temps de battement (min)</Label>
                <Input
                  id="buffer_time"
                  type="number"
                  value={providerSettings.buffer_time}
                  onChange={(e) => setProviderSettings(prev => ({ ...prev, buffer_time: parseInt(e.target.value) }))}
                  min="0"
                  max="60"
                />
              </div>
              <div>
                <Label htmlFor="break_duration">Durée de pause (min)</Label>
                <Input
                  id="break_duration"
                  type="number"
                  value={providerSettings.break_duration}
                  onChange={(e) => setProviderSettings(prev => ({ ...prev, break_duration: parseInt(e.target.value) }))}
                  min="15"
                  max="120"
                />
              </div>
            </div>

            <Button onClick={saveProviderSettings} disabled={loading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les horaires
            </Button>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'navigation',
      label: 'Navigation & GPS',
      icon: '🧭',
      component: <NavigationSettingsSection onSettingsUpdate={onSettingsUpdate} />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Préférences de notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getNotificationDescription(key)}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => {
                    setNotificationSettings(prev => ({ ...prev, [key]: checked }));
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )
    },
    {
      id: 'verification',
      label: 'Vérification & Sécurité',
      icon: '🛡️',
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Statut de vérification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Assurance vérifiée</span>
                  <Badge variant={profileData.insurance_verified ? "default" : "secondary"}>
                    {profileData.insurance_verified ? "Vérifié" : "En attente"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Preuve d'assurance responsabilité civile
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Vérification des antécédents</span>
                  <Badge variant={profileData.background_check ? "default" : "secondary"}>
                    {profileData.background_check ? "Vérifié" : "En attente"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Vérification criminelle et références
                </p>
              </div>
            </div>

            <div>
              <Label>Certifications</Label>
              <div className="mt-2 space-y-2">
                {profileData.certifications.length > 0 ? (
                  profileData.certifications.map((cert: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {cert}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">Aucune certification ajoutée</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  const getNotificationDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
      email_notifications: "Recevoir les mises à jour par email",
      push_notifications: "Notifications push sur votre appareil",
      sms_notifications: "Messages texte pour les urgences",
      marketing_emails: "Offres promotionnelles et nouvelles",
      booking_reminders: "Rappels de rendez-vous",
      payment_notifications: "Notifications de paiement",
      review_notifications: "Nouvelles évaluations clients"
    };
    return descriptions[key] || "";
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Menu */}
      <div className="w-64 bg-gray-50 border-r p-4">
        <div className="space-y-2">
          {menuSections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection(section.id)}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {menuSections.find(section => section.id === activeSection)?.component}
      </div>
    </div>
  );
};

export default ProviderSettingsMegaMenu;
