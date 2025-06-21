
import React, { useEffect, useState } from 'react';
import EmergencyControlsDashboard from './components/EmergencyControlsDashboard';
import ConfigurationDialog from './components/ConfigurationDialog';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Shield, Settings } from 'lucide-react';
import { toast } from 'sonner';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    checkConfiguration();
    setupElectronListeners();
    
    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('emergency-action');
        window.electronAPI.removeAllListeners('refresh-controls');
      }
    };
  }, []);

  const checkConfiguration = async () => {
    if (window.electronAPI) {
      const supabaseUrl = await window.electronAPI.getConfig('supabaseUrl');
      const serviceRoleKey = await window.electronAPI.getConfig('serviceRoleKey');
      setIsConfigured(!!supabaseUrl && !!serviceRoleKey);
    }
  };

  const setupElectronListeners = () => {
    if (window.electronAPI) {
      // Listen for emergency actions from menu/tray
      window.electronAPI.onEmergencyAction((action) => {
        handleEmergencyAction(action);
      });

      // Listen for refresh commands
      window.electronAPI.onRefreshControls(() => {
        setLastRefresh(new Date());
        toast.info('Controls refreshed');
      });
    }
  };

  const handleEmergencyAction = (action: string) => {
    switch (action) {
      case 'disable-claude':
        toast.warning('Emergency Claude disable triggered from menu');
        break;
      case 'pause-bookings':
        toast.warning('Emergency booking pause triggered from menu');
        break;
      case 'fraud-lockdown':
        toast.warning('Emergency fraud lockdown triggered from menu');
        break;
      case 'restore-normal':
        toast.success('Normal operations restore triggered from menu');
        break;
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">HOUSIE Admin Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Configure your Supabase connection to access emergency controls.
            </p>
            <Button 
              onClick={() => setIsConfigDialogOpen(true)}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Connection
            </Button>
          </CardContent>
        </Card>

        <ConfigurationDialog
          open={isConfigDialogOpen}
          onOpenChange={setIsConfigDialogOpen}
          onConfigured={() => {
            setIsConfigured(true);
            setIsConfigDialogOpen(false);
            toast.success('Configuration saved successfully');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HOUSIE Admin Desktop</h1>
                <p className="text-sm text-gray-600">Emergency Controls Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfigDialogOpen(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              <div className="text-xs text-gray-500">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <EmergencyControlsDashboard key={lastRefresh.getTime()} />
      </div>

      <ConfigurationDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        onConfigured={() => {
          setIsConfigDialogOpen(false);
          toast.success('Configuration updated successfully');
        }}
      />
    </div>
  );
}

export default App;
