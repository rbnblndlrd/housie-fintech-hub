import React from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { cn } from '@/lib/utils';

interface RevolutionaryRoleSelectorProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
  onRoleChange: (role: ProfileRole) => void;
}

const RevolutionaryRoleSelector: React.FC<RevolutionaryRoleSelectorProps> = ({
  profile,
  selectedRole,
  onRoleChange,
}) => {
  const getAvailableRoles = (): Array<{ 
    key: ProfileRole; 
    label: string; 
    icon: string;
    permissionLevel?: 'leader' | 'officer' | 'member' | null;
    disabled?: boolean;
  }> => {
    const roles = [
      { 
        key: 'personal' as ProfileRole, 
        label: 'Personal', 
        icon: '👤'
      }
    ];

    // Add provider role if user can provide services
    if (profile.can_provide_services) {
      roles.push({ 
        key: 'provider' as ProfileRole, 
        label: 'Provider', 
        icon: '🔧'
      });
    }

    // Add collective role (always available for customers)
    if (profile.can_book_services !== false) {
      roles.push({ 
        key: 'collective' as ProfileRole, 
        label: 'Collective', 
        icon: '👥'
      });
    }

    // Add crew roles based on business name (providers with crews)
    if (profile.can_provide_services && profile.business_name) {
      roles.push({ 
        key: 'crew' as ProfileRole, 
        label: `Crews: ${profile.business_name}`, 
        icon: '⚡',
        permissionLevel: 'leader' // Mock permission level - could be dynamic
      });
    }

    // Add additional crew slots (example of expandable crew system)
    if (profile.can_provide_services) {
      roles.push({ 
        key: 'crew' as ProfileRole, 
        label: 'Crews: ×', 
        icon: '⚡',
        disabled: true // Disabled until user creates/joins a crew
      });
    }

    console.log('🎭 Revolutionary Role Selector: Available roles:', roles.map(r => r.key));
    return roles;
  };

  const availableRoles = getAvailableRoles();

  const getRoleDisplayType = (role: ProfileRole): string => {
    switch (role) {
      case 'personal': return 'Personal Stats';
      case 'provider': return 'Provider Performance';
      case 'collective': return 'Collective Impact';
      case 'crew': return 'Crew Leadership';
      default: return '';
    }
  };

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border/50">
      {/* Role Context Header */}
      <div className="mb-3 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Profile Context
        </p>
        <p className="text-sm font-medium text-foreground">
          {getRoleDisplayType(selectedRole)}
        </p>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {availableRoles.map((role) => (
          <button
            key={`${role.key}-${role.label}`}
            onClick={() => !role.disabled && onRoleChange(role.key)}
            disabled={role.disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-300 min-h-[52px] touch-manipulation relative overflow-hidden",
              selectedRole === role.key
                ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary/30"
                : role.disabled
                ? "bg-muted/30 text-muted-foreground/50 opacity-50 cursor-not-allowed"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground opacity-75 hover:opacity-100 hover:scale-102"
            )}
          >
            {/* Background gradient for active role */}
            {selectedRole === role.key && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-90 -z-10" />
            )}
            
            {/* Role Icon */}
            <span className="text-lg" role="img" aria-label={role.label}>
              {role.icon}
            </span>
            
            {/* Role Label */}
            <span className="text-sm font-medium">{role.label}</span>
            
            {/* Permission Level Indicator */}
            {role.permissionLevel && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                selectedRole === role.key 
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/20 text-primary"
              )}>
                {role.permissionLevel}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Role Switch Info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">
          {selectedRole === 'personal' && 'Your personal activity and connections'}
          {selectedRole === 'provider' && 'Professional service performance'}
          {selectedRole === 'collective' && 'Group booking and community projects'}
          {selectedRole === 'crew' && 'Team leadership and crew management'}
        </p>
      </div>
    </div>
  );
};

export default RevolutionaryRoleSelector;