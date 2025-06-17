
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="fintech-card max-w-md w-full text-center">
        <CardHeader className="p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-black text-white">404</span>
          </div>
          <CardTitle className="text-3xl font-black text-gray-900 mb-2">
            Page introuvable
          </CardTitle>
          <p className="text-lg text-gray-600">
            Oups! La page que vous recherchez n'existe pas.
          </p>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="space-y-4">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full h-12 rounded-2xl border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-[0_4px_15px_-2px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_-2px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
