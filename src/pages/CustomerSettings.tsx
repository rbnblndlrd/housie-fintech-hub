
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleDebugger from '@/components/debug/RoleDebugger';
import RoleSwitcher from '@/components/profile/RoleSwitcher';
import { BroadcastControlsCard } from '@/components/stamps/BroadcastControlsCard';
import { CanonIdentitySettings } from '@/components/stamps/CanonIdentitySettings';
import { StampEquipMenu } from '@/components/stamps/StampEquipMenu';
import { Settings, Radio, Sparkles, Medal } from 'lucide-react';

const CustomerSettings = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Customer Settings</h1>
      
      {/* Debug Panel - Remove this in production */}
      <RoleDebugger />
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="broadcast" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Broadcast
          </TabsTrigger>
          <TabsTrigger value="canon" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Canon Identity
          </TabsTrigger>
          <TabsTrigger value="stamps" className="flex items-center gap-2">
            <Medal className="h-4 w-4" />
            Stamps
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <RoleSwitcher />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Account settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="broadcast" className="space-y-6">
          <BroadcastControlsCard />
        </TabsContent>
        
        <TabsContent value="canon" className="space-y-6">
          <CanonIdentitySettings />
        </TabsContent>
        
        <TabsContent value="stamps" className="space-y-6">
          <StampEquipMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerSettings;
