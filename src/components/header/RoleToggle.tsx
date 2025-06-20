
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useRole } from '@/contexts/RoleContext';

const RoleToggle = () => {
  const { currentRole, toggleRole } = useRole();

  const handleRoleToggle = (checked: boolean) => {
    console.log('🔧 Role switch toggled to:', checked ? 'provider' : 'customer');
    toggleRole();
  };

  // Comprehensive event handling for the switch container
  const handleSwitchEvent = (e: React.MouseEvent) => {
    console.log('🔧 Switch event triggered:', e.type);
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
      <span className={`text-xs ${currentRole === 'customer' ? 'font-medium text-white' : 'text-gray-400'}`}>
        Client
      </span>
      <div
        onPointerDown={handleSwitchEvent}
        onMouseDown={handleSwitchEvent}
        onClick={handleSwitchEvent}
        onContextMenu={handleSwitchEvent}
      >
        <Switch
          checked={currentRole === 'provider'}
          onCheckedChange={handleRoleToggle}
          className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600"
        />
      </div>
      <span className={`text-xs ${currentRole === 'provider' ? 'font-medium text-white' : 'text-gray-400'}`}>
        Prestataire
      </span>
    </div>
  );
};

export default RoleToggle;
