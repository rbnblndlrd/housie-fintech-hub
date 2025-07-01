
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleDebugger from '@/components/debug/RoleDebugger';
import RoleSwitcher from '@/components/profile/RoleSwitcher';

const CustomerSettings = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="autumn-title text-3xl font-bold">Customer Settings</h1>
      
      {/* Debug Panel - Remove this in production */}
      <RoleDebugger />
      
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
          <p className="autumn-text">Account settings will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSettings;
