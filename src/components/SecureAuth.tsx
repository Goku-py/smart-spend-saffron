import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, Lock, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  loginUser, 
  registerUser, 
  initiatePasswordReset, 
  resetPassword, 
  validateEmail, 
  validatePassword 
} from '../lib/auth';

interface SecureAuthProps {
  onAuthSuccess: (user: any, sessionToken: string) => void;
  mode?: 'login' | 'register' | 'reset';
}

const SecureAuth: React.FC<SecureAuthProps> = ({ onAuthSuccess, mode: initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset' | 'resetConfirm'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
    
    // Real-time password strength validation
    if (field === 'password') {
      const validation = validatePassword(value);
      setPasswordStrength(validation.isValid ? 5 : validation.errors.length);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      if (mode === 'login') {
        const result = await loginUser(
          formData.email, 
          formData.password,
          window.location.hostname, // IP address simulation
          navigator.userAgent
        );
        
        if (result.success && result.user && result.sessionToken) {
          toast({
            title: "Login Successful",
            description: `Welcome back${result.user.role === 'admin' ? ', Administrator' : ''}!`,
          });
          onAuthSuccess(result.user, result.sessionToken);
        } else {
          setErrors([result.error || 'Login failed']);
        }
      } else if (mode === 'register') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setErrors(['Passwords do not match']);
          return;
        }
        
        const result = await registerUser(formData.email, formData.password);
        
        if (result.success) {
          toast({
            title: "Registration Successful",
            description: "Your account has been created. Please log in.",
          });
          setMode('login');
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } else {
          setErrors([result.error || 'Registration failed']);
        }
      } else if (mode === 'reset') {
        const result = await initiatePasswordReset(formData.email);
        
        if (result.success) {
          toast({
            title: "Reset Email Sent",
            description: "Check your email for password reset instructions.",
          });
          // In demo mode, show the reset token
          if (result.resetToken) {
            setFormData(prev => ({ ...prev, resetToken: result.resetToken }));
            setMode('resetConfirm');
          }
        } else {
          setErrors([result.error || 'Password reset failed']);
        }
      } else if (mode === 'resetConfirm') {
        const result = await resetPassword(formData.email, formData.password, formData.resetToken);
        
        if (result.success) {
          toast({
            title: "Password Reset Successful",
            description: "Your password has been updated. Please log in.",
          });
          setMode('login');
          setFormData({ email: formData.email, password: '', confirmPassword: '', resetToken: '' });
        } else {
          setErrors([result.error || 'Password reset failed']);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-orange-600 mr-2" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Smart Spend
          </span>
        </div>
        <CardTitle className="text-xl">
          {mode === 'login' && 'Secure Login'}
          {mode === 'register' && 'Create Account'}
          {mode === 'reset' && 'Reset Password'}
          {mode === 'resetConfirm' && 'Set New Password'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Security Notice */}
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Lock className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Secure Authentication:</strong> Your data is protected with industry-standard encryption and security measures.
          </AlertDescription>
        </Alert>

        {/* Admin Demo Notice */}
        {mode === 'login' && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Admin Demo:</strong> Use admin@system.com / Admin@123#Secure for admin access
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {errors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
            {formData.email && !validateEmail(formData.email) && (
              <p className="text-sm text-red-600">Please enter a valid email address</p>
            )}
          </div>

          {/* Password Field */}
          {mode !== 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === 'resetConfirm' ? 'New Password' : 'Password'} *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Strength Indicator */}
              {(mode === 'register' || mode === 'resetConfirm') && formData.password && (
                <div className="space-y-1">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength <= 2 ? 'text-red-600' : 
                    passwordStrength <= 3 ? 'text-yellow-600' : 
                    passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    Password strength: {getPasswordStrengthText()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Confirm Password Field */}
          {(mode === 'register' || mode === 'resetConfirm') && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
            </div>
          )}

          {/* Reset Token Field (Demo Mode) */}
          {mode === 'resetConfirm' && (
            <div className="space-y-2">
              <Label htmlFor="resetToken">Reset Token *</Label>
              <Input
                id="resetToken"
                type="text"
                value={formData.resetToken}
                onChange={(e) => handleInputChange('resetToken', e.target.value)}
                placeholder="Enter reset token from email"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                In demo mode, the reset token is displayed above
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white h-12"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                {mode === 'login' && 'Sign In Securely'}
                {mode === 'register' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Email'}
                {mode === 'resetConfirm' && 'Update Password'}
              </>
            )}
          </Button>
        </form>

        {/* Mode Switching */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'login' && (
            <>
              <Button
                variant="link"
                onClick={() => setMode('register')}
                className="text-orange-600"
                disabled={isLoading}
              >
                Don't have an account? Sign up
              </Button>
              <br />
              <Button
                variant="link"
                onClick={() => setMode('reset')}
                className="text-orange-600"
                disabled={isLoading}
              >
                Forgot your password?
              </Button>
            </>
          )}
          
          {(mode === 'register' || mode === 'reset' || mode === 'resetConfirm') && (
            <Button
              variant="link"
              onClick={() => setMode('login')}
              className="text-orange-600"
              disabled={isLoading}
            >
              Back to sign in
            </Button>
          )}
        </div>

        {/* Security Features */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Security Features
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Industry-standard password hashing (bcrypt)</li>
            <li>• Rate limiting protection</li>
            <li>• Account lockout after failed attempts</li>
            <li>• Session timeout and secure logout</li>
            <li>• Login attempt monitoring</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureAuth;