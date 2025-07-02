
import React, { useEffect } from 'react';
import { useDynamicGradients } from '@/hooks/useDynamicGradients';

interface DynamicGradientProviderProps {
  children: React.ReactNode;
}

const DynamicGradientProvider: React.FC<DynamicGradientProviderProps> = ({ children }) => {
  useDynamicGradients();
  
  return <>{children}</>;
};

export default DynamicGradientProvider;
