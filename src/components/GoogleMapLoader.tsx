
import React, { useState, useEffect, useRef } from 'react';

interface GoogleMapLoaderProps {
  apiKey: string;
  libraries?: string[];
  onLoad: () => void;
  onError: (error: Error) => void;
  children: React.ReactNode;
  loadingElement?: React.ReactNode;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export const GoogleMapLoader: React.FC<GoogleMapLoaderProps> = ({
  apiKey,
  libraries = [],
  onLoad,
  onError,
  children,
  loadingElement
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackName = useRef(`initGoogleMaps_${Date.now()}`);

  useEffect(() => {
    // Check if Google Maps is already loaded and ready
    if (window.google && window.google.maps && window.google.maps.Map) {
      console.log('Google Maps already loaded and ready');
      setIsLoaded(true);
      onLoad();
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript && !isLoading) {
      console.log('Google Maps script already exists, waiting for load...');
      setIsLoading(true);
      
      // Set up a timeout to handle cases where the existing script fails
      timeoutRef.current = setTimeout(() => {
        const loadError = new Error('Google Maps failed to load (timeout)');
        console.error('Google Maps loading timeout');
        setError(loadError);
        setIsLoading(false);
        onError(loadError);
      }, 12000);

      // Poll for Google Maps availability with better checks
      const pollInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          clearInterval(pollInterval);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          console.log('Google Maps loaded via existing script');
          setIsLoaded(true);
          setIsLoading(false);
          onLoad();
        }
      }, 100);

      return () => {
        clearInterval(pollInterval);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    // Load Google Maps script if not already loading
    if (!isLoading && !existingScript) {
      const loadGoogleMaps = () => {
        setIsLoading(true);
        console.log('Loading Google Maps script...');

        // Validate API key
        if (!apiKey || apiKey.trim() === '') {
          const apiKeyError = new Error('Google Maps API key is missing or invalid');
          console.error('Google Maps API key validation failed');
          setError(apiKeyError);
          setIsLoading(false);
          onError(apiKeyError);
          return;
        }

        // Create callback function
        window[callbackName.current] = () => {
          console.log('Google Maps script loaded successfully');
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Double-check that all required objects are available
          if (window.google && window.google.maps && window.google.maps.Map) {
            setIsLoaded(true);
            setIsLoading(false);
            onLoad();
          } else {
            const loadError = new Error('Google Maps API loaded but missing required objects');
            console.error('Google Maps API incomplete after load');
            setError(loadError);
            setIsLoading(false);
            onError(loadError);
          }
          
          // Clean up callback
          delete window[callbackName.current];
        };

        // Create script element
        const script = document.createElement('script');
        const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${librariesParam}&callback=${callbackName.current}`;
        script.async = true;
        script.defer = true;

        // Handle script load errors
        script.onerror = (event) => {
          const loadError = new Error('Failed to load Google Maps script - check API key and network connection');
          console.error('Google Maps script failed to load:', event);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setError(loadError);
          setIsLoading(false);
          onError(loadError);
          // Clean up callback
          delete window[callbackName.current];
        };

        // Set up timeout
        timeoutRef.current = setTimeout(() => {
          const timeoutError = new Error('Google Maps loading timeout - check API key, billing, and network connection');
          console.error('Google Maps loading timeout');
          setError(timeoutError);
          setIsLoading(false);
          onError(timeoutError);
          // Clean up callback
          delete window[callbackName.current];
        }, 15000);

        // Add script to document
        document.head.appendChild(script);
      };

      loadGoogleMaps();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Clean up callback if it still exists
      if (window[callbackName.current]) {
        delete window[callbackName.current];
      }
    };
  }, [apiKey, libraries, onLoad, onError, isLoading]);

  if (error) {
    return null; // Let parent component handle error display
  }

  if (isLoading && !isLoaded) {
    return <>{loadingElement}</>;
  }

  if (isLoaded) {
    return <>{children}</>;
  }

  return <>{loadingElement}</>;
};
