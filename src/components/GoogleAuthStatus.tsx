import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw, Shield, Info } from 'lucide-react';
import { isFirebaseConfigured, isGoogleOAuthAvailable, signInWithGoogle } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'loading';
  message: string;
  details?: string;
}

const GoogleAuthStatus = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const results: TestResult[] = [];

    // Test 1: Firebase Configuration
    results.push({
      test: 'Firebase Configuration',
      status: 'loading',
      message: 'Checking Firebase configuration...'
    });
    setTestResults([...results]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const isConfigured = isFirebaseConfigured();
    results[0] = {
      test: 'Firebase Configuration',
      status: isConfigured ? 'pass' : 'fail',
      message: isConfigured 
        ? 'Firebase is properly configured' 
        : 'Firebase configuration missing or invalid',
      details: isConfigured 
        ? 'All required environment variables are present'
        : 'Check VITE_FIREBASE_* environment variables in .env file'
    };
    setTestResults([...results]);

    // Test 2: Google OAuth Configuration
    results.push({
      test: 'Google OAuth Configuration',
      status: 'loading',
      message: 'Checking Google OAuth configuration...'
    });
    setTestResults([...results]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const isGoogleAvailable = isGoogleOAuthAvailable();
    results[1] = {
      test: 'Google OAuth Configuration',
      status: isGoogleAvailable ? 'pass' : (isConfigured ? 'fail' : 'warning'),
      message: isGoogleAvailable 
        ? 'Google OAuth is properly configured' 
        : (isConfigured ? 'Google OAuth configuration issue' : 'Google OAuth unavailable (Firebase not configured)'),
      details: isGoogleAvailable 
        ? 'Google provider is enabled and configured'
        : (isConfigured ? 'Check Google OAuth setup in Firebase console and Google Cloud Console' : 'Configure Firebase first, then set up Google OAuth')
    };
    setTestResults([...results]);

    // Test 3: Environment Variables
    results.push({
      test: 'Environment Variables',
      status: 'loading',
      message: 'Checking environment variables...'
    });
    setTestResults([...results]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
    const invalidVars = requiredVars.filter(varName => {
      const value = import.meta.env[varName];
      return value && (
        value === 'your_firebase_api_key' || 
        value.includes('your_project') || 
        value === 'your_project_id'
      );
    });
    
    results[2] = {
      test: 'Environment Variables',
      status: missingVars.length === 0 && invalidVars.length === 0 ? 'pass' : 'fail',
      message: missingVars.length === 0 && invalidVars.length === 0
        ? 'All required environment variables are present and valid'
        : `${missingVars.length > 0 ? 'Missing' : 'Invalid'} environment variables detected`,
      details: missingVars.length > 0 
        ? `Missing: ${missingVars.join(', ')}`
        : invalidVars.length > 0
          ? `Invalid placeholder values: ${invalidVars.join(', ')}`
          : 'All Firebase environment variables are configured correctly'
    };
    setTestResults([...results]);

    // Test 4: Authentication State
    results.push({
      test: 'Authentication State',
      status: 'loading',
      message: 'Checking authentication state...'
    });
    setTestResults([...results]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const authIndex = results.length - 1;
    results[authIndex] = {
      test: 'Authentication State',
      status: user ? 'pass' : 'warning',
      message: user 
        ? `User authenticated: ${user.email}` 
        : 'No user currently authenticated',
      details: user 
        ? `Provider: ${user.provider}, ID: ${user.id.substring(0, 8)}...`
        : 'User needs to sign in to test authentication flow'
    };
    setTestResults([...results]);

    // Test 5: Google Sign-In Test (only if configured)
    if (isGoogleAvailable && !user) {
      results.push({
        test: 'Google Sign-In Test',
        status: 'loading',
        message: 'Testing Google sign-in functionality...'
      });
      setTestResults([...results]);

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // Don't actually perform the sign-in, just check if the function exists
        results[results.length - 1] = {
          test: 'Google Sign-In Test',
          status: 'warning',
          message: 'Google sign-in is available but not tested',
          details: 'Click the "Test Google Sign-In" button to manually test the functionality'
        };
      } catch (error: any) {
        results[results.length - 1] = {
          test: 'Google Sign-In Test',
          status: 'fail',
          message: 'Google sign-in test failed',
          details: error.message
        };
      }
      setTestResults([...results]);
    }

    // Test 6: Browser Compatibility
    results.push({
      test: 'Browser Compatibility',
      status: 'loading',
      message: 'Checking browser compatibility...'
    });
    setTestResults([...results]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const isCompatibleBrowser = 
      typeof window !== 'undefined' && 
      typeof window.localStorage !== 'undefined' && 
      typeof window.indexedDB !== 'undefined';
    
    results[results.length - 1] = {
      test: 'Browser Compatibility',
      status: isCompatibleBrowser ? 'pass' : 'warning',
      message: isCompatibleBrowser 
        ? 'Browser is compatible with all authentication features' 
        : 'Browser may have limited authentication compatibility',
      details: isCompatibleBrowser 
        ? `Browser: ${navigator.userAgent}`
        : 'Some features like persistent authentication may not work in this browser'
    };
    setTestResults([...results]);

    setIsRunning(false);

    // Show summary toast
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;
    
    toast({
      title: "Authentication Test Complete",
      description: `${passCount} passed, ${failCount} failed`,
      variant: failCount > 0 ? "destructive" : "default",
    });
  };

  const testGoogleSignIn = async () => {
    if (!isGoogleOAuthAvailable()) {
      toast({
        title: "Google OAuth Not Configured",
        description: "Please configure Google OAuth before testing sign-in",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRunning(true);
      toast({
        title: "Starting Google Sign-In Test",
        description: "Please complete the Google authentication flow",
      });
      
      await signInWithGoogle();
      
      toast({
        title: "Google Sign-In Successful",
        description: "Authentication completed successfully",
      });
    } catch (error: any) {
      console.error('Google sign-in test error:', error);
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "An error occurred during Google sign-in",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">PASS</Badge>;
      case 'fail':
        return <Badge variant="destructive">FAIL</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">WARNING</Badge>;
      case 'loading':
        return <Badge className="bg-blue-100 text-blue-800">RUNNING</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Google Authentication Status
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running Tests...' : 'Run Diagnostics'}
          </Button>
          
          {isGoogleOAuthAvailable() && (
            <Button
              onClick={testGoogleSignIn}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Test Google Sign-In
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Auth Status */}
        <Alert className={user ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
          {user ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Info className="h-4 w-4 text-blue-600" />
          )}
          <AlertDescription>
            <strong>Current Status:</strong> {user 
              ? `Authenticated as ${user.email} (${user.provider})`
              : 'Not authenticated'
            }
          </AlertDescription>
        </Alert>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Diagnostic Results:</h3>
            {testResults.map((result, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 border rounded-lg"
              >
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{result.test}</h4>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  {result.details && (
                    <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Setup Instructions */}
        {testResults.some(r => r.status === 'fail') && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Setup Required:</strong> Some tests failed. Please check your Firebase and Google OAuth configuration:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                <li>Enable Authentication and configure Google OAuth</li>
                <li>Add your domain to authorized domains</li>
                <li>Copy configuration to your .env file</li>
                <li>See <a href="/docs/GOOGLE_OAUTH_SETUP.md" className="underline">Google OAuth Setup Guide</a> for detailed instructions</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {testResults.length > 0 && testResults.every(r => r.status === 'pass') && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>All Tests Passed!</strong> Google authentication is properly configured and working.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Fix Suggestions */}
        {!isFirebaseConfigured() && (
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">Quick Fix: Configure Firebase</h4>
            <p className="text-sm text-blue-700 mb-3">
              Add the following environment variables to your <code className="bg-blue-100 px-1 py-0.5 rounded">.env</code> file:
            </p>
            <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
{`VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id`}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAuthStatus;