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
        description: 'Individual profile and activity'
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
        description: 'Team coordination and projects'
      });
    }

    return roles;
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="w-80 fintech-card border-r-4 border-border/30 h-full">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-8 fintech-text-header">Profile Sections</h2>
        
        <div className="space-y-4">
          {availableRoles.map((role) => (
            <button
              key={role.key}
              onClick={() => !role.disabled && onRoleChange(role.key)}
              disabled={role.disabled}
              className={cn(
                "w-full flex items-center gap-6 px-6 py-6 rounded-2xl transition-all duration-300 text-left group fintech-card-base",
                selectedRole === role.key
                  ? "bg-primary text-primary-foreground shadow-2xl ring-4 ring-primary/30 transform scale-105"
                  : role.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-xl hover:transform hover:scale-102"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
                selectedRole === role.key
                  ? "bg-primary-foreground/20 shadow-lg"
                  : "bg-muted/30 group-hover:bg-muted/50 group-hover:shadow-md"
              )}>
                <span className="text-3xl" role="img" aria-label={role.label}>
                  {role.icon}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-xl font-bold mb-2",
                  selectedRole === role.key ? "text-primary-foreground" : "fintech-text-header"
                )}>
                  {role.label}
                </div>
                <div className={cn(
                  "text-sm leading-relaxed",
                  selectedRole === role.key
                    ? "text-primary-foreground/80"
                    : "fintech-text-secondary"
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