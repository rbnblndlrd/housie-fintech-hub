
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCredentials } from "../contexts/CredentialsContext";

const SetupScreen = () => {
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { saveCredentials, validateCredentials } = useCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const credentials = {
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
    };

    try {
      // Validate credentials format
      const validation = await validateCredentials(credentials);
      if (!validation.valid) {
        setError(validation.error || 'Invalid credentials');
        return;
      }

      // Save credentials
      const success = await saveCredentials(credentials);
      if (!success) {
        setError('Failed to save credentials. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while saving credentials.');
      console.error('Setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl">Housie Admin</span>
          </div>
          <CardTitle>Initial Setup</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your Supabase credentials to get started
          </p>
        </CardHeader>
        <CardContent>
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
              <p className="text-xs text-muted-foreground mt-1">
                Found in your Supabase project settings
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                Found in your Supabase project API settings
              </p>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Continue"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="font-medium text-sm mb-2">Where to find your credentials:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Go to your Supabase dashboard</li>
              <li>• Navigate to Settings → API</li>
              <li>• Copy the Project URL and anon/public key</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupScreen;
