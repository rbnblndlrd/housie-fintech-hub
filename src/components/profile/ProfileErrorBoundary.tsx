import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ProfileErrorBoundaryClass extends React.Component<
  React.PropsWithChildren<{}>,
  ProfileErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ProfileErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ProfileErrorBoundary: Component crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ProfileErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ProfileErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Profile Loading Error</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We encountered an issue loading your profile. This might be a temporary problem.
          </p>
          
          {error && (
            <details className="text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Error Details
              </summary>
              <pre className="text-xs bg-muted/50 p-2 rounded mt-2 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" onClick={handleGoHome} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileErrorBoundaryClass;