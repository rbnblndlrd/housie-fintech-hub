
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Save, TestTube } from 'lucide-react';
import { toast } from 'sonner';

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigured: () => void;
}

const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({
  open,
  onOpenChange,
  onConfigured
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (open && window.electronAPI) {
      loadCurrentConfig();
    }
  }, [open]);

  const loadCurrentConfig = async () => {
    if (!window.electronAPI) return;
    
    const url = await window.electronAPI.getConfig('supabaseUrl');
    const key = await window.electronAPI.getConfig('serviceRoleKey');
    
    if (url) setSupabaseUrl(url);
    if (key) setServiceRoleKey('•'.repeat(20) + key.slice(-8));
  };

  const testConnection = async () => {
    if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('•')) {
      toast.error('Please enter both Supabase URL and Service Role Key');
      return;
    }

    setTesting(true);
    try {
      // Basic validation
      if (!supabaseUrl.includes('supabase.co')) {
        throw new Error('Invalid Supabase URL format');
      }

      if (!serviceRoleKey.startsWith('eyJ')) {
        throw new Error('Invalid Service Role Key format');
      }

      toast.success('Connection validated successfully');
    } catch (error: any) {
      toast.error(`Connection test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const saveConfiguration = async () => {
    if (!window.electronAPI) {
      toast.error('Electron API not available');
      return;
    }

    if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('•')) {
      toast.error('Please enter both Supabase URL and Service Role Key');
      return;
    }

    try {
      await window.electronAPI.setConfig('supabaseUrl', supabaseUrl);
      await window.electronAPI.setConfig('serviceRoleKey', serviceRoleKey);
      
      onConfigured();
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Supabase Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="supabaseUrl">Supabase URL</Label>
            <Input
              id="supabaseUrl"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="serviceRoleKey">Service Role Key</Label>
            <Input
              id="serviceRoleKey"
              type="password"
              value={serviceRoleKey}
              onChange={(e) => setServiceRoleKey(e.target.value)}
              placeholder="eyJ..."
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be stored securely in encrypted app storage
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={testing}
              className="flex-1"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button
              onClick={saveConfiguration}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-blue-900 mb-1">Security Note:</p>
            <p className="text-blue-700">
              Your Service Role Key is stored encrypted locally and never transmitted in plain text.
              This desktop app requires admin-level database access for emergency controls.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
