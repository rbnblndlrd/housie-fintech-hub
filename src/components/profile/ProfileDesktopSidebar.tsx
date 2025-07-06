import React from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { cn } from '@/lib/utils';

interface ProfileDesktopSidebarProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
  onRoleChange: (role: ProfileRole) => void;
}

interface RoleOption {
  key: ProfileRole; 
  label: string; 
  icon: string;
  description: string;
  disabled?: boolean;
}

const ProfileDesktopSidebar: React.FC<ProfileDesktopSidebarProps> = ({
  profile,
  selectedRole,
  onRoleChange,
}) => {
  const getAvailableRoles = (): Array<RoleOption> => {
    const roles: RoleOption[] = [
      { 
        key: 'personal', 
        label: 'Personal', 
        icon: '👤',
        description: 'Personal stats and activity'
      }
    ];

    // Add provider role if user can provide services
    if (profile.can_provide_services) {
      roles.push({ 
        key: 'provider', 
        label: 'Provider', 
        icon: '🔧',
        description: 'Professional service performance'
      });
    }

    // Add collective role (always available for customers)
    if (profile.can_book_services !== false) {
      roles.push({ 
        key: 'collective', 
        label: 'Collective', 
        icon: '👥',
        description: 'Group booking and community'
      });
    }

    // Add crew roles based on business name (providers with crews)
    if (profile.can_provide_services && profile.business_name) {
      roles.push({ 
        key: 'crew', 
        label: 'Crews', 
        icon: '⚡',
        description: 'Team leadership and management'
      });
    }

    return roles;
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="w-64 bg-card/80 backdrop-blur-sm border-r border-border/50 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Profile Sections</h2>
        
        <div className="space-y-2">
          {availableRoles.map((role) => (
            <button
              key={role.key}
              onClick={() => !role.disabled && onRoleChange(role.key)}
              disabled={role.disabled}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 text-left group",
                selectedRole === role.key
                  ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30"
                  : role.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                selectedRole === role.key
                  ? "bg-primary-foreground/20"
                  : "bg-muted/30 group-hover:bg-muted/50"
              )}>
                <span className="text-2xl" role="img" aria-label={role.label}>
                  {role.icon}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium mb-1">
                  {role.label}
                </div>
                <div className={cn(
                  "text-sm leading-tight",
                  selectedRole === role.key
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}>
                  {role.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDesktopSidebar;