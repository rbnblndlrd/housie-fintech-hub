
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import ProviderSettingsMegaMenu from "@/components/provider/ProviderSettingsMegaMenu";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  ArrowLeft
} from 'lucide-react';

const ProviderSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Redirect if role changes to customer
  useEffect(() => {
    if (currentRole === 'customer') {
      navigate('/customer-settings');
    }
  }, [currentRole, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      console.log('🔄 Fetching user profile for:', user?.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      console.log('✅ User profile loaded:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil utilisateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des paramètres...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Utilisateur non connecté</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => navigate('/provider-dashboard')}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Paramètres Fournisseur</h1>
            </div>
            <p className="text-gray-600">Gérez votre profil d'entreprise et vos préférences</p>
          </div>

          {/* Megamenu Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <ProviderSettingsMegaMenu
              user={user}
              userProfile={userProfile}
              onSettingsUpdate={fetchUserProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettings;
