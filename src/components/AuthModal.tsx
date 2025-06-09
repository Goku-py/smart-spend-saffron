import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, AlertCircle, Shield, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword, 
  isFirebaseConfigured
} from "../lib/firebase";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ open, onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [gdprConsent, setGdprConsent] = useState({
    marketing: false,
    analytics: false,
    required: false
  });
  const { toast } = useToast();

  // Enhanced password strength validation
  const validatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(validatePasswordStrength(value));
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-500' };
      case 2: return { text: 'Weak', color: 'text-orange-500' };
      case 3: return { text: 'Fair', color: 'text-yellow-500' };
      case 4: return { text: 'Good', color: 'text-blue-500' };
      case 5: return { text: 'Strong', color: 'text-green-500' };
      default: return { text: '', color: '' };
    }
  };

  // Demo mode fallback (only when Firebase is not configured)
  const activateDemoMode = (email: string) => {
    const mockUser = {
      id: 'demo-user-' + Date.now(),
      email: email,
      user_metadata: { full_name: email.split('@')[0] },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const mockSession = {
      user: mockUser,
      timestamp: Date.now()
    };
    
    localStorage.setItem('demo_user', JSON.stringify(mockUser));
    localStorage.setItem('demo_session', JSON.stringify(mockSession));
    
    toast({
      title: "Demo Mode Activated",
      description: "You're now signed in using demo mode for testing.",
    });
    
    onSuccess();
    onClose();
  };

  // Enhanced Email Authentication
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup' && !fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // GDPR consent validation for signup
    if (mode === 'signup' && !gdprConsent.required) {
      toast({
        title: "Privacy Policy Required",
        description: "Please accept our Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Enhanced signup with GDPR compliance
        if (isFirebaseConfigured()) {
          try {
            const { user, error } = await signUpWithEmail(
              email, 
              password, 
              fullName,
              {
                marketing: gdprConsent.marketing,
                analytics: gdprConsent.analytics
              }
            );
            
            if (error) {
              throw new Error(error);
            }

            if (user) {
              toast({
                title: "Account Created! 🎉",
                description: "Please check your email to verify your account.",
              });
              onSuccess();
              onClose();
              return;
            }
          } catch (firebaseError: any) {
            console.warn('Firebase signup failed:', firebaseError);
            throw firebaseError;
          }
        }

        // Fallback to demo mode for signup if Firebase not configured
        if (!isFirebaseConfigured()) {
          activateDemoMode(email);
        }

      } else if (mode === 'signin') {
        // Enhanced signin
        if (isFirebaseConfigured()) {
          try {
            const { user, error } = await signInWithEmail(email, password);
            
            if (!error && user) {
              toast({
                title: "Welcome Back! 👋",
                description: "You've been signed in successfully.",
              });
              onSuccess();
              onClose();
              return;
            }
          } catch (firebaseError: any) {
            console.warn('Firebase signin failed:', firebaseError);
            throw firebaseError;
          }
        }

        // Demo mode fallback for signin if Firebase not configured
        if (!isFirebaseConfigured() && email && password.length >= 8) {
          activateDemoMode(email);
        } else if (!isFirebaseConfigured()) {
          toast({
            title: "Authentication Failed",
            description: "Firebase is not configured. Using demo mode requires valid email and password (8+ chars).",
            variant: "destructive",
          });
        }
      }

    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: mode === 'signup' ? "Sign Up Failed" : "Sign In Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFirebaseConfigured()) {
        const { error } = await resetPassword(email);
        
        if (error) {
          throw new Error(error);
        }
      } else {
        toast({
          title: "Password Reset Unavailable",
          description: "Password reset is not available in demo mode. Please use demo credentials.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Reset Email Sent! 📧",
        description: "Check your email for password reset instructions.",
      });
      
      setMode('signin');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setPasswordStrength(0);
    setGdprConsent({ marketing: false, analytics: false, required: false });
    setMode('signin');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🪔</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Smart Spend
            </span>
          </div>
          <DialogTitle className="text-center">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'signin' && 'Sign in to continue managing your finances'}
            {mode === 'signup' && 'Join thousands of Indians managing their finances smartly'}
            {mode === 'reset' && 'Enter your email to receive reset instructions'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration Status Alerts */}
          {!isFirebaseConfigured() && mode !== 'reset' && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Demo Mode Available:</strong> Firebase authentication is not configured. 
                You can still use the app in demo mode with any email and password (8+ characters).
              </AlertDescription>
            </Alert>
          )}

          {isFirebaseConfigured() && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Secure Authentication:</strong> Your data is protected with enterprise-grade Firebase security.
              </AlertDescription>
            </Alert>
          )}

          {/* Email/Password Form */}
          <form onSubmit={mode === 'reset' ? handlePasswordReset : handleEmailAuth} className="space-y-4">
            
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required={mode === 'signup'}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {mode === 'signup' && password && (
                  <div className="space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength
                              ? level <= 2 ? 'bg-red-500' : level <= 3 ? 'bg-yellow-500' : level <= 4 ? 'bg-blue-500' : 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${getPasswordStrengthText().color}`}>
                      {getPasswordStrengthText().text}
                    </p>
                  </div>
                )}
                
                {mode === 'signin' && (
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('reset')}
                      className="text-sm text-orange-600 dark:text-orange-400 p-0 h-auto"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* GDPR Compliance for Signup */}
            {mode === 'signup' && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-sm">Privacy & Data Protection</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="gdpr-required"
                      checked={gdprConsent.required}
                      onCheckedChange={(checked) => 
                        setGdprConsent(prev => ({ ...prev, required: !!checked }))
                      }
                      required
                    />
                    <Label htmlFor="gdpr-required" className="text-sm leading-relaxed">
                      I agree to the <a href="/privacy" target="_blank" className="text-orange-600 dark:text-orange-400 underline">Privacy Policy</a> and 
                      <a href="/terms" target="_blank" className="text-orange-600 dark:text-orange-400 underline ml-1">Terms of Service</a> *
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="gdpr-marketing"
                      checked={gdprConsent.marketing}
                      onCheckedChange={(checked) => 
                        setGdprConsent(prev => ({ ...prev, marketing: !!checked }))
                      }
                    />
                    <Label htmlFor="gdpr-marketing" className="text-sm leading-relaxed">
                      I consent to receiving marketing communications (optional)
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="gdpr-analytics"
                      checked={gdprConsent.analytics}
                      onCheckedChange={(checked) => 
                        setGdprConsent(prev => ({ ...prev, analytics: !!checked }))
                      }
                    />
                    <Label htmlFor="gdpr-analytics" className="text-sm leading-relaxed">
                      I consent to analytics and usage tracking to improve the service (optional)
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing In...' : mode === 'signup' ? 'Creating Account...' : 'Sending Reset...'}
                </>
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Email'}
                </>
              )}
            </Button>
          </form>

          {/* Mode Switching */}
          <div className="text-center space-y-2">
            {mode === 'signin' && (
              <Button
                variant="link"
                onClick={() => setMode('signup')}
                className="text-orange-600 dark:text-orange-400"
                disabled={isLoading}
              >
                Don't have an account? Sign up
              </Button>
            )}
            
            {mode === 'signup' && (
              <Button
                variant="link"
                onClick={() => setMode('signin')}
                className="text-orange-600 dark:text-orange-400"
                disabled={isLoading}
              >
                Already have an account? Sign in
              </Button>
            )}
            
            {mode === 'reset' && (
              <Button
                variant="link"
                onClick={() => setMode('signin')}
                className="text-orange-600 dark:text-orange-400"
                disabled={isLoading}
              >
                Back to sign in
              </Button>
            )}
          </div>

          {/* Demo Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t pt-4">
            <p className="mb-2">For testing purposes:</p>
            <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
              Email: demo@smartspend.com<br />
              Password: password123
            </p>
            <p className="text-xs mt-1 text-orange-600 dark:text-orange-400">
              {!isFirebaseConfigured() 
                ? 'Demo mode active - use any email and password (8+ chars)'
                : 'Demo mode available if Firebase services are unavailable'
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;