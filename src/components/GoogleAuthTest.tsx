import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { signInWithGoogle, isFirebaseConfigured } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'loading';
  message: string;
  details?: string;
}

const GoogleAuthTest = () => {
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

    // Test 2: Environment Variables
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
    
    results[1] = {
      test: 'Environment Variables',
      status: missingVars.length === 0 ? 'pass' : 'fail',
      message: missingVars.length === 0 
        ? 'All required environment variables are present'
        : `Missing ${missingVars.length} environment variable(s)`,
      details: missingVars.length > 0 
        ? `Missing: ${missingVars.join(', ')}`
        : 'All Firebase environment variables are configured'
    };
    setTestResults([...results]);

    // Test 3: Google OAuth Provider
    if (isConfigured) {
      results.push({
        test: 'Google OAuth Provider',
        status: 'loading',
        message: 'Testing Google OAuth provider...'
      });
      setTestResults([...results]);

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // This will fail if OAuth is not properly configured
        await signInWithGoogle();
        
        results[2] = {
          test: 'Google OAuth Provider',
          status: 'pass',
          message: 'Google OAuth is working correctly',
          details: 'Successfully initiated Google sign-in flow'
        };
      } catch (error: any) {
        results[2] = {
          test: 'Google OAuth Provider',
          status: error.message.includes('popup-closed-by-user') ? 'warning' : 'fail',
          message: error.message.includes('popup-closed-by-user') 
            ? 'Google OAuth is configured (user cancelled)'
            : 'Google OAuth configuration issue',
          details: error.message
        };
      }
      setTestResults([...results]);
    }

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

    // Test 5: Session Management
    results.push({
      test: 'Session Management',
      status: 'loading',
      message: 'Testing session management...'
    });
    setTestResults([...results]);

    await new Promise(resolve => setTimeout(resolve, 500));

    const sessionIndex = results.length - 1;
    const hasLocalSession = localStorage.getItem('demo_user') || localStorage.getItem('demo_session');
    
    results[sessionIndex] = {
      test: 'Session Management',
      status: user || hasLocalSession ? 'pass' : 'warning',
      message: user || hasLocalSession 
        ? 'Session management working correctly'
        : 'No active session found',
      details: user 
        ? 'Active user session detected'
        : hasLocalSession 
          ? 'Demo session active'
          : 'No session data found'
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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Google Authentication Test Suite</span>
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
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Auth Status */}
        <Alert>
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
            <h3 className="font-semibold">Test Results:</h3>
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
              <strong>Setup Required:</strong> Some tests failed. Please check your Firebase configuration:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                <li>Enable Authentication and configure Google OAuth</li>
                <li>Add your domain to authorized domains</li>
                <li>Copy configuration to your .env file</li>
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
      </CardContent>
    </Card>
  );
};

export default GoogleAuthTest;