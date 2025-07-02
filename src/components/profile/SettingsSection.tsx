import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuickSettingsPanel from '@/components/header/QuickSettingsPanel';
import { Settings } from 'lucide-react';

const SettingsSection: React.FC = () => {
  return (
    <Card className="fintech-card bg-gray-50/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          General Settings & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QuickSettingsPanel />
      </CardContent>
    </Card>
  );
};

export default SettingsSection;