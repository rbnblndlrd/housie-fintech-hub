
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { User, Wrench, Loader2 } from 'lucide-react';

const RoleToggleSwitch = () => {
  const { user } = useAuth();
  const { currentRole, switchRole } = useRoleSwitch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = async (checked: boolean) => {
    if (!user) return;
    
    const newRole = checked ? 'provider' : 'customer';
    setIsLoading(true);
    
    try {
      // Update the role using the context
      await switchRole(newRole);
      
      toast({
        title: "Role Updated",
        description: `Successfully switched to ${newRole} mode`,
      });
      
      // The dashboard will automatically refresh through the context
      
    } catch (error) {
      console.error('Error switching role:', error);
      toast({
        title: "Error",
        description: "Failed to switch role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 transition-colors ${
          currentRole === 'customer' ? 'text-blue-600 font-medium' : 'text-gray-500'
        }`}>
          <User className="h-4 w-4" />
          <span className="text-sm">Customer</span>
        </div>
        
        <div className="relative">
          {isLoading ? (
            <div className="w-11 h-6 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            </div>
          ) : (
            <Switch
              checked={currentRole === 'provider'}
              onCheckedChange={handleRoleToggle}
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
              disabled={isLoading}
            />
          )}
        </div>
        
        <div className={`flex items-center gap-2 transition-colors ${
          currentRole === 'provider' ? 'text-blue-600 font-medium' : 'text-gray-500'
        }`}>
          <Wrench className="h-4 w-4" />
          <span className="text-sm">Provider</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Current: {currentRole === 'customer' ? 'Customer' : 'Provider'}
      </div>
    </div>
  );
};

export default RoleToggleSwitch;
