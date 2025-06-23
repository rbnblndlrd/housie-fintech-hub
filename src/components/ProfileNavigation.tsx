
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

interface ProfileNavigationProps {
  profileType: 'customer' | 'provider';
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ profileType }) => {
  const navigate = useNavigate();

  const dashboardLabel = profileType === 'provider' ? 'Provider Dashboard' : 'Customer Dashboard';
  const dashboardHref = profileType === 'provider' ? '/analytics' : '/customer-dashboard';

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <BackButton />
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
