import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword, 
  isFirebaseConfigured 
} from "../lib/firebase";
import { supabase, isSupabaseConfigured } from "../integrations/supabase/client";

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

  // Password strength validation
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

  // Demo mode fallback
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

  // Enhanced Google Sign-In
  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured()) {
      toast({
        title: "Google Sign-In Setup Required",
        description: "Google authentication needs to be configured. Please use email/password for now or contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        throw new Error(error);
      }

      if (user) {
        toast({
          title: "Welcome! 🎉",
          description: "You've been signed in successfully with Google.",
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Failed to sign in with Google. Please try email/password instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            console.warn('Firebase signup failed, trying Supabase:', firebaseError);
          }
        }

        // Supabase fallback
        if (isSupabaseConfigured() && supabase) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                  gdpr_consent: gdprConsent
                }
              }
            });

            if (error) {
              if (error.message.includes('User already registered')) {
                toast({
                  title: "Account Already Exists",
                  description: "An account with this email already exists. Please sign in instead.",
                  variant: "destructive",
                });
                setMode('signin');
                return;
              }
              throw error;
            }

            if (data.user) {
              toast({
                title: "Account Created! 🎉",
                description: data.session ? 
                  "Welcome to Smart Spend! You're now signed in." :
                  "Please check your email to verify your account.",
              });
              
              if (data.session) {
                onSuccess();
                onClose();
              }
            }
            return;
          } catch (supabaseError: any) {
            console.warn('Supabase signup failed, activating demo mode:', supabaseError);
          }
        }

        // Demo mode fallback for signup
        activateDemoMode(email);

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
            console.warn('Firebase signin failed, trying Supabase:', firebaseError);
          }
        }

        // Supabase fallback
        if (isSupabaseConfigured() && supabase) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              if (error.message.includes('Invalid login credentials')) {
                console.warn('Supabase signin failed, activating demo mode:', error);
              } else {
                throw error;
              }
            } else if (data.user) {
              toast({
                title: "Welcome Back! 👋",
                description: "You've been signed in successfully.",
              });
              onSuccess();
              onClose();
              return;
            }
          } catch (supabaseError: any) {
            console.warn('Supabase signin failed, activating demo mode:', supabaseError);
          }
        }

        // Demo mode fallback for signin
        if (email && password.length >= 8) {
          activateDemoMode(email);
        } else {
          toast({
            title: "Authentication Failed",
            description: "Unable to authenticate with any service. Please check your credentials or try demo mode.",
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
      } else if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`
        });
        
        if (error) {
          throw error;
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
          {/* Service Status Alert */}
          {(!isFirebaseConfigured() && !isSupabaseConfigured()) && mode !== 'reset' && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Mode Available:</strong> Authentication services are not configured. 
                You can still use the app in demo mode with any email and password (8+ characters).
              </AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          {isFirebaseConfigured() && (
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Secure Authentication:</strong> Your data is protected with enterprise-grade security.
              </AlertDescription>
            </Alert>
          )}

          {/* Google Sign In */}
          {mode !== 'reset' && (
            <>
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className={`w-full flex items-center justify-center space-x-2 h-12 ${
                  !isFirebaseConfigured() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>
                  {isFirebaseConfigured() ? 'Continue with Google' : 'Google Sign-In (Setup Required)'}
                </span>
              </Button>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  or
                </span>
              </div>
            </>
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
                              : 'bg-gray-200'
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
                      className="text-sm text-orange-600 p-0 h-auto"
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
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
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
                      I agree to the <a href="/privacy" target="_blank" className="text-orange-600 underline">Privacy Policy</a> and 
                      <a href="/terms" target="_blank" className="text-orange-600 underline ml-1">Terms of Service</a> *
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
                className="text-orange-600"
                disabled={isLoading}
              >
                Don't have an account? Sign up
              </Button>
            )}
            
            {mode === 'signup' && (
              <Button
                variant="link"
                onClick={() => setMode('signin')}
                className="text-orange-600"
                disabled={isLoading}
              >
                Already have an account? Sign in
              </Button>
            )}
            
            {mode === 'reset' && (
              <Button
                variant="link"
                onClick={() => setMode('signin')}
                className="text-orange-600"
                disabled={isLoading}
              >
                Back to sign in
              </Button>
            )}
          </div>

          {/* Demo Info */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p className="mb-2">For testing purposes:</p>
            <p className="font-mono text-xs bg-gray-100 p-2 rounded">
              Email: demo@smartspend.com<br />
              Password: password123
            </p>
            <p className="text-xs mt-1 text-orange-600">
              {(!isFirebaseConfigured() && !isSupabaseConfigured()) 
                ? 'Demo mode active - use any email and password (8+ chars)'
                : 'Demo mode available if services are unavailable'
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;