
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import BackButton from './BackButton';

interface ProviderProfileNavigationProps {
  providerName: string;
}

const ProviderProfileNavigation: React.FC<ProviderProfileNavigationProps> = ({ providerName }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <BackButton customPath="/services" customLabel="Back to Services" />
        
        <Button
          onClick={() => navigate('/services')}
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Browse More Providers
        </Button>
      </div>
      
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => navigate('/')}
              className="cursor-pointer flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => navigate('/services')}
              className="cursor-pointer"
            >
              Find Services
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {providerName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ProviderProfileNavigation;
