
import React from 'react';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase } from 'lucide-react';

const DashboardRoleToggle = () => {
  const { currentRole, availableRoles, switchRole } = useRoleSwitch();

  // Only show if user has multiple roles available
  if (availableRoles.length <= 1) {
    return null;
  }

  const handleRoleToggle = async (checked: boolean) => {
    const newRole = checked ? 'provider' : 'customer';
    try {
      await switchRole(newRole);
    } catch (error) {
      console.error('Role switch failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          {currentRole === 'customer' ? (
            <>
              <User className="h-3 w-3" />
              Customer
            </>
          ) : (
            <>
              <Briefcase className="h-3 w-3" />
              Provider
            </>
          )}
        </Badge>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`text-sm ${currentRole === 'customer' ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
          Customer
        </span>
        <Switch
          checked={currentRole === 'provider'}
          onCheckedChange={handleRoleToggle}
          className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-blue-600"
        />
        <span className={`text-sm ${currentRole === 'provider' ? 'font-medium text-orange-600' : 'text-gray-500'}`}>
          Provider
        </span>
      </div>
    </div>
  );
};

export default DashboardRoleToggle;
