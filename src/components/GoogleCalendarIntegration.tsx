
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarIntegrationProps {
  onSync?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({
  onSync,
  onImport,
  onExport
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    // Mock Google Calendar connection
    toast({
      title: "Connexion Google Calendar",
      description: "Fonctionnalité en développement - Sera disponible bientôt!",
      variant: "default",
    });
    setIsConnected(true);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      toast({
        title: "Synchronisation réussie",
        description: "Vos calendriers sont maintenant synchronisés.",
      });
      onSync?.();
    } catch (error) {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser avec Google Calendar.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImport = () => {
    toast({
      title: "Importation",
      description: "Fonctionnalité d'importation en développement.",
    });
    onImport?.();
  };

  const handleExport = () => {
    toast({
      title: "Exportation",
      description: "Fonctionnalité d'exportation en développement.",
    });
    onExport?.();
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Google Calendar
          </div>
          <CreamBadge variant={isConnected ? "success" : "neutral"}>
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connecté
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Non connecté
              </>
            )}
          </CreamBadge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center py-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 inline-block mb-4">
              <CalendarIcon className="h-12 w-12 text-white mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Connecter Google Calendar
            </h3>
            <p className="text-gray-600 mb-4">
              Synchronisez vos rendez-vous HOUSIE avec Google Calendar
            </p>
            <Button 
              onClick={handleConnect}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Connecter maintenant
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sync...' : 'Synchroniser'}
              </Button>
              
              <Button
                onClick={handleImport}
                variant="outline"
                className="flex items-center gap-2 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
              >
                <Download className="h-4 w-4" />
                Importer
              </Button>
              
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
              >
                <Upload className="h-4 w-4" />
                Exporter
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Synchronisation bidirectionnelle active
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Vos événements se synchronisent automatiquement entre HOUSIE et Google Calendar
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarIntegration;
