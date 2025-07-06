import React from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { cn } from '@/lib/utils';

interface ProfileDynamicNavigationProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
  onRoleChange: (role: ProfileRole) => void;
}

interface RoleOption {
  key: ProfileRole; 
  label: string; 
  icon: string;
  disabled?: boolean;
}

const ProfileDynamicNavigation: React.FC<ProfileDynamicNavigationProps> = ({
  profile,
  selectedRole,
  onRoleChange,
}) => {
  const getAvailableRoles = (): Array<RoleOption> => {
    const roles: RoleOption[] = [
      { 
        key: 'personal', 
        label: 'Personal', 
        icon: '👤'
      },
      { 
        key: 'provider', 
        label: 'Provider', 
        icon: '🔧'
      },
      { 
        key: 'collective', 
        label: 'Collective', 
        icon: '👥'
      },
      { 
        key: 'crew', 
        label: 'Crews', 
        icon: '⚡'
      }
    ];

    return roles;
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border/50">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {availableRoles.map((role) => (
          <button
            key={role.key}
            onClick={() => !role.disabled && onRoleChange(role.key)}
            disabled={role.disabled}
            className={cn(
              "flex items-center justify-center p-4 rounded-xl transition-all duration-300 min-w-[64px] min-h-[64px] touch-manipulation",
              selectedRole === role.key
                ? "bg-primary text-primary-foreground shadow-lg scale-110"
                : role.disabled
                ? "opacity-50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
            )}
          >
            <span className="text-2xl" role="img" aria-label={role.label}>
              {role.icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileDynamicNavigation;