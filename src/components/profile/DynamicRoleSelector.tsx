import React from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { User, Briefcase, Users, Building2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicRoleSelectorProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
  onRoleChange: (role: ProfileRole) => void;
}

const DynamicRoleSelector: React.FC<DynamicRoleSelectorProps> = ({
  profile,
  selectedRole,
  onRoleChange,
}) => {
  const getAvailableRoles = (): Array<{ key: ProfileRole; label: string; icon: React.ReactNode }> => {
    const roles = [
      { key: 'personal' as ProfileRole, label: 'Personal', icon: <User className="h-4 w-4" /> }
    ];

    // Add provider role if user can provide services
    if (profile.can_provide_services) {
      roles.push({ 
        key: 'provider' as ProfileRole, 
        label: 'Provider', 
        icon: <Briefcase className="h-4 w-4" /> 
      });
    }

    // Add customer role if user can book services (default for all users)
    if (profile.can_book_services !== false) { // Default to true if not specified
      roles.push({ 
        key: 'customer' as ProfileRole, 
        label: 'Customer', 
        icon: <User className="h-4 w-4" /> 
      });
    }

    // Add crew role if provider with business name
    if (profile.can_provide_services && profile.business_name) {
      roles.push({ 
        key: 'crew' as ProfileRole, 
        label: `Crew: ${profile.business_name}`, 
        icon: <Users className="h-4 w-4" /> 
      });
    }

    // Add collective role for customers (example collective)
    if (profile.can_book_services !== false) {
      roles.push({ 
        key: 'collective' as ProfileRole, 
        label: 'Collective: Home Reno', 
        icon: <Building2 className="h-4 w-4" /> 
      });
    }

    console.log('🎭 DynamicRoleSelector: Available roles:', roles.map(r => r.key));
    return roles;
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-2">
      {/* Horizontal Scrollable Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {availableRoles.map((role) => (
          <button
            key={role.key}
            onClick={() => onRoleChange(role.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-200 min-h-[44px] touch-manipulation",
              selectedRole === role.key
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground opacity-80 hover:opacity-100"
            )}
          >
            {role.icon}
            <span className="text-sm font-medium">{role.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DynamicRoleSelector;