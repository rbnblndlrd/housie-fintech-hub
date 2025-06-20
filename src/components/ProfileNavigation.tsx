
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

interface ProfileNavigationProps {
  profileType: 'customer' | 'provider';
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ profileType }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Try to go back in browser history, fallback to dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/customer-dashboard');
    }
  };

  const dashboardLabel = profileType === 'provider' ? 'Provider Dashboard' : 'Customer Dashboard';
  const dashboardHref = profileType === 'provider' ? '/analytics' : '/customer-dashboard';

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
          onClick={() => navigate(dashboardHref)}
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Go to Dashboard
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
              onClick={() => navigate(dashboardHref)}
              className="cursor-pointer"
            >
              {dashboardLabel}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              Profile
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ProfileNavigation;
