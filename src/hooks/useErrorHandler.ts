import { useToast } from '@/hooks/use-toast';
import { ErrorHandler, AppError } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: any, context?: string, showToast = true) => {
    let appError: AppError;

    // Determine error type and handle accordingly
    if (context === 'auth') {
      appError = ErrorHandler.handleAuthError(error);
    } else if (context === 'database') {
      appError = ErrorHandler.handleDatabaseError(error);
    } else if (context === 'network') {
      appError = ErrorHandler.handleNetworkError(error);
    } else {
      appError = {
        message: error?.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        details: error
      };
    }

    // Log the error
    ErrorHandler.logError(appError, context);

    // Show toast notification if requested
    if (showToast) {
      toast({
        title: 'Error',
        description: appError.message,
        variant: 'destructive',
      });
    }

    return appError;
  };

  return { handleError };
};