
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleSignInButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      console.log('🚀 Starting Google OAuth flow with popup configuration...');
      
      // Check if popups are blocked
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (!testPopup || testPopup.closed) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      testPopup.close();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        
        // Handle specific error types
        let errorMessage = 'Unable to sign in with Google. Please try again.';
        
        if (error.message.includes('popup')) {
          errorMessage = 'Popup was blocked. Please allow popups and try again.';
        } else if (error.message.includes('access_denied')) {
          errorMessage = 'Access was denied. Please try signing in again.';
        } else if (error.message.includes('domain')) {
          errorMessage = 'Domain configuration issue. Please contact support.';
        } else if (error.message.includes('unauthorized')) {
          errorMessage = 'Google Sign-In configuration error. Please contact support.';
        }
        
        toast({
          title: "Sign-In Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return;
      }

      // OAuth initiated successfully - redirect should happen
      console.log('✅ Google OAuth initiated successfully, redirecting...');
      
      // Add a timeout to detect if redirect doesn't happen
      setTimeout(() => {
        if (window.location.pathname === '/auth') {
          console.log('⚠️  Still on auth page after 5 seconds, something may be wrong');
          toast({
            title: "Sign-In Taking Long",
            description: "If nothing happens, please try again or check if popups are blocked.",
            variant: "default",
          });
          setIsLoading(false);
        }
      }, 5000);
      
    } catch (error) {
      console.error('💥 Unexpected error during Google Sign-In:', error);
      toast({
        title: "Sign-In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      variant="outline"
      className="w-full flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-colors"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {isLoading ? 'Opening Google Sign-In...' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleSignInButton;
