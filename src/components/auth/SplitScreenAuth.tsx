
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { Loader2, Mail, Lock, Github } from 'lucide-react';

const SplitScreenAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      toast({
        title: "Sign-in failed",
        description: error.message || "Unable to sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      toast({
        title: "Sign-up failed",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Video Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.6)' }}
        >
          <source src="/8f29cd4b-fed7-49b8-a5b9-018157280b00.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <img 
              src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
              alt="HOUSIE" 
              className="h-12 w-auto"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/lovable-uploads/243ecf21-712f-439a-9efc-a299b76af346.png';
              }}
            />
          </div>
          
          {/* Testimonial */}
          <div className="space-y-6">
            <blockquote className="text-xl font-medium leading-relaxed">
              "HOUSIE has transformed how I find reliable home services. The quality of providers and ease of booking is unmatched."
            </blockquote>
            <div className="space-y-1">
              <div className="font-semibold">Sarah Mitchell</div>
              <div className="text-white/80">Homeowner, Montreal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <img 
              src="/lovable-uploads/a4e647f0-865a-42ef-a0cc-19226d5f0a35.png" 
              alt="HOUSIE" 
              className="h-12 w-auto mx-auto mb-6"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/lovable-uploads/243ecf21-712f-439a-9efc-a299b76af346.png';
              }}
            />
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="autumn-title text-3xl font-bold">Welcome to HOUSIE</h1>
            <p className="mt-2 autumn-text">Your trusted home services platform</p>
          </div>

          {/* Auth Form */}
          <div className="space-y-6">
            <GoogleSignInButton />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 autumn-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 autumn-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full autumn-button-primary"
                    disabled={loading || !email || !password}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 autumn-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Choose a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 autumn-input"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full autumn-button-primary"
                    disabled={loading || !email || !password}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* GitHub Sign In Button */}
            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 hover:bg-gray-50"
              onClick={() => {
                // Placeholder for GitHub auth
                toast({
                  title: "Coming Soon",
                  description: "GitHub authentication will be available soon.",
                });
              }}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              <p>
                By continuing, you agree to our{' '}
                <a href="#" className="underline hover:text-gray-800">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-gray-800">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenAuth;
