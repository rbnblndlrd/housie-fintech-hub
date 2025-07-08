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
      {/* Back Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-lg text-slate-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <div className="border-2 border-border rounded-lg overflow-hidden h-full">
        <GPSNavigationMap />
      </div>
    </div>
  );
};

export default GPS;