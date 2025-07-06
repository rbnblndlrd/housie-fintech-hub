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
      },
      { 
        key: 'provider', 
        label: 'Provider', 
        icon: '🔧',
        description: 'Professional service performance'
      },
      { 
        key: 'collective', 
        label: 'Collective', 
        icon: '👥',
        description: 'Group booking and community'
      },
      { 
        key: 'crew', 
        label: 'Crews', 
        icon: '⚡',
        description: 'Team coordination and projects'
      }
    ];

    return roles;
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="w-80 bg-card/95 backdrop-blur-sm border-r-4 border-border/30 h-full">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-8">Profile Sections</h2>
        
        <div className="space-y-4">
          {availableRoles.map((role) => (
            <button
              key={role.key}
              onClick={() => !role.disabled && onRoleChange(role.key)}
              disabled={role.disabled}
              className={cn(
                "w-full flex items-center gap-6 px-6 py-6 rounded-2xl transition-all duration-300 text-left group bg-background/50 border-2 border-border/20 hover:border-primary/30",
                selectedRole === role.key
                  ? "bg-primary text-primary-foreground shadow-2xl ring-2 ring-primary/50 border-primary"
                  : role.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-background/80 hover:shadow-xl"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 border-2",
                selectedRole === role.key
                  ? "bg-primary-foreground/20 shadow-lg border-primary-foreground/30"
                  : "bg-muted/20 border-muted/40 group-hover:bg-muted/40 group-hover:shadow-md group-hover:border-primary/30"
              )}>
                <span className="text-3xl" role="img" aria-label={role.label}>
                  {role.icon}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-xl font-bold mb-2",
                  selectedRole === role.key ? "text-primary-foreground" : "text-foreground"
                )}>
                  {role.label}
                </div>
                <div className={cn(
                  "text-sm leading-relaxed",
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