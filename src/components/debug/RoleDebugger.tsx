
import React from 'react';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RoleDebugger = () => {
  const { currentRole, availableRoles, canSwitchToProvider, forceRefresh } = useRoleSwitch();
  const { user } = useAuth();

  const checkDatabaseDirectly = async () => {
    if (!user) return;
    
    console.log('🔍 Direct database check for user:', user.email);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    console.log('📊 Direct database result:', { data, error });
    alert(`Database check: can_provide_services = ${data?.can_provide_services} (type: ${typeof data?.can_provide_services})`);
  };

  const updateProviderStatus = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ can_provide_services: true })
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error updating provider status:', error);
      alert('Error updating provider status');
    } else {
      console.log('✅ Provider status updated');
      alert('Provider status updated to true');
      // Force refresh the context
      if (forceRefresh) {
        await forceRefresh();
      }
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800">Role Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Current Role:</strong> {currentRole}
          </div>
          <div>
            <strong>Available Roles:</strong> {availableRoles.join(', ')}
          </div>
          <div>
            <strong>Can Switch to Provider:</strong> {canSwitchToProvider ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User Email:</strong> {user.email}
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button onClick={checkDatabaseDirectly} variant="outline" size="sm">
            Check Database Directly
          </Button>
          <Button onClick={updateProviderStatus} variant="outline" size="sm">
            Force Enable Provider
          </Button>
          {forceRefresh && (
            <Button onClick={forceRefresh} variant="outline" size="sm">
              Force Refresh Context
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleDebugger;
