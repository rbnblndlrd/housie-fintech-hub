
import React, { useEffect, useState } from 'react';
import EmergencyControlsDashboard from './components/EmergencyControlsDashboard';
import FraudDetectionDashboard from './components/FraudDetectionDashboard';
import UserManagementDashboard from './components/UserManagementDashboard';
import SystemHealthDashboard from './components/SystemHealthDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DevToolsDashboard from './components/DevToolsDashboard';
import ConfigurationDialog from './components/ConfigurationDialog';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Shield, Settings, Activity, Users, AlertTriangle, BarChart3, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { initializeSupabase } from './services/supabaseClient';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('emergency');

  useEffect(() => {
    initializeApp();
    setupElectronListeners();
    
    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('emergency-action');
        window.electronAPI.removeAllListeners('refresh-controls');
      }
    };
  }, []);

  const initializeApp = async () => {
    try {
      setIsInitializing(true);
      const configured = await checkAndInitializeConfiguration();
      setIsConfigured(configured);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast.error('Failed to initialize application');
    } finally {
      setIsInitializing(false);
    }
  };

  const checkAndInitializeConfiguration = async () => {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return false;
    }

    try {
      const supabaseUrl = await window.electronAPI.getConfig('supabaseUrl');
      const serviceRoleKey = await window.electronAPI.getConfig('serviceRoleKey');
      
      if (supabaseUrl && serviceRoleKey) {
        console.log('✅ Configuration found, initializing Supabase...');
        await initializeSupabase();
        console.log('✅ Supabase client initialized successfully');
        return true;
      } else {
        console.log('⚠️ Configuration not found');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize configuration:', error);
      toast.error('Failed to initialize Supabase connection');
      return false;
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
    // Switch to emergency tab when emergency actions are triggered
    setActiveTab('emergency');
    
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

  const handleConfigurationSaved = async () => {
    try {
      console.log('🔄 Configuration saved, reinitializing...');
      const configured = await checkAndInitializeConfiguration();
      setIsConfigured(configured);
      setIsConfigDialogOpen(false);
      
      if (configured) {
        toast.success('Configuration saved and Supabase initialized');
      } else {
        toast.error('Failed to initialize Supabase with new configuration');
      }
    } catch (error) {
      console.error('Failed to reinitialize after configuration:', error);
      toast.error('Failed to apply new configuration');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing HOUSIE Admin...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Configure your Supabase connection to access the complete admin dashboard.
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
          onConfigured={handleConfigurationSaved}
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
                <p className="text-sm text-gray-600">Complete Platform Management Dashboard</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="fraud" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Fraud
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Health
            </TabsTrigger>
            <TabsTrigger value="devtools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Dev Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency">
            <EmergencyControlsDashboard key={lastRefresh.getTime()} />
          </TabsContent>

          <TabsContent value="fraud">
            <FraudDetectionDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="health">
            <SystemHealthDashboard />
          </TabsContent>

          <TabsContent value="devtools">
            <DevToolsDashboard />
          </TabsContent>
        </Tabs>
      </div>

      <ConfigurationDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        onConfigured={handleConfigurationSaved}
      />
    </div>
  );
}

export default App;
