
import React, { createContext, useContext } from 'react';
import { QueryClient as TanStackQueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new TanStackQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryClientContextType {
  queryClient: TanStackQueryClient;
}

const QueryClientContext = createContext<QueryClientContextType | undefined>(undefined);

export const useQueryClient = () => {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error('useQueryClient must be used within a QueryClient provider');
  }
  return context;
};

export const QueryClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryClientContext.Provider value={{ queryClient }}>
        {children}
      </QueryClientContext.Provider>
    </QueryClientProvider>
  );
};
