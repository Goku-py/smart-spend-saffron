import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { isDemoMode } from '@/utils/demoData';

const DemoModeIndicator: React.FC = () => {
  if (!isDemoMode()) return null;

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> You're using Smart Spend in demo mode. 
        Data is stored locally and won't sync across devices. 
        <a href="/auth" className="underline ml-1">Create an account</a> for full features.
      </AlertDescription>
    </Alert>
  );
};

export default DemoModeIndicator;