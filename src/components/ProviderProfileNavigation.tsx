
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface ProviderProfileNavigationProps {
  providerName: string;
}

const ProviderProfileNavigation: React.FC<ProviderProfileNavigationProps> = ({ providerName }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Try to go back in browser history, fallback to services page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
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
