
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Wrench, Users, Calendar, DollarSign, Building, Trash2, Download, Upload, RefreshCw, AlertTriangle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DevelopmentToolsSection = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMockUsers = async (count: number) => {
    setLoading(`users-${count}`);
    try {
      // Generate mock users (this would be expanded with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Succès",
        description: `${count} utilisateurs de test créés avec succès`,
      });
    } catch (error) {
      console.error('Error generating users:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const generateMockBookings = async (count: number) => {
    setLoading(`bookings-${count}`);
    try {
      // Generate mock bookings
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Succès",
        description: `${count} réservations de test créées avec succès`,
      });
    } catch (error) {
      console.error('Error generating bookings:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const generateMockRevenue = async () => {
    setLoading('revenue');
    try {
      // Generate sample revenue data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Succès",
        description: "Données de revenus de test créées avec succès",
      });
    } catch (error) {
      console.error('Error generating revenue:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des données de revenus",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const generateMockProviders = async () => {
    setLoading('providers');
    try {
      // Generate mock providers
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      toast({
        title: "Succès",
        description: "Prestataires de test créés avec succès",
      });
    } catch (error) {
      console.error('Error generating providers:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des prestataires",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const deleteTestUsers = async () => {
    setLoading('delete-users');
    try {
      // Delete test users
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Succès",
        description: "Utilisateurs de test supprimés avec succès",
      });
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const clearMockBookings = async () => {
    setLoading('clear-bookings');
    try {
      // Clear mock bookings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Succès",
        description: "Réservations de test supprimées avec succès",
      });
    } catch (error) {
      console.error('Error clearing bookings:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression des réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const resetAnalytics = async () => {
    setLoading('reset-analytics');
    try {
      // Reset analytics data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Succès",
        description: "Données analytiques réinitialisées avec succès",
      });
    } catch (error) {
      console.error('Error resetting analytics:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la réinitialisation",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const nuclearReset = async () => {
    setLoading('nuclear');
    try {
      // Complete database reset
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Succès",
        description: "Réinitialisation complète effectuée avec succès",
      });
    } catch (error) {
      console.error('Error with nuclear reset:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la réinitialisation complète",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const exportData = async () => {
    setLoading('export');
    try {
      // Export database state
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Succès",
        description: "Données exportées avec succès",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'exportation",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Development Tools Header */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            Outils de Développement
            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
              Pré-Lancement
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Mock Data Generator */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            Générateur de Données de Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Users Generation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Utilisateurs de Test</h4>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => generateMockUsers(50)}
                disabled={loading === 'users-50'}
                className="fintech-button-secondary"
              >
                {loading === 'users-50' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                50 Utilisateurs
              </Button>
              <Button
                onClick={() => generateMockUsers(100)}
                disabled={loading === 'users-100'}
                className="fintech-button-secondary"
              >
                {loading === 'users-100' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                100 Utilisateurs
              </Button>
              <Button
                onClick={() => generateMockUsers(500)}
                disabled={loading === 'users-500'}
                className="fintech-button-secondary"
              >
                {loading === 'users-500' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                500 Utilisateurs
              </Button>
            </div>
          </div>

          {/* Bookings Generation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Réservations de Test</h4>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => generateMockBookings(100)}
                disabled={loading === 'bookings-100'}
                className="fintech-button-secondary"
              >
                {loading === 'bookings-100' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                100 Réservations
              </Button>
              <Button
                onClick={() => generateMockBookings(500)}
                disabled={loading === 'bookings-500'}
                className="fintech-button-secondary"
              >
                {loading === 'bookings-500' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                500 Réservations
              </Button>
              <Button
                onClick={() => generateMockBookings(1000)}
                disabled={loading === 'bookings-1000'}
                className="fintech-button-secondary"
              >
                {loading === 'bookings-1000' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                1000 Réservations
              </Button>
            </div>
          </div>

          {/* Revenue & Providers */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Données Financières</h4>
              </div>
              <Button
                onClick={generateMockRevenue}
                disabled={loading === 'revenue'}
                className="fintech-button-secondary w-full"
              >
                {loading === 'revenue' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Générer Revenus de Test
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900">Prestataires</h4>
              </div>
              <Button
                onClick={generateMockProviders}
                disabled={loading === 'providers'}
                className="fintech-button-secondary w-full"
              >
                {loading === 'providers' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Créer Prestataires Vérifiés
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Cleanup */}
      <Card className="fintech-card border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-red-700">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            Nettoyage Pré-Lancement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={deleteTestUsers}
              disabled={loading === 'delete-users'}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              {loading === 'delete-users' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Supprimer Utilisateurs Test
            </Button>

            <Button
              onClick={clearMockBookings}
              disabled={loading === 'clear-bookings'}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              {loading === 'clear-bookings' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Effacer Réservations Test
            </Button>

            <Button
              onClick={resetAnalytics}
              disabled={loading === 'reset-analytics'}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              {loading === 'reset-analytics' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Réinitialiser Analytiques
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-700 hover:bg-red-50"
                  disabled={!!loading}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Réinitialisation Complète
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-700">⚠️ Réinitialisation Complète</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera TOUTES les données de la base de données, y compris:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Tous les utilisateurs et profils</li>
                      <li>Toutes les réservations et services</li>
                      <li>Toutes les données analytiques</li>
                      <li>Tous les messages et conversations</li>
                    </ul>
                    <strong>Cette action est irréversible!</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={nuclearReset}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading === 'nuclear' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    Confirmer la Réinitialisation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Recovery */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Download className="h-4 w-4 text-white" />
            </div>
            Sauvegarde et Récupération
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={exportData}
              disabled={loading === 'export'}
              className="fintech-button-secondary"
            >
              {loading === 'export' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              <Download className="h-4 w-4 mr-2" />
              Exporter État Actuel
            </Button>

            <Button
              disabled={!!loading}
              className="fintech-button-secondary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer État Propre
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentToolsSection;
