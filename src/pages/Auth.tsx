import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "../hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { isSupabaseConfigured } from "../integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showConfigAlert, setShowConfigAlert] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    setShowConfigAlert(!isSupabaseConfigured());
    
    // If user is already authenticated, redirect to dashboard
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <LanguageSelector />
        </div>

        {/* Configuration Alert */}
        {showConfigAlert && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Setup Required:</strong> Supabase authentication needs to be configured.
              <Button 
                variant="link" 
                className="text-orange-600 p-0 h-auto ml-1"
                onClick={() => window.open('/SUPABASE_SETUP_GUIDE.md', '_blank')}
              >
                View Setup Guide
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Auth Modal - Always open on this page */}
        <AuthModal 
          open={true} 
          onClose={() => navigate('/')}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
};

export default Auth;