import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Loader2, Shield } from 'lucide-react';
import { signOut } from '../integrations/supabase/client';

interface SecureLogoutProps {
  onLogout?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const SecureLogout = ({ onLogout, variant = 'outline', size = 'default', className }: SecureLogoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSecureLogout = async () => {
    setIsLoading(true);
    
    try {
      // Sign out from Supabase
      const { error } = await signOut();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      
      // Clear any cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      toast({
        title: "Logged Out Successfully",
        description: "You have been securely logged out. All session data has been cleared.",
      });
      
      // Call onLogout callback if provided
      if (onLogout) {
        onLogout();
      }
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if there's an error, clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      toast({
        title: "Logout Warning",
        description: "There was an issue during logout, but local data has been cleared.",
        variant: "destructive",
      });
      
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Logging Out...' : 'Logout'}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-orange-600" />
            Secure Logout
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? This will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>End your current session securely</li>
              <li>Clear all stored authentication data</li>
              <li>Remove cached information</li>
              <li>Sign you out from all connected services</li>
              <li>Redirect you to the home page</li>
            </ul>
            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Security Note:</strong> This ensures complete data privacy and prevents unauthorized access to your account.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSecureLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging Out...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Yes, Logout Securely
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SecureLogout;