
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    console.log('🧪 NavigationTest mounted:', {
      hasNavigate: typeof navigate === 'function',
      hasLocation: !!location,
      currentPath: location?.pathname,
      routerReady: !!(navigate && location)
    });
  }, [navigate, location]);

  const testNavigation = (path: string) => {
    console.log('🧪 Testing navigation to:', path);
    try {
      navigate(path);
      console.log('✅ Test navigation successful');
    } catch (error) {
      console.error('❌ Test navigation failed:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-50">
      <div>Router Test</div>
      <div>Navigate: {typeof navigate === 'function' ? '✅' : '❌'}</div>
      <div>Location: {location?.pathname || '❌'}</div>
      <button 
        onClick={() => testNavigation('/services')}
        className="bg-white text-red-500 px-2 py-1 rounded mt-1 text-xs"
      >
        Test Nav
      </button>
    </div>
  );
};

export default NavigationTest;
