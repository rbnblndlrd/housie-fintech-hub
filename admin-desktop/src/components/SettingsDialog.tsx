
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCredentials } from "../contexts/CredentialsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface SettingsDialogProps {
  children: React.ReactNode;
}

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { credentials, saveCredentials, validateCredentials, clearCredentials } = useCredentials();

  const handleOpen = () => {
    if (credentials) {
      setSupabaseUrl(credentials.supabaseUrl);
      setSupabaseAnonKey(credentials.supabaseAnonKey);
    }
    setError(null);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newCredentials = {
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
    };

    try {
      // Validate credentials format
      const validation = await validateCredentials(newCredentials);
      if (!validation.valid) {
        setError(validation.error || 'Invalid credentials');
        return;
      }

      // Save credentials
      const success = await saveCredentials(newCredentials);
      if (success) {
        setOpen(false);
        // Force page reload to reinitialize with new credentials
        window.location.reload();
      } else {
        setError('Failed to save credentials. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while saving credentials.');
      console.error('Settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCredentials = async () => {
    if (confirm('Are you sure you want to clear all credentials? This will require you to set them up again.')) {
      await clearCredentials();
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supabase Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="supabaseUrl" className="block text-sm font-medium mb-1">
              Supabase URL
            </label>
            <Input
              id="supabaseUrl"
              type="url"
              placeholder="https://your-project.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="supabaseAnonKey" className="block text-sm font-medium mb-1">
              Supabase Anon Key
            </label>
            <Input
              id="supabaseAnonKey"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearCredentials}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
