import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GPSNavigationMap from '@/components/map/GPSNavigationMap';

const GPS = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-background z-50 p-2">
      {/* Back Navigation - Above Job Hub tab */}
      <div className="absolute top-[100px] left-[22px] z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-lg text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="border-2 border-border rounded-lg overflow-hidden h-full">
        <GPSNavigationMap />
      </div>
    </div>
  );
};

export default GPS;