
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle,
  resetPassword
} from "../integrations/supabase/client";

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
        const { data, error } = await signUpWithEmail(email, password, fullName);
        
        if (error) {
          throw new Error(error.message);
        }

        if (data?.user) {
          toast({
            title: "Account Created! 🎉",
            description: "Please check your email to verify your account.",
          });
          onSuccess();
          onClose();
        }
      } else if (mode === 'signin') {
        const { data, error } = await signInWithEmail(email, password);
        
        if (error) {
          throw new Error(error.message);
        }

        if (data?.user) {
          toast({
            title: "Welcome Back! 👋",
            description: "You've been signed in successfully.",
          });
          onSuccess();
          onClose();
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: mode === 'signup' ? "Sign Up Failed" : "Sign In Failed",
        description: error?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
      
      setMode('signin');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: error?.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        throw new Error(error.message);
      }

      // Google auth will redirect, so we don't need to handle success here
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: "Google Sign In Failed",
        description: error?.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
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
          {/* Security Alert */}
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Secure Authentication:</strong> Your data is protected with enterprise-grade Supabase security.
            </AlertDescription>
          </Alert>

          {/* Google Sign In Button */}
          {mode !== 'reset' && (
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </Button>
          )}

          {/* Divider */}
          {mode !== 'reset' && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
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
                              ? level <= 2
                                ? 'bg-red-500'
                                : level <= 3
                                ? 'bg-yellow-500'
                                : level <= 4
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${getPasswordStrengthText().color}`}>
                      Password Strength: {getPasswordStrengthText().text}
                    </p>
                  </div>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="gdpr-required"
                    checked={gdprConsent.required}
                    onCheckedChange={(checked) => 
                      setGdprConsent(prev => ({ ...prev, required: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="gdpr-required" className="text-sm">
                    I accept the <a href="/privacy" className="text-orange-600 dark:text-orange-400 hover:underline">Privacy Policy</a> and <a href="/terms" className="text-orange-600 dark:text-orange-400 hover:underline">Terms of Service</a> *
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="gdpr-marketing"
                    checked={gdprConsent.marketing}
                    onCheckedChange={(checked) => 
                      setGdprConsent(prev => ({ ...prev, marketing: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="gdpr-marketing" className="text-sm">
                    I agree to receive marketing communications
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="gdpr-analytics"
                    checked={gdprConsent.analytics}
                    onCheckedChange={(checked) => 
                      setGdprConsent(prev => ({ ...prev, analytics: checked as boolean }))
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="gdpr-analytics" className="text-sm">
                    I agree to the use of analytics cookies
                  </Label>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : mode === 'signin' ? (
                'Sign In'
              ) : mode === 'signup' ? (
                'Create Account'
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            {mode === 'signin' && (
              <>
                <Button
                  variant="link"
                  onClick={() => setMode('reset')}
                  className="text-orange-600 dark:text-orange-400"
                  disabled={isLoading}
                >
                  Forgot your password?
                </Button>
                <Button
                  variant="link"
                  onClick={() => setMode('signup')}
                  className="text-orange-600 dark:text-orange-400"
                  disabled={isLoading}
                >
                  Don't have an account? Sign up
                </Button>
              </>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
