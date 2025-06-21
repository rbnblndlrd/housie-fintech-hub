
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreamBadge } from '@/components/ui/cream-badge';
import { Calendar as CalendarIcon, RefreshCw, Download, Upload, CheckCircle, AlertCircle, Unlink } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

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
  const { isConnected, isLoading, connectCalendar, disconnectCalendar } = useGoogleCalendar();

  const handleSync = async () => {
    // Mock sync functionality for now
    onSync?.();
  };

  const handleImport = () => {
    onImport?.();
  };

  const handleExport = () => {
    onExport?.();
  };

  if (isLoading) {
    return (
      <Card className="fintech-card">
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading calendar status...</span>
        </CardContent>
      </Card>
    );
  }

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
              onClick={connectCalendar}
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
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Synchroniser
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

            <div className="pt-2 border-t border-gray-200">
              <Button
                onClick={disconnectCalendar}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 w-full"
              >
                <Unlink className="h-4 w-4" />
                Déconnecter Google Calendar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarIntegration;
