import React, { useState } from 'react';
import { UnifiedUserProfile } from '@/types/userProfile';
import { ProfileRole } from './UnifiedMobileProfile';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface RevolutionaryRoleSelectorProps {
  profile: UnifiedUserProfile;
  selectedRole: ProfileRole;
  onRoleChange: (role: ProfileRole) => void;
}

interface RoleOption {
  key: ProfileRole; 
  label: string; 
  icon: string;
  permissionLevel?: 'leader' | 'officer' | 'member' | null;
  disabled?: boolean;
}

const RevolutionaryRoleSelector: React.FC<RevolutionaryRoleSelectorProps> = ({
  profile,
  selectedRole,
  onRoleChange,
}) => {
  const [collectiveMode, setCollectiveMode] = useState(false);
  const [crewsMode, setCrewsMode] = useState(false);

  const getAvailableRoles = (): Array<RoleOption> => {
    const roles: RoleOption[] = [
      { 
        key: 'personal', 
        label: 'Personal', 
        icon: '👤'
      }
    ];

    // Add provider role if user can provide services
    if (profile.can_provide_services) {
      roles.push({ 
        key: 'provider', 
        label: 'Provider', 
        icon: '🔧'
      });
    }

    // Add collective role (always available for customers)
    if (profile.can_book_services !== false) {
      roles.push({ 
        key: 'collective', 
        label: 'Collective', 
        icon: '👥'
      });
    }

    // Add crew roles based on business name (providers with crews)
    if (profile.can_provide_services && profile.business_name) {
      roles.push({ 
        key: 'crew', 
        label: `Crews: ${profile.business_name}`, 
        icon: '⚡',
        permissionLevel: 'leader'
      });
    }

    // Add additional crew slots (example of expandable crew system)
    if (profile.can_provide_services) {
      roles.push({ 
        key: 'crew', 
        label: 'Crews: ×', 
        icon: '⚡',
        disabled: true
      });
    }

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
    <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/50">
      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center md:justify-between md:p-6">
        {/* Left: Role Context */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Profile Context
          </p>
          <p className="text-lg font-medium text-foreground">
            {getRoleDisplayType(selectedRole)}
          </p>
        </div>

        {/* Center: Icon Tabs */}
        <div className="flex gap-2 mx-8">
          {availableRoles.map((role) => (
            <button
              key={`${role.key}-${role.label}`}
              onClick={() => !role.disabled && onRoleChange(role.key)}
              disabled={role.disabled}
              title={role.label}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 relative overflow-hidden",
                selectedRole === role.key
                  ? "bg-primary text-primary-foreground shadow-lg scale-110 ring-2 ring-primary/30"
                  : role.disabled
                  ? "bg-muted/30 text-muted-foreground/50 opacity-50 cursor-not-allowed"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground opacity-75 hover:opacity-100 hover:scale-105"
              )}
            >
              {selectedRole === role.key && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-90 -z-10" />
              )}
              <span className="text-xl" role="img" aria-label={role.label}>
                {role.icon}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Toggle Switches */}
        <div className="flex-1 flex justify-end">
          {selectedRole === 'personal' && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Collective Mode</span>
              <Switch 
                checked={collectiveMode} 
                onCheckedChange={setCollectiveMode}
              />
            </div>
          )}
          {selectedRole === 'provider' && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Crews Mode</span>
              <Switch 
                checked={crewsMode} 
                onCheckedChange={setCrewsMode}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-3">
        {/* Role Context Header */}
        <div className="mb-3 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Profile Context
          </p>
          <p className="text-sm font-medium text-foreground">
            {getRoleDisplayType(selectedRole)}
          </p>
        </div>

        {/* Icon-only tabs */}
        <div className="flex gap-2 justify-center mb-3">
          {availableRoles.map((role) => (
            <button
              key={`${role.key}-${role.label}`}
              onClick={() => !role.disabled && onRoleChange(role.key)}
              disabled={role.disabled}
              title={role.label}
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-300 relative overflow-hidden touch-manipulation",
                selectedRole === role.key
                  ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary/30"
                  : role.disabled
                  ? "bg-muted/30 text-muted-foreground/50 opacity-50 cursor-not-allowed"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground opacity-75 hover:opacity-100"
              )}
            >
              {selectedRole === role.key && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-90 -z-10" />
              )}
              <span className="text-lg" role="img" aria-label={role.label}>
                {role.icon}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Toggle Switches */}
        {selectedRole === 'personal' && (
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-sm font-medium">Collective</span>
            <Switch 
              checked={collectiveMode} 
              onCheckedChange={setCollectiveMode}
            />
          </div>
        )}
        {selectedRole === 'provider' && (
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-sm font-medium">Crews</span>
            <Switch 
              checked={crewsMode} 
              onCheckedChange={setCrewsMode}
            />
          </div>
        )}

        {/* Role Switch Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {selectedRole === 'personal' && 'Your personal activity and connections'}
            {selectedRole === 'provider' && 'Professional service performance'}
            {selectedRole === 'collective' && 'Group booking and community projects'}
            {selectedRole === 'crew' && 'Team leadership and crew management'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevolutionaryRoleSelector;