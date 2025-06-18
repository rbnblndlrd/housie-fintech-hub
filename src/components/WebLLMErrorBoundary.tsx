
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export class WebLLMErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 WebLLM Error Boundary caught error:', error);
    return {
      hasError: true,
      error,
      errorInfo: error.message || 'Unknown error occurred'
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 WebLLM Error Boundary details:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: ''
    });
    
    // Force a page reload as last resort
    setTimeout(() => {
      if (this.state.hasError) {
        window.location.reload();
      }
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-3">
                <div>
                  <strong>WebLLM Error Detected</strong>
                  <p className="text-sm mt-1">
                    {this.state.errorInfo}
                  </p>
                </div>
                
                <div className="text-xs text-red-600 font-mono bg-red-100 p-2 rounded">
                  {this.state.error?.stack?.slice(0, 200)}...
                </div>
                
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry WebLLM
                </Button>
                
                <p className="text-xs text-red-600">
                  Note: The AI will continue working with intelligent fallback responses.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
